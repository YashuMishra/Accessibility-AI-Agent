#!/bin/bash

echo "🚀 Setting up Accessibility AI Agent..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads
mkdir -p public
mkdir -p training-data

# Initialize training data
echo "📚 Initializing training data..."
node init-training-data.js

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize training data"
    exit 1
fi

# Check if config.env exists
if [ ! -f "config.env" ]; then
    echo "❌ config.env file not found. Please create it with your API keys."
    echo "Example config.env:"
    echo "AI_PROVIDER=openai"
    echo "OPENAI_API_KEY=your_openai_key_here"
    echo "GEMINI_API_KEY=your_gemini_key_here"
    echo "ANTHROPIC_API_KEY=your_anthropic_key_here"
    exit 1
fi

# Check if API keys are configured
if grep -q "your_openai_key_here\|your_gemini_key_here\|your_anthropic_key_here" config.env; then
    echo "⚠️  Warning: Please update your API keys in config.env"
    echo "You need to add your actual API keys before running the application."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit config.env and add your API keys"
echo "2. Choose your AI provider (openai, gemini, anthropic)"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "🔧 Available commands:"
echo "  npm run dev     - Start development server"
echo "  npm start       - Start production server"
echo "  npm test        - Run tests"
echo ""
echo "📚 Training examples loaded: 10"
echo "🎯 Ready for accessibility testing!" 