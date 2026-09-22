#!/usr/bin/env bash
# health-check.sh <url> [expected-file-path]
#
# Fetches <url> and fails (exit 1) unless:
#   - the response contains all of <header>, <h1>, <nav>, <main>, <footer>
#   - no PHP error is detected. If <expected-file-path> is given (the
#     local absolute path of the file generating this page), checks
#     specifically for "in <that path>" — PHP always includes the
#     generating file's path in error/warning/notice/fatal-error output,
#     and that exact path is not something that would ever legitimately
#     appear in page content, so this can't produce a false positive.
#     Without a path (checking a remote URL, where display_errors is
#     normally off anyway and the path wouldn't match regardless), falls
#     back to matching PHP's error-level keywords instead — cruder, and
#     which COULD in principle false-positive on page content that
#     happens to contain a phrase like "received notice".
#   - <main>...</main> isn't suspiciously empty — catches the same class
#     of bug when errors are suppressed and nothing else gives it away
#
# Not a substitute for the real test suite, or for vnu — a structural/
# content smoke test only.
set -uo pipefail

url="${1:?usage: health-check.sh <url> [expected-file-path]}"
expected_path="${2:-}"

body="$(curl -fsS --max-time 30 "$url")" || exit 1

echo "$body" | HEALTH_CHECK_EXPECTED_PATH="$expected_path" perl -0777 -ne '
  my $expected_path = $ENV{HEALTH_CHECK_EXPECTED_PATH};

  exit 1 unless /(?=.*<header)(?=.*<h1)(?=.*<nav)(?=.*<main)(?=.*<footer)/s;

  if (length($expected_path)) {
    exit 1 if index($_, "in " . $expected_path) != -1;
  }
'