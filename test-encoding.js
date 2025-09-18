const fs = require('fs');
const path = require('path');

// Test reading and writing with proper encoding
const testData = {
  "test": "Тестовые данные с кириллическими символами",
  "number": 123,
  "array": ["элемент1", "элемент2"]
};

// Write test
const testFilePath = path.join(__dirname, 'test-data.json');
const jsonData = JSON.stringify(testData, null, 2);
fs.writeFileSync(testFilePath, jsonData, 'utf8');
console.log('Test data written successfully');

// Read test
const readData = fs.readFileSync(testFilePath, 'utf8');
const parsedData = JSON.parse(readData);
console.log('Test data read successfully:', parsedData);

// Clean up
fs.unlinkSync(testFilePath);
console.log('Test completed successfully');