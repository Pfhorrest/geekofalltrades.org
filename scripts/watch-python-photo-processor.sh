#!/usr/bin/env bash
# watch-python-photo-processor.sh
#
# Watches photos/process_photos' own source (not its venv, caches, or
# __pycache__ — those aren't source) and runs test:py after a quiet
# period. Separate from watch-photos.sh, which excludes
# process_photos/ entirely and owns the actual photo content instead.
#
# Run via `npm run watch:ppp` (folded into `npm run dev`).

set -u
QUIET_PERIOD=2

cd "$(git rev-parse --show-toplevel)"

last_event_file="$(mktemp)"
echo 0 > "$last_event_file"

cleanup() {
    kill $(jobs -p) 2>/dev/null
    rm -f "$last_event_file"
}
trap cleanup EXIT
trap 'cleanup; exit 130' INT TERM

watching_message() {
    echo "Watching photos/process_photos/*.py (${QUIET_PERIOD}s quiet period)..."
}
watching_message

fswatch --exclude '\.venv/' --exclude '_caches/' --exclude '__pycache__/' photos/process_photos | while IFS= read -r changed_path; do
    case "$changed_path" in
        *.py) date +%s > "$last_event_file" ;;
    esac
done &

last_processed=0
while true; do
    sleep 1
    last_event="$(cat "$last_event_file" 2>/dev/null || echo 0)"
    if [[ "$last_event" == "0" || "$last_event" == "$last_processed" ]]; then
        continue
    fi
    now="$(date +%s)"
    if (( now - last_event >= QUIET_PERIOD )); then
        echo "Running test:py..."
        npm run test:py || echo "test:py failed." >&2
        last_processed="$last_event"
        watching_message
    fi
done
