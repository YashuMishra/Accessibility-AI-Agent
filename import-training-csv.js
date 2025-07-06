const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const TRAINING_DATA_PATH = './training-data.json';
const CSV_PATH = './training-examples.csv';

function loadTrainingData() {
  if (fs.existsSync(TRAINING_DATA_PATH)) {
    return JSON.parse(fs.readFileSync(TRAINING_DATA_PATH, 'utf8'));
  }
  return { examples: [], metadata: { version: '1.0', created: new Date().toISOString(), total_examples: 0 } };
}

function saveTrainingData(data) {
  data.metadata.total_examples = data.examples.length;
  fs.writeFileSync(TRAINING_DATA_PATH, JSON.stringify(data, null, 2));
}

function importCSV() {
  const trainingData = loadTrainingData();
  let imported = 0;

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => {
      // Required fields: one_liner, wcag_failure, full_report
      if (row.one_liner && row.wcag_failure && row.full_report) {
        trainingData.examples.push({
          id: Date.now().toString() + Math.floor(Math.random()*10000),
          timestamp: new Date().toISOString(),
          one_liner: row.one_liner,
          wcag_failure: row.wcag_failure,
          full_report: row.full_report,
          issue_type: row.issue_type || '',
          rules: row.rules || ''
        });
        imported++;
      }
    })
    .on('end', () => {
      saveTrainingData(trainingData);
      console.log(`✅ Imported ${imported} training examples from ${CSV_PATH}`);
      console.log(`📚 Total examples: ${trainingData.examples.length}`);
    })
    .on('error', (err) => {
      console.error('❌ Error reading CSV:', err.message);
    });
}

importCSV(); 