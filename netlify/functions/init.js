// Netlify Function для инициализации данных при первом запуске
const initModule = require('../../scripts/init-data.js');
const initNetlifyData = initModule.initNetlifyData;

let isInitialized = false;

exports.handler = async (event, context) => {
  // Инициализируем данные только один раз
  if (!isInitialized) {
    try {
      initNetlifyData();
      isInitialized = true;
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Data initialization completed' })
      };
    } catch (error) {
      console.error('Initialization error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Failed to initialize data', details: error.message })
      };
    }
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: 'Already initialized' })
  };
};