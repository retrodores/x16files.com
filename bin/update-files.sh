#!/usr/bin/env bash

URL=${1}

if [ -z "$URL" ]; then
  echo "You forgot the file URL, dingus!"
  exit 1
fi

wget "$URL"

filename="${URL##*/}"

unzip "$filename"
