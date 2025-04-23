#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROTO_DIR="${SCRIPT_DIR}"
SOURCE_PROTO_DIR="$(dirname "${SCRIPT_DIR}")/proto"
SOURCE_PROTO="${SOURCE_PROTO_DIR}/lightbulb.proto"

# Check if source proto file exists
if [ ! -f "${SOURCE_PROTO}" ]; then
    echo "Error: Proto file not found at ${SOURCE_PROTO}"
    exit 1
fi

# Generate Python code from proto file directly using the source file
echo "Generating Python code from ${SOURCE_PROTO} into ${PROTO_DIR}..."
python -m grpc_tools.protoc \
    --proto_path="${SOURCE_PROTO_DIR}" \
    --python_out="${PROTO_DIR}" \
    --grpc_python_out="${PROTO_DIR}" \
    "${SOURCE_PROTO}"

echo "Generation successful!" 