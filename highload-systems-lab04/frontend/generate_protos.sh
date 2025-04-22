#!/bin/bash

set -e

# Frontend directory (where this script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROTO_DIR="${SCRIPT_DIR}/src/proto"
SOURCE_PROTO="$(dirname "${SCRIPT_DIR}")/lightbulb.proto"

# Create proto directory if it doesn't exist
mkdir -p "${PROTO_DIR}"

# Check if source proto file exists
if [ ! -f "${SOURCE_PROTO}" ]; then
    echo "Error: Proto file not found at ${SOURCE_PROTO}"
    exit 1
fi

# Check if protoc is installed
if ! command -v protoc &> /dev/null; then
    echo "protoc not found. Installing via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Please install Homebrew first:"
        echo "See: https://brew.sh/"
        exit 1
    fi
    brew install protobuf
fi

# Get path to protoc-gen-grpc-web
PROTOC_GEN_GRPC_WEB="${SCRIPT_DIR}/node_modules/.bin/protoc-gen-grpc-web"

echo "Generating JavaScript code from ${SOURCE_PROTO} into ${PROTO_DIR}..."
protoc \
    --js_out=import_style=commonjs,binary:"${PROTO_DIR}" \
    --plugin=protoc-gen-grpc-web="${PROTOC_GEN_GRPC_WEB}" \
    --grpc-web_out=import_style=commonjs,mode=grpcwebtext:"${PROTO_DIR}" \
    -I"$(dirname "${SCRIPT_DIR}")" \
    "${SOURCE_PROTO}"

echo "Generation successful!" 