#!/usr/bin/env bash

set -e

# @cmd
pkg.local() {
    rm -rf node_modules/@jsona
    npm install ../jsona/js/core ../jsona/js/schema ../openapi/jsona-wasm-openapi ../jsona/editors/utils 
}

# @cmd
pkg.remote() {
    npm install @jsona/core @jsona/schema @jsona/openapi @jsona/editor-utils
}

# @cmd
build() {
    npm run build
}

# @cmd
dev() {
    npm run dev
}

eval "$(argc --argc-eval $0 "$@")"
