#!/bin/bash

echo "🎮 Starting 8-Bit Tamagotchi Game 🎮"
echo "======================================"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 to run this game."
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
    echo "❌ pip is not installed. Please install pip to manage dependencies."
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    python3 -m pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check your Python installation."
        exit 1
    fi
fi

echo "🚀 Starting the game server..."
echo "🌐 Open your browser and go to:http://localhost:5000"
echo "⭐ To stop the game, press Ctrl+C"
echo ""

# Start the Flask application
python3 app.py 