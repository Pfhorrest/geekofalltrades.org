#!/usr/bin/env bash
# deploy-stage-watch.sh
#
# Watches origin/main for new pushes and deploys each to staging
# automatically. Prod is never touched here — run `npm run deploy:prod`
# yourself once staging looks good.
#
# Run via `npm run deploy:stage:watch`.

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

POLL_INTERVAL=10  # seconds between origin/main checks — tune freely

GREEN=$'\033[1;32m'
RED=$'\033[1;31m'
RESET=$'\033[0m'

banner() {
  # $1 = color, $2 = message
  printf '\a\n%s================================================%s\n' "$1" "$RESET"
  printf '%s  %s%s\n' "$1" "$2" "$RESET"
  printf '%s================================================%s\n\n' "$1" "$RESET"
}

WATCHING_MSG="Watching origin/main (${POLL_INTERVAL}s interval) — Ctrl+C to stop"
echo "$WATCHING_MSG"

# Polls what's actually been pushed to origin, not local HEAD — a commit
# isn't a real trigger until it's pushed. Only re-runs the safe deploy when
# the pushed SHA changes, so idle polling never re-runs the test suite for
# no reason. last_seen_sha lives only in this process's memory: if the
# script restarts, the next check just runs one deploy pass against
# whatever's current, which is a harmless no-op if nothing's actually new.
last_seen_sha=""
while true; do
  current_sha="$(git ls-remote origin refs/heads/main 2>/dev/null | cut -f1)"
  if [[ -n "$current_sha" && "$current_sha" != "$last_seen_sha" ]]; then
    echo "New push detected (${current_sha:0:7}) — running safe stage deploy..."
    if npm run deploy:stage:code:safe; then
      banner "$GREEN" "STAGE DEPLOY OK — ${current_sha:0:7}"
    else
      banner "$RED" "STAGE DEPLOY FAILED — rolled back — ${current_sha:0:7}"
    fi
    echo "$WATCHING_MSG"
    last_seen_sha="$current_sha"
  fi
  sleep "$POLL_INTERVAL"
done