#!/usr/bin/env bash

set -e
cd -- "$(dirname -- "$0")/.."
mkdir -p data
exec ./bin/generate-latest.pl
