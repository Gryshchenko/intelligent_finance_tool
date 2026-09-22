#!/usr/bin/env bash
set -euo pipefail
cd /opt/tenpercent

set -a
source ./image.env
set +a

# Registry host is the part before the first slash of the repository URI.
REGISTRY="${SERVER_IMAGE%%/*}"

TOKEN=$(curl -sf -X PUT http://169.254.169.254/latest/api/token \
    -H 'X-aws-ec2-metadata-token-ttl-seconds: 300')
REGION=$(curl -sf -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/placement/region)

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$REGISTRY"

docker compose --env-file .env -f compose.yaml pull

# --no-build matters: the server service carries a `build:` section for local use,
# and its context (../../) does not exist on this host.
# `up -d` also blocks until the migrate service exits 0 - that is the schema
# migration gate, no separate step needed.
docker compose --env-file .env -f compose.yaml up -d --no-build --remove-orphans

# Old image layers pile up on a 20 GiB disk otherwise.
docker image prune -af --filter 'until=168h' || true
