#!/usr/bin/env bash
# load-tab.sh
#
# Waits for the local PHP dev server to come up, opens it in the
# browser, then idles. The final loop doesn't react to anything — it
# just keeps this process alive indefinitely so `concurrently -k` (in
# the `dev` script) doesn't kill the other three watchers the moment
# this one would otherwise finish.
set -uo pipefail

while ! nc -z geekofalltrades.local 8000; do
  sleep 0.5
done

open "http://geekofalltrades.local:8000"

while true; do
  fswatch -1 __styles __scripts *.php
done
