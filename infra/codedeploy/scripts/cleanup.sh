#!/usr/bin/env bash
# Files this deployment is about to install, removed if something OTHER than the
# agent put them there (a manual bring-up). CodeDeploy tracks and removes what it
# installed itself, but refuses to overwrite a file it does not know about.
set -euo pipefail

rm -f /opt/tenpercent/compose.yaml \
      /opt/tenpercent/Caddyfile \
      /opt/tenpercent/image.env \
      /opt/tenpercent/appspec.yml
rm -rf /opt/tenpercent/scripts

# .env is deliberately not touched here - it is rebuilt in AfterInstall, and
# keeping the old one until then means a failed deployment leaves a working host.
