const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

class AccessibilityAI {
  constructor(config = {}) {
    this.config = {
      provider: config.provider || 'openai',
      apiKey: config.apiKey,
      trainingDataPath: config.trainingDataPath || './training-data.json'
    };
    
    this.initializeAI();
    this.trainingData = this.loadTrainingData();
  }
  
  initializeAI() {
    switch (this.config.provider) {
      case 'openai':
        this.ai = new OpenAI({ apiKey: this.config.apiKey });
        break;
      case 'gemini':
        this.ai = new GoogleGenerativeAI(this.config.apiKey);
        break;
      case 'anthropic':
        this.ai = new Anthropic({ apiKey: this.config.apiKey });
        break;
      default:
        throw new Error('Unsupported AI provider');
    }
  }
  
  loadTrainingData() {
    try {
      if (fs.existsSync(this.config.trainingDataPath)) {
        const data = fs.readFileSync(this.config.trainingDataPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading training data:', error);
    }
    return { examples: [] };
  }
  
  saveTrainingData() {
    try {
      fs.writeFileSync(
        this.config.trainingDataPath, 
        JSON.stringify(this.trainingData, null, 2)
      );
    } catch (error) {
      console.error('Error saving training data:', error);
    }
  }
  
  addTrainingExample(example) {
    this.trainingData.examples.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...example
    });
    this.saveTrainingData();
  }
  
  async generateBugReport(input) {
    const { screenshot, oneliner, wcag, url, customFormat } = input;
    // Find similar examples for context
    const similarExamples = this.findSimilarExamples(oneliner, wcag);

    // Prepare few-shot context for Gemini
    let fewShotContext = '';
    if (similarExamples && similarExamples.length > 0) {
      // Use up to 3 most similar examples
      const topExamples = similarExamples.slice(0, 3);
      fewShotContext = topExamples.map((ex, i) => `Example ${i+1}:\n${ex.full_report || ex.fullReport || JSON.stringify(ex, null, 2)}`).join('\n\n');
    }

    // Compose prompt for Gemini
    let prompt = '';
    if (customFormat && typeof customFormat === 'string' && customFormat.trim()) {
      prompt = `You are an expert accessibility engineer.\n\n${fewShotContext ? 'Here are some example bug reports for context:\n' + fewShotContext + '\n\n' : ''}Given the following issue, generate a bug report using this format:\n${customFormat}\n\nIssue Description: ${oneliner}\nMAS/WCAG Failure: ${wcag}\nURL: ${url || 'Not provided'}`;
    } else {
      prompt = `You are an expert accessibility engineer.\n\n${fewShotContext ? 'Here are some example bug reports for context:\n' + fewShotContext + '\n\n' : ''}Given the following issue, generate:\n1. A detailed accessibility bug report (for a bug tracking system)\n2. A suggestion for code change to fix the issue (in clear, actionable terms, with code snippets if possible)\n\nIssue Description: ${oneliner}\nMAS/WCAG Failure: ${wcag}\nURL: ${url || 'Not provided'}\n\nFormat your response as:\n---BUG REPORT---\n<bug report>\n---SUGGESTION---\n<code change suggestion>`;
    }

    // Only use Gemini for bug report generation, with few-shot context
    const geminiResponse = await this.generateWithGemini(screenshot, oneliner, wcag, url, prompt);

    // Parse the response into bug report and suggestion
    let bugReport = geminiResponse;
    let suggestion = '';
    if (!customFormat && typeof geminiResponse === 'string') {
      const bugMatch = geminiResponse.match(/---BUG REPORT---([\s\S]*?)---SUGGESTION---/i);
      const suggMatch = geminiResponse.match(/---SUGGESTION---([\s\S]*)/i);
      if (bugMatch) bugReport = bugMatch[1].trim();
      if (suggMatch) suggestion = suggMatch[1].trim();
    }

    return {
      gemini: bugReport,
      suggestion
    };
  }
  
  async generateWithOpenAI(screenshot, oneliner, wcag, url, similarExamples) {
    try {
      const screenshotBase64 = fs.readFileSync(screenshot, { encoding: 'base64' });
      const response = await this.ai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.buildTrainingPrompt(similarExamples)
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Generate an accessibility bug report for:\n              Issue: ${oneliner}\n              WCAG Failure: ${wcag}\n              URL: ${url}\n              \n              Analyze the screenshot and generate a complete report following the learned patterns.`
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return `Error: ${error.message || error}`;
    }
  }
  
  async generateWithGemini(screenshot, oneliner, wcag, url, similarExamples) {
    try {
      // Use a new Gemini instance with the provided key
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI("AIzaSyCLR8Esw64m7KxJVFtPSi39jotR7LzJVPI");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const screenshotData = fs.readFileSync(screenshot);
      const screenshotPart = {
        inlineData: {
          data: screenshotData.toString('base64'),
          mimeType: 'image/png'
        }
      };
      const prompt = `${this.buildTrainingPrompt(similarExamples)}\n\nGenerate an accessibility bug report for:\nIssue: ${oneliner}\nWCAG Failure: ${wcag}\nURL: ${url}\n\nAnalyze the screenshot and generate a complete report following the learned patterns.`;
      const result = await model.generateContent([prompt, screenshotPart]);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return `Error: ${error.message || error}`;
    }
  }
  
  buildTrainingPrompt(similarExamples) {
    return `You are an expert accessibility tester specializing in WCAG compliance and assistive technology testing. 
Your task is to generate detailed, professional accessibility bug reports based on the provided inputs.

TRAINING CONTEXT:
You have been trained on patterns from real accessibility testing scenarios. Always follow these principles:

1. USER IMPACT: Always start with how the issue affects users with disabilities
2. TEST ENVIRONMENT: Be specific about OS, browser, and assistive technology versions
3. REPRODUCTION STEPS: Provide clear, step-by-step instructions
4. ACTUAL vs EXPECTED: Clearly distinguish what happens vs what should happen
5. MAS REFERENCE: Map to appropriate WCAG success criteria

SIMILAR EXAMPLES:
${JSON.stringify(similarExamples, null, 2)}

RESPONSE FORMAT:
Always generate reports in this exact structure:

User Impact:
[Specific impact on users with disabilities, mentioning the assistive technology affected]

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

Please refer to attached video in attachment tab for more information about the bug.`;
  }
  
  findSimilarExamples(oneliner, wcag) {
    return this.trainingData.examples
      .filter(example => 
        example.wcag_failure === wcag || 
        this.calculateSimilarity(example.one_liner, oneliner) > 0.6
      )
      .slice(0, 3); // Return top 3 similar examples
  }
  
  calculateSimilarity(text1, text2) {
    // Simple similarity calculation - you can improve this
    const words1 = text1.toLowerCase().split(' ');
    const words2 = text2.toLowerCase().split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  }
}

module.exports = AccessibilityAI; 