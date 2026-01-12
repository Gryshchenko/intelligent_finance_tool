.PHONY: build-tests
build-tests: ## Build the development docker image.
	COMPOSE_BAKE=true docker compose -f docker/tests/compose.yaml build

.PHONY: start-tests
start-tests: ## Start the development docker container.
	docker compose -f docker/tests/compose.yaml up -d

.PHONY: stop-tests
stop-tests: ## Stop the development docker container.
	docker compose -f docker/tests/compose.yaml down

