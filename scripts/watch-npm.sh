#!/usr/bin/env bash
# watch:npm.sh
#
# Runs npm update once a day to keep dependencies up-to-date.
#
# Run via `npm run watch:npm` (folded into `npm run dev`).

unset npm_config_prefix
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

set -u
POLL_INTERVAL=86400

while true; do
    echo "Updating dependencies..."
    npm update
    echo "Waiting ${POLL_INTERVAL}s (until tomorrow)..."
    sleep "$POLL_INTERVAL"
done
