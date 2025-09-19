// Netlify Function для загрузки данных из базы данных
const supabase = require('./supabase-client');

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
    // Получаем тип данных из query параметров
    const urlParams = new URLSearchParams(event.queryStringParameters);
    const dataType = urlParams.get('type');
    
    // Проверяем, что dataType безопасен
    if (!dataType) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Data type is required' })
      };
    }
    
    // Обрабатываем разные типы данных
    let data;
    switch (dataType) {
      case 'doctors':
        const { data: doctors, error: doctorsError } = await supabase
          .from('doctors')
          .select('id, name, specialty, experience, photo, description')
          .order('id', { ascending: true });
        
        if (doctorsError) throw doctorsError;
        data = doctors;
        break;
        
      case 'services':
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('id, title as name, description, icon_class as icon, price, duration, category, is_active as available')
          .order('id', { ascending: true });
        
        if (servicesError) throw servicesError;
        
        // Преобразуем price в строку для совместимости
        data = services.map(service => ({
          ...service,
          price: service.price ? service.price.toString() : '0'
        }));
        break;
        
      case 'news':
        const { data: news, error: newsError } = await supabase
          .from('news')
          .select('id, title, description, image_url as image, badge, is_active as active')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        if (newsError) throw newsError;
        data = news;
        break;
        
      case 'settings':
        const { data: settings, error: settingsError } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value');
        
        if (settingsError) throw settingsError;
        data = {};
        settings.forEach(setting => {
          data[setting.setting_key] = setting.setting_value;
        });
        break;
        
      default:
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Invalid data type' })
        };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data)
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