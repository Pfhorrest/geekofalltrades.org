#!/usr/bin/env bash
# page-watch.sh
#
# Watches for changes to head, main, nav, header, and footer anywhere on the
# site — these are hand-edited often (including ones process_photos generates)
# and live outside ___structure / __scripts / __styles, so code-watch.sh
# never sees them. For each changed page: a health check that knows the
# exact source file (so it can catch a PHP error with zero false-positive
# risk from page content), and an HTML validation pass via `vnu`.
# # and a non-recursive broken-link/image check via linkinator.
#
# Run via `npm run dev:page-watch` (folded into `npm run dev`).

set -u
QUIET_PERIOD=2

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

tmpdir="$(mktemp -d)"
last_event_file="$tmpdir/last_event"
echo 0 > "$last_event_file"
changed_paths_file="$tmpdir/changed_paths"
: > "$changed_paths_file"

cleanup() {
    kill $(jobs -p) 2>/dev/null
    rm -rf "$tmpdir"
}
trap cleanup EXIT
trap 'cleanup; exit 130' INT TERM

watching_message() {
    echo "Watching page content files (${QUIET_PERIOD}s quiet period)..."
}
watching_message

if command -v vnu >/dev/null 2>&1; then
    echo "(HTML validation via vnu enabled)"
else
    echo "(vnu not found on PATH — skipping HTML validation; health checks still run)"
fi

fswatch --exclude 'photos/' --exclude 'node_modules/' --exclude '\.git/' . | while IFS= read -r changed_path; do
    case "$changed_path" in
        */__head.php|*/__main.php|*/__nav.php|*/__header.php|*/__footer.php)
            date +%s > "$last_event_file"
            echo "$changed_path" >> "$changed_paths_file"
            ;;
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

    pages_file="$tmpdir/pages_to_check"
    sort -u "$changed_paths_file" > "$pages_file"
    : > "$changed_paths_file"

    while IFS= read -r changed_path; do
        [[ -z "$changed_path" ]] && continue
        dir="$(dirname "$changed_path")"
        rel_dir="${dir#"$REPO_ROOT"/}"
        [[ "$rel_dir" == "$REPO_ROOT" ]] && rel_dir=""

        # Avoid a double slash for the home page specifically (rel_dir
        # empty) — http://host:port// is a different, and apparently
        # differently-handled, request than http://host:port/.
        if [[ -z "$rel_dir" ]]; then
            url="http://geekofalltrades.local:8000/"
        else
            url="http://geekofalltrades.local:8000/${rel_dir}/"
        fi

        echo "Checking ${url}"

        # A failed health check means something fundamental is broken
        # (a PHP error, missing structure) — checking HTML validity or
        # links on that same broken output isn't useful, so skip to the
        # next page in this batch rather than running those too.
        if ! bash scripts/health-check.sh "$url" "$changed_path"; then
            echo "  Health check FAILED — skipping HTML/link checks for this page." >&2
            continue
        fi
        echo "  Health check OK."

        if command -v vnu >/dev/null 2>&1; then
            if curl -s "$url" | vnu --errors-only - 2>&1; then
                echo "  HTML valid."
            else
                echo "  HTML validation issues reported above." >&2
            fi
        fi

        # --concurrency 1: PHP's built-in dev server is single-threaded
        # if npx linkinator "$url" --concurrency 1 2>&1; then
        #     echo "  Links/images OK."
        # else
        #     echo "  Broken links/images reported above." >&2
        # fi
    done < "$pages_file"

    last_processed="$last_event"
    watching_message
done