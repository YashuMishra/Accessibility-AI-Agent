@echo off
echo 🚀 Setting up Accessibility AI Agent...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist "uploads" mkdir uploads
if not exist "public" mkdir public
if not exist "training-data" mkdir training-data

REM Initialize training data
echo 📚 Initializing training data...
node init-training-data.js

if %errorlevel% neq 0 (
    echo ❌ Failed to initialize training data
    pause
    exit /b 1
)

REM Check if config.env exists
if not exist "config.env" (
    echo ❌ config.env file not found. Please create it with your API keys.
    echo Example config.env:
    echo AI_PROVIDER=openai
    echo OPENAI_API_KEY=your_openai_key_here
    echo GEMINI_API_KEY=your_gemini_key_here
    echo ANTHROPIC_API_KEY=your_anthropic_key_here
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit config.env and add your API keys
echo 2. Choose your AI provider (openai, gemini, anthropic)
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
echo 🔧 Available commands:
echo   npm run dev     - Start development server
echo   npm start       - Start production server
echo   npm test        - Run tests
echo.
echo 📚 Training examples loaded: 10
echo 🎯 Ready for accessibility testing!
pause 