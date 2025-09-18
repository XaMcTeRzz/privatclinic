// Netlify Function для загрузки данных
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
  // Поддерживаем и GET и POST запросы для OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: ''
    };
  }
  
  // Только GET запросы для загрузки
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Получаем имя файла из query параметров
    const urlParams = new URLSearchParams(event.queryStringParameters);
    const filename = urlParams.get('filename');
    
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
    
    // Проверяем существует ли файл
    if (!fs.existsSync(filePath)) {
      // Если файл не существует, возвращаем пустую структуру данных
      let defaultData = [];
      if (safeFilename.includes('settings')) {
        defaultData = {};
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(defaultData)
      };
    }
    
    // Читаем данные с правильной кодировкой
    const data = fs.readFileSync(filePath, { encoding: 'utf8' });
    
    // Проверяем, является ли содержимое допустимым JSON
    try {
      JSON.parse(data);
    } catch (jsonError) {
      console.error('Invalid JSON in file:', filePath);
      // Если файл содержит недопустимый JSON, возвращаем пустую структуру данных
      let defaultData = [];
      if (safeFilename.includes('settings')) {
        defaultData = {};
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(defaultData)
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data
    };
  } catch (error) {
    console.error('Load data error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to load data', details: error.message })
    };
  }
};