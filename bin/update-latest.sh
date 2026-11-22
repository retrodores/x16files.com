#!/usr/bin/env bash

set -e
cd -- "$(dirname -- "$0")/.."
mkdir -p data
exec perl ./bin/generate-latest.pl
