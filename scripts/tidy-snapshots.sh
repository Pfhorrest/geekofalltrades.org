#!/usr/bin/env bash
# tidy-snapshots.sh <snapshot-subdir> [keep-count]
#
# Deletes all but the <keep-count> most recent snapshots under
# ~/<snapshot-subdir> on "goat" (default: keep 1). Never touches the
# "latest" symlink itself.
set -uo pipefail

snap_subdir="${1:?usage: tidy-snapshots.sh <snapshot-subdir> [keep-count]}"
keep="${2:-1}"

ssh goat bash -s -- "$snap_subdir" "$keep" <<'REMOTE'
set -e
SNAP_ROOT="$HOME/$1"
N="$2"
cd "$SNAP_ROOT"
ls -1dt */ | grep -v '^latest/$' | tail -n +"$((N+1))" | xargs -r rm -rf
REMOTE
