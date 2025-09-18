// Test script to simulate API calls to Netlify Functions
const fs = require('fs');
const path = require('path');

// Simulate the save-data function
function simulateSaveData(filename, data) {
  try {
    // Ensure data directory exists
    const dataDir = path.join('/tmp', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create file path
    const safeFilename = path.basename(filename);
    const filePath = path.join(dataDir, safeFilename);
    
    // Save data with UTF-8 encoding
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    
    console.log(`Data saved successfully to ${filePath}`);
    return { message: 'Data saved successfully', filename: safeFilename };
  } catch (error) {
    console.error('Save data error:', error);
    return { error: 'Failed to save data', details: error.message };
  }
}

// Simulate the load-data function
function simulateLoadData(filename) {
  try {
    // Ensure data directory exists
    const dataDir = path.join('/tmp', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create file path
    const safeFilename = path.basename(filename);
    const filePath = path.join(dataDir, safeFilename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      let defaultData = [];
      if (safeFilename.includes('settings')) {
        defaultData = {};
      }
      return defaultData;
    }
    
    // Read data with UTF-8 encoding
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Load data error:', error);
    return { error: 'Failed to load data', details: error.message };
  }
}

// Test with Cyrillic data
const testData = {
  "id": 1,
  "title": "Тестовый слайд",
  "subtitle": "Подзаголовок",
  "description": "Описание тестового слайда с кириллическими символами",
  "background_image": "https://example.com/image.jpg",
  "button_text": "Кнопка",
  "button_link": "/test"
};

console.log('Testing save function...');
const saveResult = simulateSaveData('test-slides.json', [testData]);
console.log('Save result:', saveResult);

console.log('\nTesting load function...');
const loadResult = simulateLoadData('test-slides.json');
console.log('Load result:', loadResult);

// Clean up test file
try {
  const testFilePath = path.join('/tmp', 'data', 'test-slides.json');
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    console.log('\nTest file cleaned up');
  }
} catch (error) {
  console.error('Error cleaning up test file:', error);
}