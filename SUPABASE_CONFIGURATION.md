# Настройка Supabase

## Подключение к существующей базе данных

Проект уже настроен для работы с базой данных Supabase по следующим параметрам:

- **URL**: https://egfibejxkmwppddzehet.supabase.co
- **Ключ**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU

## Структура таблиц

В базе данных созданы следующие таблицы:

### Таблица doctors
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  experience INTEGER,
  photo TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Таблица services
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Таблица site_settings
```sql
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(20) DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Таблица news
```sql
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  badge VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Политики безопасности

Для всех таблиц настроены политики безопасности, разрешающие чтение и запись.

## Тестирование подключения

Для тестирования подключения к Supabase можно использовать следующий скрипт:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://egfibejxkmwppddzehet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Тест запроса к таблице doctors
    const { data, error } = await supabase
      .from('doctors')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.log('Ошибка подключения:', error.message);
    } else {
      console.log('Подключение успешно!');
      console.log('Найдено записей:', data.length);
    }
  } catch (error) {
    console.log('Ошибка:', error.message);
  }
}

testConnection();
```

## Использование в функциях Netlify

Все функции Netlify используют клиент Supabase, который настроен в файле `netlify/functions/supabase-client.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

## Обновление конфигурации

Если вы хотите использовать другую базу данных Supabase:

1. Создайте новый проект в Supabase
2. Обновите переменные окружения в Netlify/Vercel:
   - `SUPABASE_URL` - URL вашего нового проекта
   - `SUPABASE_KEY` - ключ вашего нового проекта
3. Создайте таблицы в новой базе данных, используя SQL скрипты из файла `create-missing-tables.sql`
4. Пересоберите сайт