#!/usr/bin/env bash
# health-check.sh <url>
#
# Fetches <url> and fails (exit 1) unless the response contains all of
# <header>, <h1>, <nav>, <main>, <footer> — a cheap "is the page actually
# rendering" smoke test, not a substitute for the real test suite.
set -uo pipefail

url="${1:?usage: health-check.sh <url>}"

curl -fsS --max-time 30 "$url" | perl -0777 -ne \
  'exit 1 unless /(?=.*<header)(?=.*<h1)(?=.*<nav)(?=.*<main)(?=.*<footer)/s'
