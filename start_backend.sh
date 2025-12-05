#!/bin/bash
# ChainQuest Academy - Backend Server Starter

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR/backend"

# Check if virtual environment exists
if [ -d "$SCRIPT_DIR/.venv" ]; then
    source "$SCRIPT_DIR/.venv/bin/activate"
fi

# Start the server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
