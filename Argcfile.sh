#!/usr/bin/env bash

set -e

# @cmd
pkg.local() {
    jsona=$HOME/jsona
    yarn add $jsona/jsona/js/core $jsona/jsona/js/schema $jsona/jsona/editors/monaco
    yarn add $HOME/jsona/openapi/jsona-wasm-openapi/pkg
}

# @cmd
pkg.remote() {
    yarn add @jsona/core @jsona/schema @jsona/openapi monaco-jsona
}

# @cmd
build() {
    yarn build
}

# @cmd
dev() {
    yarn dev
}

eval "$(argc --argc-eval $0 "$@")"
