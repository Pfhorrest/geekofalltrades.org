#!/usr/bin/env bash
# watch-docs.sh
#
# Watches local git HEAD (not origin — this reacts to every commit, even
# ones you later amend, since re-running autodoc on an amended commit
# costs nothing but a little time) and runs autodocumentation scoped to
# whichever file types that commit actually touched.
#
# Run via `npm run watch:docs` (folded into `npm run dev`).

set -u
POLL_INTERVAL=3

cd "$(git rev-parse --show-toplevel)"

echo "Watching for new commits..."

last_sha="$(git rev-parse HEAD 2>/dev/null || echo "")"
while true; do
    sleep "$POLL_INTERVAL"
    current_sha="$(git rev-parse HEAD 2>/dev/null || echo "")"
    if [[ -z "$current_sha" || "$current_sha" == "$last_sha" ]]; then
        continue
    fi

    echo "New commit detected (${current_sha:0:7}) — checking what changed..."
    if [[ -n "$last_sha" ]]; then
        changed_files="$(git diff --name-only "$last_sha" "$current_sha")"
    else
        changed_files="$(git show --name-only --pretty=format: "$current_sha")"
    fi

    ran_any=false
    if grep -q '\.ts$' <<< "$changed_files"; then
        echo "Running document:ts..."
        npm run document:ts
        ran_any=true
    fi
    if grep -q '\.scss$' <<< "$changed_files"; then
        echo "Running document:sass..."
        npm run document:sass
        ran_any=true
    fi
    if grep -q '\.php$' <<< "$changed_files"; then
        echo "Running document:php..."
        npm run document:php
        ran_any=true
    fi
    if ! $ran_any; then
        echo "No documented file types in that commit — skipping autodoc."
    fi

    last_sha="$current_sha"
    echo "Watching for new commits..."
done
