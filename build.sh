#!/usr/bin/env bash

set -e

# Project path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BUILD_ENV=${1}
if [ -z $BUILD_ENV ]; then
    COMMAND="build"
else
    COMMAND="build:${BUILD_ENV}"
fi

echo "Build project with command '$COMMAND'"

docker run \
       --rm \
       -i \
       --volume $DIR:/app \
       --workdir /app \
       node:9.11 \
       /bin/bash -c "npm i && npm run $COMMAND"
