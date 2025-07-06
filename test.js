const AccessibilityAI = require('./accessibility-ai');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Accessibility AI Agent...\n');

// Test 1: Check if training data exists
console.log('📚 Test 1: Training Data');
try {
    if (fs.existsSync('./training-data.json')) {
        const trainingData = JSON.parse(fs.readFileSync('./training-data.json', 'utf8'));
        console.log(`✅ Training data loaded: ${trainingData.examples.length} examples`);
        console.log(`   - Version: ${trainingData.metadata.version}`);
        console.log(`   - Created: ${trainingData.metadata.created}`);
    } else {
        console.log('❌ Training data not found. Run: npm run init-training');
    }
} catch (error) {
    console.log('❌ Error loading training data:', error.message);
}

// Test 2: Check if directories exist
console.log('\n📁 Test 2: Directories');
const dirs = ['uploads', 'public', 'training-data'];
dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir}/ directory exists`);
    } else {
        console.log(`❌ ${dir}/ directory missing`);
    }
});

// Test 3: Check if config file exists
console.log('\n⚙️  Test 3: Configuration');
if (fs.existsSync('./config.env')) {
    console.log('✅ config.env file exists');
    const config = fs.readFileSync('./config.env', 'utf8');
    if (config.includes('your_openai_key_here') || config.includes('your_gemini_key_here')) {
        console.log('⚠️  Warning: API keys need to be configured');
    } else {
        console.log('✅ API keys appear to be configured');
    }
} else {
    console.log('❌ config.env file not found');
}

// Test 4: Check dependencies
console.log('\n📦 Test 4: Dependencies');
try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    console.log(`✅ Package.json found: ${packageJson.name} v${packageJson.version}`);
    console.log(`   - Dependencies: ${Object.keys(packageJson.dependencies).length}`);
    console.log(`   - Dev Dependencies: ${Object.keys(packageJson.devDependencies).length}`);
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
}

// Test 5: Test AI class initialization
console.log('\n🤖 Test 5: AI Class');
try {
    const ai = new AccessibilityAI({
        provider: 'openai',
        apiKey: 'test-key',
        trainingDataPath: './training-data.json'
    });
    console.log('✅ AI class initialized successfully');
    console.log(`   - Provider: ${ai.config.provider}`);
    console.log(`   - Training examples: ${ai.trainingData.examples.length}`);
} catch (error) {
    console.log('❌ Error initializing AI class:', error.message);
}

// Test 6: Check if server can start
console.log('\n🌐 Test 6: Server Components');
try {
    const express = require('express');
    const multer = require('multer');
    const cors = require('cors');
    console.log('✅ All server dependencies available');
} catch (error) {
    console.log('❌ Missing server dependencies:', error.message);
}

console.log('\n🎯 Test Summary:');
console.log('If all tests passed, your system is ready to run!');
console.log('\nNext steps:');
console.log('1. Configure your API keys in config.env');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:3000');
console.log('\nHappy accessibility testing! 🎉'); 