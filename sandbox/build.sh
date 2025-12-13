#!/bin/bash
# Build Docker sandbox images for CodeEX Auto-Grader

set -e

echo "🐳 Building CodeEX Sandbox Images..."
echo ""

# Build Python sandbox
echo "📦 Building Python sandbox..."
docker build -f Dockerfile.python -t codex-sandbox-python:3.11 .
echo "✅ Python sandbox built: codex-sandbox-python:3.11"
echo ""

# Build C++ sandbox
echo "📦 Building C++ sandbox..."
docker build -f Dockerfile.cpp -t codex-sandbox-cpp:gcc13 .
echo "✅ C++ sandbox built: codex-sandbox-cpp:gcc13"
echo ""

# Verify images
echo "📋 Verifying images..."
docker images | grep codex-sandbox
echo ""

echo "🎉 All sandbox images ready!"
echo ""
echo "Images created:"
echo "  - codex-sandbox-python:3.11"
echo "  - codex-sandbox-cpp:gcc13"
echo ""
echo "To test:"
echo "  docker run --rm codex-sandbox-python:3.11 python3 --version"
echo "  docker run --rm codex-sandbox-cpp:gcc13 g++ --version"
