#!/usr/bin/env bash
# process-photos-watch.sh
#
# Watches photos/ and runs process_photos whenever something changes,
# waiting for a quiet period first so a whole batch export lands before
# anything runs, rather than reacting to the first file and generating
# a one-image gallery partway through a big export.
#
# Run via `npm run process:photos:watch`.

set -u
QUIET_PERIOD=10  # seconds of no further changes before processing

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT/photos"
. process_photos/.venv/bin/activate

last_event_file="$(mktemp)"
echo 0 > "$last_event_file"

cleanup() {
    kill $(jobs -p) 2>/dev/null
    rm -f "$last_event_file"
}
trap cleanup EXIT
trap 'cleanup; exit 130' INT TERM

watching_message() {
    echo "Watching photos/ (${QUIET_PERIOD}s quiet period) — Ctrl+C to stop."
}

watching_message

# Background job's only responsibility: record WHEN the most recent
# change happened. It doesn't decide anything or run process_photos
# itself. process_photos/ is excluded — the tool's own code, tests,
# venv, and caches, not photo content. -thumb/__head/__main are its
# own generated output, so it doesn't see (and re-trigger on) its own
# writes.
fswatch --exclude 'process_photos/' --exclude '.*-thumb.*' --exclude '.*__head.*' --exclude '.*__main.*' . | while IFS= read -r _; do
    date +%s > "$last_event_file"
done &

# Foreground: poll once a second for "has it been quiet long enough".
# This deliberately avoids read -t's exit status — only plain
# timestamps and arithmetic, which can't be ambiguous the way a
# timeout-vs-EOF exit code apparently can be here.
last_processed=0
while true; do
    sleep 1
    last_event="$(cat "$last_event_file" 2>/dev/null || echo 0)"
    if [[ "$last_event" == "0" || "$last_event" == "$last_processed" ]]; then
        continue
    fi
    now="$(date +%s)"
    if (( now - last_event >= QUIET_PERIOD )); then
        echo "Batch settled — running process_photos..."
        if python3 -m process_photos; then
            echo "Syncing processed photos to staging..."
            (cd "$REPO_ROOT" && npm run deploy:stage:photos) || echo "Sync to staging failed — will retry on the next batch." >&2
        else
            echo "process_photos exited with an error — skipping the staging sync, still watching for the next batch." >&2
        fi
        last_processed="$last_event"
        watching_message
    fi
done