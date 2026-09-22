#!/usr/bin/env bash
# code-watch.sh
#
# Watches ___structure and any __scripts/__styles folders (wherever they
# occur — root-level or per-content-directory overrides) for .ts/.scss/.php
# changes. After a quiet period, runs whichever of test:ts/test:php apply,
# and only if those pass, compiles whichever of ts/scss apply (single-pass,
# not watch mode), then does a local health check on the home page.
#
# __head.php/__main.php are handled by page-watch.sh instead — they never
# live inside ___structure/__scripts/__styles, so this watcher naturally
# never sees them.
#
# Run via `npm run dev:code-watch` (folded into `npm run dev`).

set -u
QUIET_PERIOD=2

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

tmpdir="$(mktemp -d)"
last_event_file="$tmpdir/last_event"
echo 0 > "$last_event_file"
touched_ts_file="$tmpdir/touched_ts"
touched_scss_file="$tmpdir/touched_scss"
touched_php_file="$tmpdir/touched_php"

cleanup() {
    kill $(jobs -p) 2>/dev/null
    rm -rf "$tmpdir"
}
trap cleanup EXIT
trap 'cleanup; exit 130' INT TERM

watching_message() {
    echo "Watching ___structure, __scripts, __styles (${QUIET_PERIOD}s quiet period)..."
}
watching_message

# A path counts as "in scope" if ___structure, __scripts, or __styles
# appears as a whole path component — bash's own =~ (extended regex),
# not fswatch's, since it's a primitive I can be fully confident in.
is_code_path() {
    [[ "$1" =~ (^|/)(___structure|__scripts|__styles)(/|$) ]]
}

# Background job just records what changed and when — filtering by
# path/extension happens here in bash rather than via fswatch's own
# include/exclude regex, which I'd rather not guess at a second time
# this project.
fswatch --exclude 'photos/' --exclude 'node_modules/' --exclude '\.git/' . | while IFS= read -r changed_path; do
    is_code_path "$changed_path" || continue
    date +%s > "$last_event_file"
    case "$changed_path" in
        *.ts) touch "$touched_ts_file" ;;
        *.scss) touch "$touched_scss_file" ;;
        *.php) touch "$touched_php_file" ;;
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
    if (( now - last_event < QUIET_PERIOD )); then
        continue
    fi

    did_ts=false; did_scss=false; did_php=false
    [[ -f "$touched_ts_file" ]] && did_ts=true && rm -f "$touched_ts_file"
    [[ -f "$touched_scss_file" ]] && did_scss=true && rm -f "$touched_scss_file"
    [[ -f "$touched_php_file" ]] && did_php=true && rm -f "$touched_php_file"

    ok=true

    if $did_ts; then
        echo "Running test:ts..."
        npm run test:ts || ok=false
    fi
    if $ok && $did_php; then
        echo "Running test:php..."
        npm run test:php || ok=false
    fi

    if $ok && $did_ts; then
        echo "Compiling TypeScript..."
        npm run process:ts || ok=false
    fi
    if $ok && $did_scss; then
        echo "Compiling Sass..."
        npm run process:sass || ok=false
    fi

    if $ok; then
        echo "Checking local home page..."
        bash scripts/health-check.sh http://geekofalltrades.local:8000/ "$REPO_ROOT/__main.php" || echo "Local health check failed." >&2
    else
        echo "Skipping compile/health-check — a test failed above." >&2
    fi

    last_processed="$last_event"
    watching_message
done