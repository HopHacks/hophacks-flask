#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"
REQUIREMENTS="$SCRIPT_DIR/requirements-2026.txt"

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    python -m venv "$VENV_DIR" || { echo "Failed to create virtual environment"; exit 1; }
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate" || { echo "Failed to activate virtual environment"; exit 1; }

# Install requirements if not yet installed (tracked by a stamp file)
STAMP="$VENV_DIR/.requirements_installed"
if [ ! -f "$STAMP" ] || [ "$REQUIREMENTS" -nt "$STAMP" ]; then
    echo "Installing requirements..."
    pip install -r "$REQUIREMENTS" || { echo "Failed to install requirements"; exit 1; }
    touch "$STAMP"
fi

# Run Flask dev server
cd "$SCRIPT_DIR/src"
flask run
