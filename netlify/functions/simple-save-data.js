// Упрощенная функция для сохранения данных в Supabase
const supabase = require('./simple-supabase-client');

exports.handler = async (event, context) => {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Разрешаем только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Метод не разрешен' })
    };
  }

  try {
    // Проверяем, что есть тело запроса
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Пустое тело запроса' })
      };
    }

    // Парсим тело запроса
    const { dataType, data } = JSON.parse(event.body);

    // Проверяем, что задан тип данных
    if (!dataType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Не задан тип данных' })
      };
    }

    // Сохраняем данные в зависимости от типа
    switch (dataType) {
      case 'doctors':
        // Удаляем всех врачей
        await supabase
          .from('doctors')
          .delete()
          .neq('id', 0);
        
        // Добавляем новых врачей
        if (data && data.length > 0) {
          const doctorsToInsert = data.map(doctor => ({
            name: doctor.name,
            specialty: doctor.specialty,
            experience: doctor.experience,
            photo: doctor.photo,
            description: doctor.description
          }));
          
          const { error } = await supabase
            .from('doctors')
            .insert(doctorsToInsert);
          
          if (error) throw error;
        }
        break;

      case 'services':
        // Удаляем все услуги
        await supabase
          .from('services')
          .delete()
          .neq('id', 0);
        
        // Добавляем новые услуги
        if (data && data.length > 0) {
          const servicesToInsert = data.map(service => ({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration
          }));
          
          const { error } = await supabase
            .from('services')
            .insert(servicesToInsert);
          
          if (error) throw error;
        }
        break;

      case 'settings':
        // Удаляем все настройки
        await supabase
          .from('settings')
          .delete()
          .neq('id', 0);
        
        // Добавляем новые настройки
        if (data && typeof data === 'object') {
          const settingsToInsert = Object.entries(data).map(([key, value]) => ({
            key: key,
            value: value.toString()
          }));
          
          const { error } = await supabase
            .from('settings')
            .insert(settingsToInsert);
          
          if (error) throw error;
        }
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Неподдерживаемый тип данных' })
        };
    }

    // Возвращаем успешный ответ
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Данные успешно сохранены',
        dataType: dataType
      })
    };

  } catch (error) {
    console.error('Ошибка сохранения данных:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Ошибка сохранения данных',
        details: error.message 
      })
    };
  }
};