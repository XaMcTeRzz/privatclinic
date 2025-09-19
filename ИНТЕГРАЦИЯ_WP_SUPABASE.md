# Интеграция Supabase с админ-панелью сайта

## Как работает сохранение данных в вашей админ-панели

В вашем проекте админ-панель работает по следующей схеме:

1. **Админ-панель** (admin/index.html) - интерфейс для редактирования
2. **JavaScript** (js/admin.js) - обрабатывает действия пользователя
3. **Netlify Functions** - серверные функции для сохранения данных
4. **База данных** - хранит данные (раньше файлы JSON, теперь Supabase)

## Как интегрировать Supabase

### Шаг 1: Обновляем Netlify Functions

Файлы в папке `netlify/functions/` должны использовать Supabase вместо файлов JSON.

### Шаг 2: Обновляем js/admin.js

JavaScript в админ-панели отправляет данные на `/api/save-data`, мы оставляем это без изменений.

### Шаг 3: Настраиваем переменные окружения

В Netlify добавляем:
```
SUPABASE_URL = ваш_url
SUPABASE_KEY = ваш_ключ
```

## Пример интеграции

### Файл: netlify/functions/save-data.js (обновленный)
```javascript
const supabase = require('./supabase-client');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { dataType, data } = JSON.parse(event.body);
    
    // Сохраняем в Supabase в зависимости от типа данных
    switch (dataType) {
      case 'doctors':
        // Удаляем старых врачей
        await supabase.from('doctors').delete().neq('id', 0);
        // Добавляем новых
        if (data.length > 0) {
          await supabase.from('doctors').insert(data);
        }
        break;
        
      case 'services':
        // Удаляем старые услуги
        await supabase.from('services').delete().neq('id', 0);
        // Добавляем новые
        if (data.length > 0) {
          await supabase.from('services').insert(data);
        }
        break;
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Данные сохранены' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Файл: netlify/functions/load-data.js (обновленный)
```javascript
const supabase = require('./supabase-client');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const urlParams = new URLSearchParams(event.queryStringParameters);
    const dataType = urlParams.get('type');
    
    let data;
    
    // Загружаем из Supabase в зависимости от типа данных
    switch (dataType) {
      case 'doctors':
        const { data: doctors } = await supabase.from('doctors').select('*');
        data = doctors;
        break;
        
      case 'services':
        const { data: services } = await supabase.from('services').select('*');
        data = services;
        break;
        
      default:
        data = [];
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## Таблицы в Supabase

Создайте следующие таблицы в Supabase:

```sql
-- Таблица врачей
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  experience INTEGER,
  photo TEXT,
  description TEXT
);

-- Таблица услуг
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(50)
);
```

## Готово!

После этой интеграции:
1. Админ-панель будет отправлять данные на `/api/save-data`
2. Netlify Functions будут сохранять данные в Supabase
3. Сайт будет загружать данные из Supabase через `/api/load-data`