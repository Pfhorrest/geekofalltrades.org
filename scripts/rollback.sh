#!/usr/bin/env bash
# rollback.sh <snapshot-subdir> <target-subdir> [rsync-exclude-pattern...]
#
# Restores ~/<target-subdir> (on "goat") to exactly match
# ~/<snapshot-subdir>/latest, deleting anything not in the snapshot. Both
# paths are relative to the remote user's home directory. IMPORTANT: pass
# the same excludes here as you did to snapshot.sh for this same
# target — if the snapshot doesn't have e.g. photos/ in it, a --delete
# rollback without that same exclude would wipe the live photos/ instead
# of leaving it alone.
#
# Exits with rsync's own status, not grep's: grep -v exits 1 if literally
# every line gets filtered out (e.g. a no-op rollback with nothing but
# directory-time changes), which isn't a real failure.
set -u

snap_subdir="${1:?usage: rollback.sh <snapshot-subdir> <target-subdir> [exclude...]}"
target_subdir="${2:?usage: rollback.sh <snapshot-subdir> <target-subdir> [exclude...]}"
shift 2

excludes=()
for pattern in "$@"; do
  excludes+=(--exclude="$pattern")
done

ssh goat bash -s -- "$snap_subdir" "$target_subdir" "${excludes[@]}" <<'REMOTE' | grep -v '^.d'
SNAP_ROOT="$HOME/$1"
TARGET="$HOME/$2"
shift 2
rsync -ah --omit-dir-times --itemize-changes --exclude=.dh-diag "$@" --delete "$SNAP_ROOT/latest/" "$TARGET/"
REMOTE
exit "${PIPESTATUS[0]}"
