require('dotenv').config({ path: './config.env' });
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const AccessibilityAI = require('./accessibility-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create directories if they don't exist
const dirs = ['uploads', 'public', 'training-data'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Initialize AI
const ai = new AccessibilityAI({
  provider: process.env.AI_PROVIDER || 'openai',
  apiKey: process.env[`${process.env.AI_PROVIDER?.toUpperCase()}_API_KEY`],
  trainingDataPath: process.env.TRAINING_DATA_PATH || './training-data.json'
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/generate-report', upload.single('screenshot'), async (req, res) => {
  try {
    const { oneliner, wcag, url, environment } = req.body;
    const screenshot = req.file?.path;
    
    if (!oneliner || !wcag) {
      return res.status(400).json({ error: 'Missing required fields: oneliner and wcag' });
    }
    
    if (!screenshot) {
      return res.status(400).json({ error: 'Screenshot is required' });
    }
    
    console.log('Generating report with:', {
      oneliner,
      wcag,
      url,
      screenshot: req.file?.filename,
      provider: process.env.AI_PROVIDER
    });
    
    const report = await ai.generateBugReport({
      screenshot,
      oneliner,
      wcag,
      url,
      environment
    });
    
    res.json({ 
      report,
      timestamp: new Date().toISOString(),
      provider: process.env.AI_PROVIDER,
      filename: req.file?.filename
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/training/add', (req, res) => {
  try {
    const example = req.body;
    
    if (!example.one_liner || !example.wcag_failure) {
      return res.status(400).json({ error: 'Missing required fields: one_liner and wcag_failure' });
    }
    
    ai.addTrainingExample(example);
    res.json({ 
      success: true, 
      message: 'Training example added successfully',
      total_examples: ai.trainingData.examples.length
    });
  } catch (error) {
    console.error('Error adding training example:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/training/examples', (req, res) => {
  try {
    const examples = ai.trainingData.examples;
    res.json({ 
      examples, 
      total: examples.length,
      metadata: {
        version: "1.0",
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching training examples:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/training/examples/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = ai.trainingData.examples.length;
    
    ai.trainingData.examples = ai.trainingData.examples.filter(example => example.id !== id);
    
    if (ai.trainingData.examples.length === initialLength) {
      return res.status(404).json({ error: 'Example not found' });
    }
    
    ai.saveTrainingData();
    res.json({ 
      success: true, 
      message: 'Training example deleted successfully',
      total_examples: ai.trainingData.examples.length
    });
  } catch (error) {
    console.error('Error deleting training example:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    provider: process.env.AI_PROVIDER,
    timestamp: new Date().toISOString(),
    training_examples: ai.trainingData.examples.length
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    provider: process.env.AI_PROVIDER,
    max_file_size: process.env.MAX_FILE_SIZE,
    upload_path: process.env.UPLOAD_PATH,
    training_data_path: process.env.TRAINING_DATA_PATH
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// Cleanup uploaded files periodically
setInterval(() => {
  const uploadsDir = 'uploads/';
  if (fs.existsSync(uploadsDir)) {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) return;
      
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const hoursOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
        
        // Delete files older than 24 hours
        if (hoursOld > 24) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      });
    });
  }
}, 60 * 60 * 1000); // Run every hour

app.listen(PORT, () => {
  console.log(`🚀 Accessibility AI Agent running on port ${PORT}`);
  console.log(`📊 Using AI Provider: ${process.env.AI_PROVIDER}`);
  console.log(`🔗 Access the app at: http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${process.env.UPLOAD_PATH || 'uploads/'}`);
  console.log(`📚 Training examples: ${ai.trainingData.examples.length}`);
}); 