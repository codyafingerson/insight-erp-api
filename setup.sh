#!/bin/bash

# Define the .env file path
ENV_FILE=".env"

# Generate a secure SESSION_SECRET
SESSION_SECRET=$(openssl rand -hex 32)

# Default values
# NODE_ENV="development"
PORT="8000"

# Prompt for NODE_ENV
echo "Enter the environment (development, production, etc.):"
read NODE_ENV
if [[ -z "$NODE_ENV" ]]; then
    NODE_ENV="development"
fi

# Prompt for DATABASE_URL
echo "Enter your DATABASE_URL:"
read DATABASE_URL

# Write to .env file
echo "Writing environment variables to $ENV_FILE..."
echo "NODE_ENV=$NODE_ENV" > $ENV_FILE
echo "PORT=$PORT" >> $ENV_FILE
echo "SESSION_SECRET=$SESSION_SECRET" >> $ENV_FILE
echo "DATABASE_URL=$DATABASE_URL" >> $ENV_FILE

echo ".env file created successfully!"

# Prompt to install npm modules
echo "Do you want to install npm modules? (y/n)"
read install_npm
if [[ "$install_npm" == "y" ]]; then
    npm install
fi

# Prompt to migrate the database
echo "Do you want to migrate the database? (y/n)"
read migrate_db
if [[ "$migrate_db" == "y" ]]; then
    if [[ "$NODE_ENV" == "development" ]]; then
        npx prisma generate
        npx prisma migrate dev
    else
        npx prisma generate
        npx prisma migrate deploy
    fi
fi

# Prompt to run the development server if in development mode
if [[ "$NODE_ENV" == "development" ]]; then
    echo "Do you want to start the server? (y/n)"
    read start_dev
    if [[ "$start_dev" == "y" ]]; then
        npm run dev
    fi
fi