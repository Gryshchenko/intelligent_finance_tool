#!/usr/bin/env bash
# Builds /opt/tenpercent/.env from SSM Parameter Store plus the image tag this
# revision was built from. Secrets never travel through the pipeline artifact.
set -euo pipefail

ENV_NAME="${TENPERCENT_ENV:-prod}"
TARGET=/opt/tenpercent/.env

# IMDSv2 only - the launch template sets HttpTokens: required, so an unauthenticated
# metadata request just hangs up on us.
TOKEN=$(curl -sf -X PUT http://169.254.169.254/latest/api/token \
    -H 'X-aws-ec2-metadata-token-ttl-seconds: 300')
AWS_REGION=$(curl -sf -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/placement/region)
export AWS_REGION

umask 077

# The CLI paginates by itself; --with-decryption is what turns SecureString into
# its plaintext, and the instance role is allowed exactly this path.
aws ssm get-parameters-by-path \
    --path "/tenpercent/${ENV_NAME}" \
    --recursive \
    --with-decryption \
    --output json \
  | python3 -c '
import json, sys

params = json.load(sys.stdin)["Parameters"]
if not params:
    sys.exit("no parameters under the path - nothing to render")

out = []
for p in params:
    # /tenpercent/prod/JWT_SECRET -> JWT_SECRET
    key = p["Name"].rsplit("/", 1)[-1]
    value = p["Value"]
    # A newline would silently truncate the env file and leave the rest as junk.
    if "\n" in value:
        sys.exit(f"{key}: multi-line values are not supported in an env file")
    out.append(f"{key}={value}")

sys.stdout.write("\n".join(sorted(out)) + "\n")
' > "$TARGET"

# SERVER_IMAGE / SERVER_IMAGE_TAG / SENTRY_RELEASE - written by CodeBuild, this is
# what pins the deployment to the exact image built from this commit.
cat /opt/tenpercent/image.env >> "$TARGET"

# The IAM token signer (RDS) and the SES client need it; it is the host's own
# region, not a secret, so it comes from instance metadata rather than SSM.
echo "AWS_REGION=${AWS_REGION}" >> "$TARGET"

chmod 600 "$TARGET"
chown root:root "$TARGET"

# Fail here rather than inside compose, where a missing variable shows up as a
# cryptic interpolation error.
for required in API_DOMAIN ACME_EMAIL DB_HOST DB_NAME DB_USER_APP DB_USER_MIGRATOR REDIS_PASSWORD JWT_SECRET; do
    grep -q "^${required}=" "$TARGET" || { echo "missing parameter: ${required}"; exit 1; }
done
