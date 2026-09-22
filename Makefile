.PHONY: build-tests
build-tests: ## Build the development docker image.
	COMPOSE_BAKE=true docker compose -f docker/tests/compose.yaml build

.PHONY: start-tests
start-tests: ## Start the development docker container.
	docker compose -f docker/tests/compose.yaml up -d

.PHONY: stop-tests
stop-tests: ## Stop the development docker container.
	docker compose -f docker/tests/compose.yaml down

.PHONY: test-ci
test-ci:
	docker compose -f docker/tests/compose.yaml up \
		--build \
		--abort-on-container-exit \
		--exit-code-from ten-percent
	docker compose -f docker/tests/compose.yaml down

# ======================
# Production image
# ======================
# Built with buildx directly rather than `docker compose build`: compose
# interpolates the whole file before it builds anything, so the `${...:?}` guards
# on the runtime environment would demand a filled-in .env for an operation that
# needs no configuration at all. The image carries code only - every value reaches
# it through the container environment at start.
#
# A dirty working tree gets a `-dirty` tag, so an image built from uncommitted
# code is never mistaken in the registry for one built from a commit.
PROD_IMAGE ?= tenpercent-server
PROD_TAG ?= $(shell git rev-parse --short HEAD)$(shell test -z "$$(git status --porcelain)" || echo -dirty)
# Registry path for a release build, e.g. ghcr.io/<user>. No default on purpose.
PROD_REGISTRY ?=
# Must match the deployment host: linux/arm64 for a t4g instance, linux/amd64 for
# t3/t2. A mismatch only shows up at runtime, as `exec format error`.
PROD_PLATFORM ?= linux/arm64

.PHONY: build-prod
build-prod: ## Build the production server image for this machine's architecture.
	docker buildx build \
		-f docker/prod/Dockerfile \
		-t $(PROD_IMAGE):$(PROD_TAG) \
		-t $(PROD_IMAGE):latest \
		--load \
		.

.PHONY: start-prod
start-prod: ## Start the production stack locally. Needs a filled-in docker/prod/.env.
	docker compose -f docker/prod/compose.yaml up -d --no-build

.PHONY: stop-prod
stop-prod: ## Stop the production server container.
	docker compose -f docker/prod/compose.yaml down

# ======================
# AWS infrastructure (CloudFormation)
# ======================
# Four stacks, deployed in this order and deleted in reverse - each one imports the
# previous stacks' exports, and CloudFormation refuses to delete an export that is
# still imported. Region and credentials come from the usual AWS_PROFILE /
# AWS_REGION. Extra overrides go through CFN_PARAMS, e.g.
#   make cfn-database CFN_PARAMS="EnableIamAuth=true"
CFN_ENV ?= prod
CFN_PREFIX = tenpercent-$(CFN_ENV)
CFN_DIR = infra/cloudformation
CFN_PARAMS ?=
CFN_DEPLOY = aws cloudformation deploy --no-fail-on-empty-changeset \
	--tags Project=tenpercent Env=$(CFN_ENV)

.PHONY: cfn-lint
cfn-lint: ## Lint the CloudFormation templates (pip install cfn-lint).
	cfn-lint $(CFN_DIR)/*.yaml

.PHONY: cfn-network
cfn-network: ## Deploy the VPC and subnets.
	$(CFN_DEPLOY) --template-file $(CFN_DIR)/network.yaml --stack-name $(CFN_PREFIX)-network \
		--parameter-overrides Env=$(CFN_ENV) $(CFN_PARAMS)

.PHONY: cfn-security
cfn-security: ## Deploy security groups and the instance role.
	$(CFN_DEPLOY) --template-file $(CFN_DIR)/security.yaml --stack-name $(CFN_PREFIX)-security \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides Env=$(CFN_ENV) NetworkStack=$(CFN_PREFIX)-network $(CFN_PARAMS)

.PHONY: cfn-database
cfn-database: ## Deploy RDS Postgres (~10 min on create).
	$(CFN_DEPLOY) --template-file $(CFN_DIR)/database.yaml --stack-name $(CFN_PREFIX)-database \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides Env=$(CFN_ENV) NetworkStack=$(CFN_PREFIX)-network \
		SecurityStack=$(CFN_PREFIX)-security $(CFN_PARAMS)

.PHONY: cfn-compute
cfn-compute: ## Deploy the EC2 host and its Elastic IP.
	$(CFN_DEPLOY) --template-file $(CFN_DIR)/compute.yaml --stack-name $(CFN_PREFIX)-compute \
		--parameter-overrides Env=$(CFN_ENV) NetworkStack=$(CFN_PREFIX)-network \
		SecurityStack=$(CFN_PREFIX)-security $(CFN_PARAMS)

.PHONY: cfn-outputs
cfn-outputs: ## Print the outputs of all four stacks.
	@for s in network security database compute; do \
		echo "== $(CFN_PREFIX)-$$s"; \
		aws cloudformation describe-stacks --stack-name $(CFN_PREFIX)-$$s \
			--query 'Stacks[0].Outputs[].[OutputKey,OutputValue]' --output text || true; \
	done
