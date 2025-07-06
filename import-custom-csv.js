const fs = require('fs');
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

function extractWCAGFromText(text) {
  // Look for MAS or WCAG patterns in the text
  const masPattern = /MAS\s+(\d+\.\d+\.\d+)/i;
  const wcagPattern = /WCAG\s+(\d+\.\d+\.\d+)/i;
  
  const masMatch = text.match(masPattern);
  const wcagMatch = text.match(wcagPattern);
  
  if (masMatch) return masMatch[1];
  if (wcagMatch) return wcagMatch[1];
  
  // Default to common accessibility issues
  if (text.toLowerCase().includes('focus order')) return '2.4.3';
  if (text.toLowerCase().includes('alt text') || text.toLowerCase().includes('image')) return '1.1.1';
  if (text.toLowerCase().includes('contrast')) return '1.4.3';
  if (text.toLowerCase().includes('keyboard')) return '2.1.1';
  if (text.toLowerCase().includes('screen reader')) return '4.1.2';
  
  return '1.1.1'; // Default fallback
}

function cleanHtmlTags(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function formatBugReport(row) {
  const title = cleanHtmlTags(row['Title'] || '');
  const reproSteps = cleanHtmlTags(row['Repro Steps'] || '');
  const description = cleanHtmlTags(row['Description'] || '');
  
  // Extract WCAG/MAS violation
  const wcagFailure = extractWCAGFromText(reproSteps + ' ' + description);
  
  // Create one-liner from title
  const oneLiner = title.replace(/^.*?:\s*/, '').replace(/\[.*?\]/g, '').trim();
  
  // Format full report
  const fullReport = `User Impact:
${extractUserImpact(reproSteps)}

Test Environment:
${extractEnvironment(reproSteps)}

Pre-requisite:
${extractPrerequisites(reproSteps)}

Steps to Reproduce:
${extractSteps(reproSteps)}

Actual Result:
${extractActualResult(reproSteps)}

Expected Result:
${extractExpectedResult(reproSteps)}

MAS Reference:
MAS ${wcagFailure} – ${getWCAGDescription(wcagFailure)}

Please refer to attached video in attachment tab for more information about the bug.`;

  return {
    one_liner: oneLiner,
    wcag_failure: wcagFailure,
    full_report: fullReport
  };
}

function extractUserImpact(text) {
  const userImpactMatch = text.match(/User Impact:\s*(.*?)(?=\n|$)/i);
  if (userImpactMatch) {
    return userImpactMatch[1].trim();
  }
  return "Users with disabilities will be impacted by this accessibility issue.";
}

function extractEnvironment(text) {
  const osMatch = text.match(/OS version:\s*(.*?)(?=\n|$)/i);
  const browserMatch = text.match(/Edge Version:\s*(.*?)(?=\n|$)/i);
  
  let env = "OS: Windows 11 Version 22H2\n";
  if (osMatch) env += `OS: ${osMatch[1].trim()}\n`;
  if (browserMatch) env += `Browser: Edge ${browserMatch[1].trim()}\n`;
  env += "Screen Reader: Narrator, NVDA";
  
  return env;
}

function extractPrerequisites(text) {
  return "1. Go to system settings-> System-> Display->Scale & Layout-> Change the size of text, apps, and other items at 150%(Recommended)-> Display Resolution (1920*1080)\n2. Go to browser Settings-> Zoom- 100%";
}

function extractSteps(text) {
  const stepsMatch = text.match(/Repro Steps:\s*(.*?)(?=Expected results:|Actual result:|$)/is);
  if (stepsMatch) {
    const steps = stepsMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .split(/\n/)
      .filter(line => line.trim().length > 0)
      .map((line, index) => `${index + 1}. ${line.trim()}`)
      .join('\n');
    return steps;
  }
  return "1. Open the application URL\n2. Navigate to the affected element\n3. Verify the accessibility issue";
}

function extractActualResult(text) {
  const actualMatch = text.match(/Actual result:\s*(.*?)(?=\n|$)/i);
  if (actualMatch) {
    return actualMatch[1].trim();
  }
  return "The accessibility issue occurs as described.";
}

function extractExpectedResult(text) {
  const expectedMatch = text.match(/Expected results:\s*(.*?)(?=Actual result:|$)/is);
  if (expectedMatch) {
    return expectedMatch[1].trim();
  }
  return "The accessibility issue should not occur and the element should be accessible.";
}

function getWCAGDescription(wcag) {
  const descriptions = {
    '1.1.1': 'Non-text Content',
    '1.2.1': 'Audio-only and Video-only (Pre-recorded)',
    '1.2.2': 'Captions (Pre-recorded)',
    '1.2.4': 'Captions (Live)',
    '1.2.5': 'Audio Description (Pre-recorded)',
    '1.3.1': 'Info and Relationships',
    '1.3.2': 'Meaningful Sequence',
    '1.3.3': 'Sensory Characteristics',
    '1.3.4': 'Orientation',
    '1.3.5': 'Identify Input Purpose',
    '1.4.1': 'Use of Color',
    '1.4.2': 'Audio Controls',
    '1.4.3': 'Contrast (Minimum)',
    '1.4.4': 'Resize Text',
    '1.4.5': 'Images of Text',
    '1.4.10': 'Reflow',
    '1.4.11': 'Non-text Contrast',
    '1.4.12': 'Text Spacing',
    '1.4.13': 'Content on Hover or Focus',
    '2.1.1': 'Keyboard',
    '2.1.2': 'No Keyboard Trap',
    '2.1.4': 'Character Key Shortcuts',
    '2.2.1': 'Timing Adjustable',
    '2.2.2': 'Pause, Stop, Hide',
    '2.3.1': 'Three Flashes or Below Threshold',
    '2.4.1': 'By Blocks',
    '2.4.2': 'Page Titled',
    '2.4.3': 'Focus Order',
    '2.4.4': 'Link Purpose (In Context)',
    '2.4.5': 'Multiple Ways',
    '2.4.6': 'Headings and Labels',
    '2.4.7': 'Focus Visible',
    '2.4.11': 'Focus Not Obscured (Minimum)',
    '2.5.1': 'Pointer Gestures',
    '2.5.2': 'Pointer Cancellation',
    '2.5.3': 'Label in Name',
    '2.5.4': 'Motion Actuation',
    '2.5.7': 'Dragging Movements',
    '2.5.8': 'Target Size (Minimum)',
    '3.1.1': 'Language of Page',
    '3.1.2': 'Language of Parts',
    '3.2.1': 'On Focus',
    '3.2.2': 'On Input',
    '3.2.3': 'Consistent Navigation',
    '3.2.4': 'Consistent Identification',
    '3.2.6': 'Consistent Help',
    '3.3.1': 'Error Identification',
    '3.3.2': 'Labels or Instructions',
    '3.3.3': 'Error Suggestion',
    '3.3.4': 'Error Prevention (Legal, Financial, Data)',
    '3.3.7': 'Redundant Entry',
    '3.3.8': 'Accessible Authentication (Minimum)',
    '4.1.2': 'Name, Role, Value',
    '4.1.3': 'Status Messages',
    '4.3.1': 'No Disruption of Accessibility Features'
  };
  
  return descriptions[wcag] || 'Accessibility Issue';
}

function importCustomCSV() {
  const trainingData = loadTrainingData();
  let imported = 0;
  let skipped = 0;

  console.log('🔄 Importing custom CSV format...\n');

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => {
      // Skip if not a bug or not active
      if (row['Work Item Type'] !== 'Bug' || row['State'] !== 'Active') {
        skipped++;
        return;
      }

      try {
        const formattedData = formatBugReport(row);
        
        if (formattedData.one_liner && formattedData.wcag_failure && formattedData.full_report) {
          trainingData.examples.push({
            id: Date.now().toString() + Math.floor(Math.random()*10000),
            timestamp: new Date().toISOString(),
            ...formattedData,
            original_id: row['ID'],
            issue_type: 'imported_bug'
          });
          imported++;
          
          if (imported <= 3) {
            console.log(`✅ Imported: ${formattedData.one_liner.substring(0, 50)}...`);
          }
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error processing row: ${error.message}`);
        skipped++;
      }
    })
    .on('end', () => {
      saveTrainingData(trainingData);
      console.log(`\n🎉 Import completed!`);
      console.log(`✅ Imported: ${imported} training examples`);
      console.log(`⏭️  Skipped: ${skipped} rows (not bugs or inactive)`);
      console.log(`📚 Total examples: ${trainingData.examples.length}`);
      console.log(`\n💡 The AI agent has been trained with your real bug data!`);
    })
    .on('error', (err) => {
      console.error('❌ Error reading CSV:', err.message);
    });
}

importCustomCSV(); 