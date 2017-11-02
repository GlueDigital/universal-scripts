#!/usr/bin/env bash
set -e

# Run the linter
echo "Running linter..."
eslint .

# Do some cleanup, just in case
rm -rf universal-scripts.tgz demo

# Try to scaffold a new project
echo "Scaffolding demo project..."
npm pack
mv universal-scripts-*.tgz universal-scripts.tgz
yarn create react-app -- --scripts-version `pwd`/universal-scripts.tgz demo

# Build the new project
echo "Building demo project..."
( cd demo && yarn run build )

# And clean up
rm -rf universal-scripts.tgz demo

echo "All tests OK."
