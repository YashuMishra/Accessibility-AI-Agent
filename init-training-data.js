const fs = require('fs');

const initialTrainingData = {
  examples: [
    {
      id: "1",
      issue_type: "narrator_blank_announcement",
      wcag_failure: "3.2.4",
      one_liner: "Narrator announces blank for permission combo boxes",
      full_report: `User Impact:
Screen reader dependent users will be impacted if in scan mode, Narrator takes extra focus on the menu items of 'Permission' combo boxes announces "Blank" due to which user will have to do extra down arrow key navigation and also users will get confused after hearing "Blank" information.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413) 
Browser: New Edge (Version 111.0.1661.54 (Official build) (64-bit)
Screen Reader: Narrator, NVDA

Pre-requisite:
1. Go to system settings-> System-> Display->Scale & Layout-> Change the size of text, apps, and other items at 150%(Recommended)-> Display Resolution (1920*1080)
2. Go to browser Settings-> Zoom- 100%

Steps to Reproduce:
1. Turn on Narrator through Ctrl + Windows + Enter key and switch to scan mode through Caps Lock + Spacebar key.
2. Open URL: https://mc-stage.minecraft.net/en-us/msaprofile/mygames/java/realm?realmid=5393 on New Edge (Chromium) browser and login with valid credentials.
3. Navigate to the 'Permission' combo box present below 'INVITE PLAYERS' heading on the page through down key and press Enter key to activate it.
4. Now again press the down arrow key to navigate to the next interactive element.
5. Verify if in scan mode, Narrator takes extra focus on the menu items of 'Permission' combobox and announces "Blank" or not.
6. Issue does not replicate with NVDA as the browse mode automatically get closed while activating the 'Permission' combobox.
7. Same issue replicates for menu items of expanded pagination control present under 'MANAGE PLAYERS' heading of the page.

Actual Result:
In scan mode, Narrator takes extra focus on the menu items of 'Permission' combo boxes present below 'INVITE PLAYERS' & 'MANAGE PLAYERS' headings and announces "Blank".

Expected Result:
In scan mode, Narrator should not take extra focus on the menu items of 'Permission' combo boxes present below 'INVITE PLAYERS' & 'MANAGE PLAYERS' headings and should not announces "Blank". Narrator should take single consolidated focus on menu items of 'Permission' combo boxes and announces proper relevant information.

MAS Reference:
MAS 3.2.4 – Consistent Identification

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["screen reader", "narrator", "scan mode", "extra focus", "navigation"],
        test_environment_template: "OS: Windows 11, Browser: Edge, Screen Reader: Narrator, NVDA",
        steps_structure: "Turn on screen reader -> Navigate to element -> Verify issue"
      }
    },
    {
      id: "2",
      issue_type: "aria_hidden_misuse",
      wcag_failure: "1.3.1",
      one_liner: "Aria-hidden incorrectly hides important content from screen readers",
      full_report: `User Impact:
Screen reader users will be impacted if the aria-hidden="true" attribute is incorrectly defined inside the <div> and <span> tag for the "ABOUT" and "WE CRAFT LIFE CHANGING ART WITH GAME CHANGING TECH" text due to which users in scan mode focus will not move to those text, so they will miss the information about the text.

Test Environment:
OS: Windows 11 Version 24H2 (OS Build 26100.3775)
Browser: Microsoft Edge Version (136.0.3240.64) (Official build) (64-bit)
Screen Reader: Narrator, NVDA

Pre-Requisite:
1. Go to system Settings-> System-> Display-> Scale & Layout-> Change the size of text, apps, and other items at 150%-> Display Resolution (1920*1080)
2. Go to browser Settings-> Zoom-> 100%

Steps to Reproduce:
1. Open URL: https://ninjatheory.com/about/ on Microsoft Edge browser.
2. Navigate to the 'ABOUT' and 'WE CRAFT LIFE CHANGING ART WITH GAME CHANGING TECH' text present in the main section.
3. Press F12 to open the developer tool.
4. Verify that Aria-hidden="true" attribute is incorrectly defined inside the <div> and <span> tag for the text or not.

Actual Result:
Aria-hidden="true" attribute is incorrectly defined inside the <div> and <span> tag for the "ABOUT" and "WE CRAFT LIFE CHANGING ART WITH GAME CHANGING TECH" text.

Expected Result:
Aria-hidden="true" attribute should be removed from the <div> and <span> tag for the "ABOUT" and "WE CRAFT LIFE CHANGING ART WITH GAME CHANGING TECH" text.

MAS Reference:
MAS 1.3.1 – Info and Relationships

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["screen reader", "aria-hidden", "focus", "miss information"],
        test_environment_template: "OS: Windows 11, Browser: Edge, Screen Reader: Narrator, NVDA",
        steps_structure: "Open URL -> Navigate to element -> Check developer tools -> Verify aria-hidden"
      }
    },
    {
      id: "3",
      issue_type: "focus_order_issue",
      wcag_failure: "2.4.3",
      one_liner: "Tab order skips important interactive elements",
      full_report: `User Impact:
Keyboard users will be impacted as the focus order skips important interactive elements like buttons and links, making it difficult to navigate through the page using only the keyboard. This creates a poor user experience for users who rely on keyboard navigation.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Chrome Version 120.0.6099.109 (Official build) (64-bit)
Screen Reader: NVDA 2023.3

Pre-requisite:
1. Ensure keyboard navigation is enabled
2. Set browser zoom to 100%
3. Disable mouse to test keyboard-only navigation

Steps to Reproduce:
1. Open the application URL in Chrome browser
2. Press Tab key to start keyboard navigation
3. Navigate through the page using Tab and Shift+Tab keys
4. Observe the focus order and identify skipped elements
5. Verify that all interactive elements are reachable via keyboard

Actual Result:
Tab order skips several important interactive elements including the "Submit" button and "Contact Us" link, making them inaccessible via keyboard navigation.

Expected Result:
All interactive elements should be reachable via keyboard navigation in a logical tab order that follows the visual layout of the page.

MAS Reference:
MAS 2.4.3 – Focus Order

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["keyboard users", "focus order", "navigation", "interactive elements"],
        test_environment_template: "OS: Windows 11, Browser: Chrome, Screen Reader: NVDA",
        steps_structure: "Open URL -> Use Tab navigation -> Verify focus order -> Check accessibility"
      }
    },
    {
      id: "4",
      issue_type: "missing_alt_text",
      wcag_failure: "1.1.1",
      one_liner: "Images lack alternative text descriptions",
      full_report: `User Impact:
Screen reader users will be impacted as images lack alternative text descriptions, making it impossible for them to understand the content and context of images on the page. This creates a barrier for users who rely on assistive technology to access visual information.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Firefox Version 121.0 (64-bit)
Screen Reader: JAWS 2023

Pre-requisite:
1. Ensure screen reader is properly configured
2. Set browser zoom to 100%
3. Disable images to test alt text functionality

Steps to Reproduce:
1. Open the application URL in Firefox browser
2. Navigate to images on the page using screen reader
3. Check if images have alt attributes defined
4. Verify that alt text provides meaningful descriptions
5. Test with images disabled to see fallback behavior

Actual Result:
Multiple images on the page lack alt attributes or have empty alt text, making them inaccessible to screen reader users.

Expected Result:
All images should have meaningful alt text that describes the image content and provides context for screen reader users.

MAS Reference:
MAS 1.1.1 – Non-text Content

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["screen reader", "images", "alt text", "descriptions", "visual information"],
        test_environment_template: "OS: Windows 11, Browser: Firefox, Screen Reader: JAWS",
        steps_structure: "Open URL -> Navigate to images -> Check alt attributes -> Verify descriptions"
      }
    },
    {
      id: "5",
      issue_type: "contrast_violation",
      wcag_failure: "1.4.3",
      one_liner: "Text color contrast ratio below 4.5:1",
      full_report: `User Impact:
Users with low vision will be impacted as the text color contrast ratio is below the required 4.5:1 ratio, making it difficult to read text content. This affects readability for users with various visual impairments and those viewing content in bright lighting conditions.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Chrome Version 120.0.6099.109 (Official build) (64-bit)
Accessibility Tool: WebAIM Contrast Checker

Pre-requisite:
1. Use a contrast checking tool
2. Test in different lighting conditions
3. Verify against WCAG AA standards

Steps to Reproduce:
1. Open the application URL in Chrome browser
2. Identify text elements with poor contrast
3. Use a contrast checking tool to measure ratios
4. Verify contrast ratios against WCAG standards
5. Test in different viewing conditions

Actual Result:
Text elements have contrast ratios below 4.5:1, failing to meet WCAG AA standards for normal text.

Expected Result:
All text should have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text to meet WCAG AA standards.

MAS Reference:
MAS 1.4.3 – Contrast (Minimum)

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["low vision", "contrast ratio", "readability", "visual impairments"],
        test_environment_template: "OS: Windows 11, Browser: Chrome, Tool: WebAIM Contrast Checker",
        steps_structure: "Open URL -> Identify text elements -> Measure contrast -> Verify standards"
      }
    },
    {
      id: "6",
      issue_type: "heading_structure",
      wcag_failure: "1.3.1",
      one_liner: "Missing or incorrect heading structure",
      full_report: `User Impact:
Screen reader users will be impacted as the page lacks proper heading structure, making it difficult to navigate and understand the content hierarchy. Users cannot efficiently scan the page or jump to specific sections.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Edge Version 120.0.2210.91 (Official build) (64-bit)
Screen Reader: Narrator

Pre-requisite:
1. Enable screen reader navigation
2. Set browser zoom to 100%
3. Use heading navigation commands

Steps to Reproduce:
1. Open the application URL in Edge browser
2. Use screen reader heading navigation (H key)
3. Check if headings are properly structured
4. Verify heading levels follow logical hierarchy
5. Test heading navigation functionality

Actual Result:
Page lacks proper heading structure with missing H1 elements and incorrect heading hierarchy, making navigation difficult for screen reader users.

Expected Result:
Page should have a proper heading structure starting with H1 and following logical hierarchy (H1 > H2 > H3, etc.) to enable efficient navigation.

MAS Reference:
MAS 1.3.1 – Info and Relationships

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["screen reader", "heading structure", "navigation", "content hierarchy"],
        test_environment_template: "OS: Windows 11, Browser: Edge, Screen Reader: Narrator",
        steps_structure: "Open URL -> Use heading navigation -> Check structure -> Verify hierarchy"
      }
    },
    {
      id: "7",
      issue_type: "form_labels",
      wcag_failure: "3.3.2",
      one_liner: "Form inputs lack proper labels",
      full_report: `User Impact:
Screen reader users will be impacted as form inputs lack proper labels, making it difficult to understand what information is required. Users cannot identify the purpose of form fields or understand input requirements.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Chrome Version 120.0.6099.109 (Official build) (64-bit)
Screen Reader: NVDA 2023.3

Pre-requisite:
1. Enable screen reader form navigation
2. Set browser zoom to 100%
3. Use form navigation commands

Steps to Reproduce:
1. Open the application URL in Chrome browser
2. Navigate to form elements using screen reader
3. Check if form inputs have associated labels
4. Verify label-input relationships
5. Test form navigation and announcements

Actual Result:
Form inputs lack proper labels or have unassociated labels, making them inaccessible to screen reader users.

Expected Result:
All form inputs should have proper labels that are programmatically associated with their respective input elements.

MAS Reference:
MAS 3.3.2 – Labels or Instructions

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["screen reader", "form inputs", "labels", "input requirements"],
        test_environment_template: "OS: Windows 11, Browser: Chrome, Screen Reader: NVDA",
        steps_structure: "Open URL -> Navigate to forms -> Check labels -> Verify associations"
      }
    },
    {
      id: "8",
      issue_type: "keyboard_traps",
      wcag_failure: "2.1.2",
      one_liner: "Keyboard users trapped in modal dialogs",
      full_report: `User Impact:
Keyboard users will be impacted as they become trapped in modal dialogs with no way to exit using only the keyboard. This creates an inaccessible experience for users who rely on keyboard navigation and cannot use a mouse.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Firefox Version 121.0 (64-bit)
Screen Reader: JAWS 2023

Pre-requisite:
1. Disable mouse to test keyboard-only navigation
2. Set browser zoom to 100%
3. Use keyboard navigation commands

Steps to Reproduce:
1. Open the application URL in Firefox browser
2. Navigate to trigger modal dialog using keyboard
3. Activate modal dialog using Enter or Space
4. Try to exit modal using keyboard only
5. Verify escape key and tab navigation

Actual Result:
Modal dialogs trap keyboard users with no escape mechanism, making them inaccessible to keyboard-only users.

Expected Result:
Modal dialogs should be fully navigable by keyboard with proper escape mechanisms (Escape key) and focus management.

MAS Reference:
MAS 2.1.2 – No Keyboard Trap

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["keyboard users", "modal dialogs", "trapped", "escape mechanism"],
        test_environment_template: "OS: Windows 11, Browser: Firefox, Screen Reader: JAWS",
        steps_structure: "Open URL -> Navigate to modal -> Activate dialog -> Test keyboard escape"
      }
    },
    {
      id: "9",
      issue_type: "color_dependency",
      wcag_failure: "1.4.1",
      one_liner: "Information conveyed only through color",
      full_report: `User Impact:
Users with color blindness or visual impairments will be impacted as important information is conveyed only through color, making it inaccessible to users who cannot distinguish certain colors or view content in grayscale.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Chrome Version 120.0.6099.109 (Official build) (64-bit)
Accessibility Tool: Color Contrast Analyzer

Pre-requisite:
1. Use color blindness simulation tools
2. Test in grayscale mode
3. Verify information accessibility

Steps to Reproduce:
1. Open the application URL in Chrome browser
2. Identify elements that use color to convey information
3. Test with color blindness simulation
4. Verify information is still accessible
5. Check grayscale rendering

Actual Result:
Error states and status information are conveyed only through color (red/green), making them inaccessible to color-blind users.

Expected Result:
Information should be conveyed through multiple means including color, text, icons, or patterns to ensure accessibility for all users.

MAS Reference:
MAS 1.4.1 – Use of Color

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["color blindness", "visual impairments", "color dependency", "information accessibility"],
        test_environment_template: "OS: Windows 11, Browser: Chrome, Tool: Color Contrast Analyzer",
        steps_structure: "Open URL -> Identify color-dependent elements -> Test with simulation -> Verify accessibility"
      }
    },
    {
      id: "10",
      issue_type: "aria_live_regions",
      wcag_failure: "4.1.3",
      one_liner: "Dynamic content changes not announced to screen readers",
      full_report: `User Impact:
Screen reader users will be impacted as dynamic content changes are not announced, making them unaware of important updates, form validation messages, or status changes that occur without page refresh.

Test Environment:
OS: Windows 11 Version 22H2 (OS Build 22621.1413)
Browser: Edge Version 120.0.2210.91 (Official build) (64-bit)
Screen Reader: Narrator

Pre-requisite:
1. Enable screen reader announcements
2. Set browser zoom to 100%
3. Use live region navigation

Steps to Reproduce:
1. Open the application URL in Edge browser
2. Interact with dynamic elements (forms, buttons)
3. Observe if content changes are announced
4. Check for aria-live attributes
5. Test with different announcement levels

Actual Result:
Dynamic content changes are not announced to screen readers, leaving users unaware of important updates and status changes.

Expected Result:
Dynamic content changes should be announced to screen readers using appropriate aria-live regions with suitable announcement levels.

MAS Reference:
MAS 4.1.3 – Status Messages

Please refer to attached video in attachment tab for more information about the bug.`,
      patterns: {
        user_impact_keywords: ["screen reader", "dynamic content", "announcements", "status changes"],
        test_environment_template: "OS: Windows 11, Browser: Edge, Screen Reader: Narrator",
        steps_structure: "Open URL -> Interact with dynamic elements -> Observe announcements -> Check aria-live"
      }
    }
  ],
  metadata: {
    version: "1.0",
    created: new Date().toISOString(),
    total_examples: 10,
    description: "Comprehensive accessibility bug training data covering various WCAG violations"
  }
};

// Create training-data directory if it doesn't exist
const trainingDataDir = './training-data';
if (!fs.existsSync(trainingDataDir)) {
  fs.mkdirSync(trainingDataDir, { recursive: true });
}

// Write the training data to file
fs.writeFileSync('./training-data.json', JSON.stringify(initialTrainingData, null, 2));
console.log('✅ Training data initialized successfully!');
console.log(`📚 Created ${initialTrainingData.examples.length} training examples`);
console.log('📁 Training data saved to: ./training-data.json');
console.log('\n🎯 Training examples cover:');
console.log('- Narrator blank announcements (WCAG 3.2.4)');
console.log('- Aria-hidden misuse (WCAG 1.3.1)');
console.log('- Focus order issues (WCAG 2.4.3)');
console.log('- Missing alt text (WCAG 1.1.1)');
console.log('- Contrast violations (WCAG 1.4.3)');
console.log('- Heading structure (WCAG 1.3.1)');
console.log('- Form labels (WCAG 3.3.2)');
console.log('- Keyboard traps (WCAG 2.1.2)');
console.log('- Color dependency (WCAG 1.4.1)');
console.log('- Aria live regions (WCAG 4.1.3)'); 