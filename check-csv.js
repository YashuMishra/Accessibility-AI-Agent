const fs = require('fs');
const csv = require('csv-parser');

const CSV_PATH = './training-examples.csv';

console.log('🔍 Checking CSV structure...\n');

let rowCount = 0;
let headers = [];

fs.createReadStream(CSV_PATH)
  .pipe(csv())
  .on('headers', (headerList) => {
    headers = headerList;
    console.log('📋 CSV Headers found:');
    headers.forEach((header, index) => {
      console.log(`   ${index + 1}. ${header}`);
    });
    console.log('');
  })
  .on('data', (row) => {
    rowCount++;
    if (rowCount <= 3) {
      console.log(`📄 Sample Row ${rowCount}:`);
      console.log('   ' + JSON.stringify(row, null, 2));
      console.log('');
    }
    
    // Check for required fields
    const requiredFields = ['one_liner', 'wcag_failure', 'full_report'];
    const missingFields = requiredFields.filter(field => !row[field] || row[field].trim() === '');
    
    if (missingFields.length > 0 && rowCount <= 5) {
      console.log(`⚠️  Row ${rowCount} missing required fields: ${missingFields.join(', ')}`);
      console.log('');
    }
  })
  .on('end', () => {
    console.log(`📊 Total rows in CSV: ${rowCount}`);
    console.log('');
    
    if (rowCount === 0) {
      console.log('❌ No data found in CSV file');
    } else {
      console.log('💡 To fix import issues:');
      console.log('1. Ensure your CSV has these columns: one_liner, wcag_failure, full_report');
      console.log('2. Make sure these fields are not empty');
      console.log('3. Check that the CSV is properly formatted (commas, quotes, etc.)');
    }
  })
  .on('error', (err) => {
    console.error('❌ Error reading CSV:', err.message);
  }); 