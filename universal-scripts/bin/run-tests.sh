#!/bin/bash
set -eo pipefail

rm -rf universal-scripts-*.tgz ../test

echo "Running linter..."
yarn lint
echo "📦 Building local package..."
npm pack

cd ..
mkdir test
cd test

yarn create universal-scripts test-app

echo "✅ Generated Project: ../test/test-app"

cd ../test/test-app

yarn add ../../universal-scripts/universal-scripts-*.tgz

echo "✅ Installed universal-scripts"

yarn build
echo "✅ Successful build"

# 🧹 Cleanup
echo "🧹 Cleaning..."
cd ../..
rm -rf test universal-scripts-*.tgz

echo "🏁 All Ok."
