// Упрощенная функция для загрузки данных из Supabase
const supabase = require('./simple-supabase-client');

exports.handler = async (event, context) => {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Обрабатываем OPTIONS запрос
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    // Получаем тип данных из параметров запроса
    const urlParams = new URLSearchParams(event.queryStringParameters);
    const dataType = urlParams.get('type');

    // Проверяем, что тип данных задан
    if (!dataType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Не задан тип данных' })
      };
    }

    let data;

    // Загружаем данные в зависимости от типа
    switch (dataType) {
      case 'doctors':
        const { data: doctors, error: doctorsError } = await supabase
          .from('doctors')
          .select('*')
          .order('id');
        
        if (doctorsError) throw doctorsError;
        data = doctors;
        break;

      case 'services':
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('id');
        
        if (servicesError) throw servicesError;
        data = services;
        break;

      case 'settings':
        const { data: settings, error: settingsError } = await supabase
          .from('settings')
          .select('*');
        
        if (settingsError) throw settingsError;
        
        // Преобразуем настройки в объект
        data = {};
        settings.forEach(setting => {
          data[setting.key] = setting.value;
        });
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Неподдерживаемый тип данных' })
        };
    }

    // Возвращаем данные
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Ошибка загрузки данных',
        details: error.message 
      })
    };
  }
};