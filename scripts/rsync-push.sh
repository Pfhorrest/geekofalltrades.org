#!/usr/bin/env bash
# rsync-push.sh <src-subdir> <dst-subdir> [extra rsync args...]
#
# rsyncs ~/<src-subdir>/ to ~/<dst-subdir>/ on "goat", always excluding
# .dh-diag, .git, .venv, and node_modules. Pass along whatever else you
# need — --delete, --ignore-existing, more --exclude flags — as extra
# arguments; they're forwarded to rsync as-is.
#
# Exits with rsync's own status, not grep's — see rollback.sh for why.
set -u

src_subdir="${1:?usage: rsync-push.sh <src-subdir> <dst-subdir> [rsync-args...]}"
dst_subdir="${2:?usage: rsync-push.sh <src-subdir> <dst-subdir> [rsync-args...]}"
shift 2

ssh goat bash -s -- "$src_subdir" "$dst_subdir" "$@" <<'REMOTE' | grep -v '^.d'
SRC_SUB="$1"
DST_SUB="$2"
shift 2
rsync -ah --omit-dir-times --itemize-changes --exclude=.dh-diag --exclude=.git --exclude=.venv --exclude=node_modules "$@" "$HOME/$SRC_SUB/" "$HOME/$DST_SUB/"
REMOTE
exit "${PIPESTATUS[0]}"
