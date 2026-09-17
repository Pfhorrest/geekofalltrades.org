#!/usr/bin/env bash
# snapshot.sh <src-subdir> <snapshot-subdir> [rsync-exclude-pattern...]
#
# Takes a hardlink-based snapshot of ~/<src-subdir> (on the "goat" host)
# into a new timestamped directory under ~/<snapshot-subdir>, then points
# ~/<snapshot-subdir>/latest at it. Both paths are relative to the remote
# user's home directory. Unchanged files are hardlinked rather than
# copied, so repeated snapshots are cheap.
#
# Runs on the remote via `ssh goat bash -s --`, passing arguments in
# rather than building a remote command string — $HOME, quotes, and $
# all just work normally on the far side, no escaping needed.
set -uo pipefail

src_subdir="${1:?usage: snapshot.sh <src-subdir> <snapshot-subdir> [exclude...]}"
snap_subdir="${2:?usage: snapshot.sh <src-subdir> <snapshot-subdir> [exclude...]}"
shift 2

excludes=()
for pattern in "$@"; do
  excludes+=(--exclude="$pattern")
done

ssh goat bash -s -- "$src_subdir" "$snap_subdir" "${excludes[@]}" <<'REMOTE'
set -e
SRC="$HOME/$1"
SNAP_ROOT="$HOME/$2"
shift 2
TS="$(date +%F-%H%M%S)"
SNAP="$SNAP_ROOT/$TS"
mkdir -p "$SNAP"
rsync -ah --omit-dir-times --itemize-changes --exclude=.dh-diag "$@" --link-dest="$SRC" "$SRC/" "$SNAP/"
ln -sfn "$SNAP" "$SNAP_ROOT/latest"
REMOTE
