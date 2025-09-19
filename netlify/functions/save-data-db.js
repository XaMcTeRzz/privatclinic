// Netlify Function для сохранения данных в базу данных Supabase
const supabase = require('./supabase-client');

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
    const { dataType, data } = JSON.parse(event.body);
    
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
    let result;
    switch (dataType) {
      case 'doctors':
        // Для врачей сначала очищаем таблицу, затем вставляем новые данные
        const { error: clearDoctorsError } = await supabase
          .from('doctors')
          .delete()
          .neq('id', 0); // Удаляем все записи
        
        if (clearDoctorsError) throw clearDoctorsError;
        
        // Вставляем новые данные
        if (data && data.length > 0) {
          // Подготавливаем данные для вставки
          const doctorsToInsert = data.map((doctor, index) => ({
            name: doctor.name,
            specialty: doctor.specialty,
            experience: doctor.experience || null,
            photo: doctor.photo || '',
            description: doctor.description || ''
          }));
          
          const { data: insertedDoctors, error: insertDoctorsError } = await supabase
            .from('doctors')
            .insert(doctorsToInsert);
          
          if (insertDoctorsError) throw insertDoctorsError;
          result = insertedDoctors;
        }
        break;
        
      case 'services':
        // Для услуг сначала очищаем таблицу, затем вставляем новые данные
        const { error: clearServicesError } = await supabase
          .from('services')
          .delete()
          .neq('id', 0); // Удаляем все записи
        
        if (clearServicesError) throw clearServicesError;
        
        // Вставляем новые данные
        if (data && data.length > 0) {
          // Подготавливаем данные для вставки
          const servicesToInsert = data.map((service, index) => ({
            name: service.name,
            description: service.description || '',
            price: service.price ? parseFloat(service.price) : null,
            duration: service.duration || ''
          }));
          
          const { data: insertedServices, error: insertServicesError } = await supabase
            .from('services')
            .insert(servicesToInsert);
          
          if (insertServicesError) throw insertServicesError;
          result = insertedServices;
        }
        break;
        
      case 'news':
        // Для новостей сначала очищаем таблицу, затем вставляем новые данные
        const { error: clearNewsError } = await supabase
          .from('news')
          .delete()
          .neq('id', 0); // Удаляем все записи
        
        if (clearNewsError) throw clearNewsError;
        
        // Вставляем новые данные
        if (data && data.length > 0) {
          // Подготавливаем данные для вставки
          const newsToInsert = data.map((newsItem, index) => ({
            title: newsItem.title,
            description: newsItem.description || '',
            image_url: newsItem.image || '',
            badge: newsItem.badge || '',
            is_active: newsItem.active !== undefined ? newsItem.active : true,
            sort_order: index
          }));
          
          const { data: insertedNews, error: insertNewsError } = await supabase
            .from('news')
            .insert(newsToInsert);
          
          if (insertNewsError) throw insertNewsError;
          result = insertedNews;
        }
        break;
        
      case 'settings':
        // Для настроек обновляем существующие или вставляем новые
        if (data && typeof data === 'object') {
          // Сначала удаляем все существующие настройки
          const { error: clearSettingsError } = await supabase
            .from('site_settings')
            .delete()
            .neq('id', 0);
          
          if (clearSettingsError) throw clearSettingsError;
          
          // Затем вставляем новые
          const settingsToInsert = Object.entries(data).map(([key, value]) => ({
            setting_key: key,
            setting_value: value,
            setting_type: 'text' // Для простоты считаем все текстовыми
          }));
          
          if (settingsToInsert.length > 0) {
            const { data: insertedSettings, error: insertSettingsError } = await supabase
              .from('site_settings')
              .insert(settingsToInsert);
            
            if (insertSettingsError) throw insertSettingsError;
            result = insertedSettings;
          }
        }
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
      body: JSON.stringify({ 
        message: 'Data saved successfully',
        dataType: dataType
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