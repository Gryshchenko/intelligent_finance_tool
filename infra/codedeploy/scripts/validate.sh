#!/usr/bin/env bash
# A non-zero exit here fails the deployment, and with rollback enabled CodeDeploy
# reinstalls the last good revision - so this is the only thing standing between a
# broken build and a broken production.
set -euo pipefail

deadline=$(( SECONDS + 150 ))
status=missing

while (( SECONDS < deadline )); do
    status=$(docker inspect --format '{{.State.Health.Status}}' tenpercent-server 2>/dev/null || echo missing)
    case "$status" in
        healthy)
            echo "server is healthy"
            exit 0
            ;;
        unhealthy)
            echo "server reported unhealthy"
            docker logs --tail 50 tenpercent-server || true
            exit 1
            ;;
    esac
    sleep 5
done

echo "server did not become healthy in time (last status: ${status})"
docker logs --tail 50 tenpercent-server || true
exit 1
