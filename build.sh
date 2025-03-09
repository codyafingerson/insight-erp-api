#!/bin/bash

# Build the project
npm run build

mkdir dist/emails

# Ensure email templates are up copied to the dist folder
cp -r src/emails/*.hbs dist/emails/

# Copy the package.json file to the dist folder
cp package.json dist/

# Copy the package-lock.json file to the dist folder
cp package-lock.json dist/

# Copy the .env file to the dist folder
cp .env* dist/

