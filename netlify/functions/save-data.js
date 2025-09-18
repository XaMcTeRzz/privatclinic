// Netlify Function для сохранения данных
const fs = require('fs');
const path = require('path');

// Убедимся что директория для данных существует
const ensureDataDir = () => {
  // Используем основную директорию data вместо tmp/data
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return dataDir;
};

exports.handler = async (event, context) => {
  // Только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Разрешаем CORS
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Проверяем, что тело запроса существует
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }
    
    // Парсим тело запроса
    const { filename, data } = JSON.parse(event.body);
    
    // Проверяем, что filename безопасен
    if (!filename) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Filename is required' })
      };
    }
    
    const safeFilename = path.basename(filename);
    if (!safeFilename || !safeFilename.endsWith('.json')) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid filename' })
      };
    }
    
    // Определяем путь к файлу данных
    const dataDir = ensureDataDir();
    const filePath = path.join(dataDir, safeFilename);
    
    // Сохраняем данные с правильной кодировкой
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, { encoding: 'utf8' });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        message: 'Data saved successfully',
        filename: safeFilename
      })
    };
  } catch (error) {
    console.error('Save data error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to save data', details: error.message })
    };
  }
};