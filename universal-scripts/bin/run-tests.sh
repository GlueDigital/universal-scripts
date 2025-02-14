#!/usr/bin/env bash
set -e

# Do some cleanup, just in case
rm -rf universal-scripts-*.tgz demo

# Run the linter
echo "Running linter..."
eslint .

# Try to scaffold a new project
echo "Scaffolding demo project..."
npm pack
mv universal-scripts-*.tgz universal-scripts-$(date +%s).tgz
npx create-react-app --scripts-version `pwd`/universal-scripts-*.tgz demo

# Build the new project
echo "Building demo project..."
( cd demo && yarn run build )

# And clean up
rm -rf universal-scripts-*.tgz demo

echo "All tests OK."
