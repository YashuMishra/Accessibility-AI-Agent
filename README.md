# Accessibility AI Agent - Bug Logging System

An AI-powered accessibility bug logging system that automatically generates detailed bug reports based on screenshots, issue descriptions, and WCAG failure classifications. The system learns from training examples to improve accuracy over time.

## 🚀 Features

- **Multi-AI Provider Support**: OpenAI GPT-4 Vision, Google Gemini, and Anthropic Claude
- **Learning System**: Improves accuracy by learning from training examples
- **Screenshot Analysis**: Analyzes uploaded screenshots for accessibility issues
- **WCAG Compliance**: Maps issues to specific WCAG success criteria
- **Modern UI**: Beautiful, responsive web interface
- **Training Management**: Add, view, and manage training examples
- **Real-time Generation**: Instant bug report generation with AI

Link 🔗: https://accessibility-ai-agent.onrender.com/ 

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for your chosen AI provider

## 🛠️ Installation

1. **Clone or download the project**
   ```bash
   # If you have the files, navigate to the project directory
   cd "Bug Logging Project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Rename `config.env` to `.env` or copy the contents
   - Update the API keys in the configuration file:
   ```env
   # Choose your AI provider: openai, gemini, anthropic
   AI_PROVIDER=openai
   
   # API Keys (add your actual keys)
   OPENAI_API_KEY=your_openai_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

4. **Initialize training data**
   ```bash
   npm run init-training
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:3000`

## 🔧 Configuration

### AI Providers

The system supports three AI providers:

#### OpenAI GPT-4 Vision
- **Best for**: High-quality, detailed reports
- **Setup**: Add your OpenAI API key to `OPENAI_API_KEY`
- **Model**: Uses `gpt-4-vision-preview`

#### Google Gemini
- **Best for**: Cost-effective, good performance
- **Setup**: Add your Gemini API key to `GEMINI_API_KEY`
- **Model**: Uses `gemini-pro-vision`

#### Anthropic Claude
- **Best for**: Advanced reasoning and analysis
- **Setup**: Add your Anthropic API key to `ANTHROPIC_API_KEY`
- **Model**: Uses `claude-3-opus-20240229`

### Environment Variables

```env
# AI Provider Configuration
AI_PROVIDER=openai                    # openai, gemini, anthropic
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Settings
MAX_FILE_SIZE=10485760                # 10MB in bytes
UPLOAD_PATH=uploads/

# Training Data
TRAINING_DATA_PATH=./training-data.json
```

## 📖 Usage

### 1. Generate Bug Reports

1. **Upload Screenshot**: Select a screenshot of the accessibility issue
2. **Describe Issue**: Enter a one-liner description of the problem
3. **Select WCAG Failure**: Choose the appropriate WCAG success criteria
4. **Add Context** (Optional): Include URL and test environment details
5. **Generate Report**: Click "Generate Bug Report" to create a detailed report

### 2. Add Training Examples

1. **Fill Training Form**: Provide issue description, WCAG failure, and full report
2. **Submit**: Add the example to improve AI accuracy
3. **View Examples**: See all training examples in the bottom section

### 3. Training Data Management

The system comes with 10 pre-loaded training examples covering:
- Narrator blank announcements (WCAG 3.2.4)
- Aria-hidden misuse (WCAG 1.3.1)
- Focus order issues (WCAG 2.4.3)
- Missing alt text (WCAG 1.1.1)
- Contrast violations (WCAG 1.4.3)
- Heading structure (WCAG 1.3.1)
- Form labels (WCAG 3.3.2)
- Keyboard traps (WCAG 2.1.2)
- Color dependency (WCAG 1.4.1)
- Aria live regions (WCAG 4.1.3)

## 🏗️ Project Structure

```
Bug Logging Project/
├── accessibility-ai.js      # Core AI agent class
├── server.js               # Express server and API routes
├── init-training-data.js   # Training data initialization
├── package.json            # Dependencies and scripts
├── config.env              # Environment configuration
├── public/
│   └── index.html         # Web interface
├── uploads/               # Screenshot uploads (auto-created)
├── training-data/         # Training data directory (auto-created)
└── training-data.json     # Training examples database
```

## 🔌 API Endpoints

### Generate Bug Report
```
POST /api/generate-report
Content-Type: multipart/form-data

Parameters:
- screenshot: Image file
- oneliner: Issue description
- wcag: WCAG failure code
- url: URL (optional)
- environment: Test environment (optional)
```

### Add Training Example
```
POST /api/training/add
Content-Type: application/json

Body:
{
  "one_liner": "Issue description",
  "wcag_failure": "1.1.1",
  "full_report": "Complete bug report"
}
```

### Get Training Examples
```
GET /api/training/examples
```

### Health Check
```
GET /api/health
```

## 🎯 Sample Bug Report Format

The AI generates reports in this exact format:

```
User Impact:
[Specific impact on users with disabilities]

Test Environment:
[OS version, browser version, assistive technology version]

Pre-requisite:
[System settings and browser configurations needed]

Steps to Reproduce:
[Numbered steps to reproduce the issue]

Actual Result:
[What actually happens - the bug behavior]

Expected Result:
[What should happen - the correct behavior]

MAS Reference:
[WCAG success criteria reference]

Please refer to attached video in attachment tab for more information about the bug.
```

## 🚀 Getting Started

1. **Quick Start**
   ```bash
   npm install
   npm run init-training
   npm run dev
   ```

2. **Add Your API Key**
   - Edit `config.env` and add your AI provider API key
   - Choose your preferred AI provider

3. **Test the System**
   - Upload a screenshot
   - Enter a test issue description
   - Select a WCAG failure
   - Generate your first bug report

4. **Improve Accuracy**
   - Add training examples based on your testing style
   - The AI learns from these examples
   - More examples = better accuracy

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production Mode
```bash
npm start
```

### Testing
```bash
npm test
```

## 📊 Performance Tips

1. **Image Optimization**: Use compressed images for faster uploads
2. **Training Examples**: Add diverse examples for better accuracy
3. **API Limits**: Monitor your AI provider's rate limits
4. **File Cleanup**: Uploaded files are automatically cleaned after 24 hours

## 🛡️ Security

- File uploads are validated for type and size
- API keys are stored in environment variables
- Uploaded files are automatically cleaned up
- CORS is enabled for cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the console logs for error messages
2. Verify your API keys are correct
3. Ensure all dependencies are installed
4. Check that the server is running on the correct port

## 🎉 Success Stories

The system has been trained on real accessibility testing scenarios and can generate professional-quality bug reports that match industry standards. The learning system continuously improves accuracy as you add more training examples.

---

**Happy Accessibility Testing! 🎯** 
