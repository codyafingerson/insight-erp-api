#!/bin/bash

ENV_FILE=".env"
SESSION_SECRET=$(openssl rand -hex 32)

# Function to prompt for input with a default value
prompt() {
  local var_name=$1
  local message=$2
  local default=$3
  read -p "$message" input
  # Use indirect expansion to assign the variable
  printf -v "$var_name" '%s' "${input:-$default}"
}

prompt NODE_ENV "Enter the environment (development, production, etc.) [default: development]: " "development"
prompt PORT "Enter the port number [default: 8000]: " "8000"
prompt DATABASE_URL "Enter your DATABASE_URL [default: mysql://root:root@localhost:3306/insight_erp_dev]: " "mysql://root:root@localhost:3306/insight_erp_dev"
prompt REDIS_HOST "Enter REDIS_HOST [default: localhost]: " "localhost"
prompt REDIS_PORT "Enter REDIS_PORT [default: 6379]: " "6379"
prompt REDIS_PASSWORD "Enter REDIS_PASSWORD [default: empty]: " ""
prompt ROOT_NAME "Enter ROOT_NAME [default: root]: " "root"
prompt ROOT_USERNAME "Enter ROOT_USERNAME [default: root]: " "root"
prompt ROOT_EMAIL "Enter ROOT_EMAIL [default: empty]: " " "
prompt ROOT_PASSWORD "Enter ROOT_PASSWORD [default: root]: " "root"

echo "Writing environment variables to $ENV_FILE..."
{
  echo "NODE_ENV=\"$NODE_ENV\""
  echo "PORT=$PORT"
  echo "SESSION_SECRET=\"$SESSION_SECRET\""
  echo "DATABASE_URL=\"$DATABASE_URL\""
  echo "REDIS_HOST=\"$REDIS_HOST\""
  echo "REDIS_PORT=$REDIS_PORT"
  echo "REDIS_PASSWORD=\"$REDIS_PASSWORD\""
  echo "ROOT_NAME=\"$ROOT_NAME\""
  echo "ROOT_USERNAME=\"$ROOT_USERNAME\""
  echo "ROOT_EMAIL=\"$ROOT_EMAIL\""
  echo "ROOT_PASSWORD=\"$ROOT_PASSWORD\""
} > "$ENV_FILE"

echo ".env file created successfully!"

read -p "Do you want to install npm modules? (y/n) " install_npm
[[ "$install_npm" == "y" ]] && npm install

read -p "Do you want to migrate and seed the database? (y/n) " migrate_db
if [[ "$migrate_db" == "y" ]]; then
  npx prisma generate
  if [[ "$NODE_ENV" == "development" ]]; then
    npx prisma migrate dev --name init
  else
    npx prisma migrate deploy
  fi
fi

if [[ "$NODE_ENV" == "development" ]]; then
  read -p "Do you want to start the server? (y/n) " start_dev
  [[ "$start_dev" == "y" ]] && npm run dev
fi