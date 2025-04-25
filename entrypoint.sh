#!/bin/bash

GIT_URL="https://github.com/Space-Banane/lil-cats.git"
STARTUP_COMMAND="npx serve -s"

cd /app

if [ -d ".git" ]; then
    echo "Repository already exists. Pulling latest changes."
    git pull
else
    echo "Repository does not exist. Cloning repository."
    git clone $GIT_URL .
fi


npm i -g pnpm
pnpm i

if ! command -v serve &> /dev/null
then
    echo "serve could not be found, installing..."
    pnpm add serve
else
    echo "serve is already installed."
fi

pnpm build
cd dist
echo "Starting the application..."
$STARTUP_COMMAND