#!/bin/bash

if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "Error: .env file not found"
  exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY not found in .env file"
  exit 1
fi

echo "Starting Nanobot with OpenAI API key from .env..."
nanobot run ./nanobot.yaml
