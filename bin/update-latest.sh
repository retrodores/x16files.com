#!/usr/bin/env bash

git log --diff-filter=AM --name-status --date=short --pretty=format:'%ct %ad' -- files/ \
| awk '
  NF==2 && $1 ~ /^[0-9]+$/ {
    ts=$1
    split($2, d, "-")              # d[1]=YYYY d[2]=MM d[3]=DD
    date = d[2] "/" d[3] "/" d[1]  # MM/DD/YYYY
    next
  }
  NF==2 && ($1=="A" || $1=="M") {
    type = ($1=="A" ? "added" : "updated")
    file = $2
    printf "%s %s %s %s\n", ts, type, file, date
  }
' \
| sort -nr \
| head -n 75 \
| cut -d' ' -f2- \
| ./bin/generate-latest.pl
