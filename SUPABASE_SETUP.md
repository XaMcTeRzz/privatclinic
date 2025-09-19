# 🟢 Настройка Supabase для проекта медицинской клиники

## 📋 Регистрация в Supabase

1. Перейдите на https://supabase.com/
2. Нажмите "Start your project" или "Sign in"
3. Создайте аккаунт или войдите в существующий
4. Нажмите "New Project"

## 🚀 Создание проекта

### 1. Создание нового проекта
1. Введите имя проекта: `privatna-likarnya`
2. Введите пароль для базы данных (сохраните его)
3. Выберите регион ближайший к вашим пользователям
4. Нажмите "Create new project"

### 2. Ожидание развертывания
- Процесс занимает 1-2 минуты
- Дождитесь статуса "Healthy"

## 🔧 Настройка базы данных

### 1. Получение учетных данных
1. Перейдите в проект Supabase
2. В левой панели выберите "Project Settings" (иконка шестеренки)
3. Выберите "Database"
4. Найдите раздел "Connection info"
5. Скопируйте:
   - Host
   - Database name (обычно `postgres`)
   - User (обычно `postgres`)
   - Password (который вы вводили при создании)

### 2. Добавление переменных окружения в Netlify
1. Перейдите в ваш сайт в Netlify
2. Site settings → Build & deploy → Environment
3. Добавьте следующие переменные:

```
DB_HOST = хост-из-supabase.supabase.co
DB_USER = postgres
DB_PASSWORD = ваш-пароль
DB_NAME = postgres
DB_PORT = 5432
DB_SSL = require
SUPABASE_URL = https://хост-из-supabase.supabase.co
SUPABASE_KEY = ваш-anon-key (из Project Settings → API)
```

## 🛠️ Создание таблиц в Supabase

### 1. Откройте SQL Editor
1. В Supabase выберите "SQL Editor" в левой панели
2. Выберите "New query"

### 2. Создайте таблицы
Выполните следующие SQL запросы:

```sql
-- Таблица врачей
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  experience VARCHAR(50),
  photo_url VARCHAR(500),
  description TEXT,
  education TEXT,
  schedule JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица услуг
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon_class VARCHAR(50),
  price DECIMAL(10,2),
  duration VARCHAR(50),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(20) DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица новостей
CREATE TABLE IF NOT EXISTS news (
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

-- Триггеры для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE
ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE
ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE
ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE
ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Настройка прав доступа (RLS)

### 1. Включите RLS для таблиц
```sql
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
```

### 2. Создайте политики для чтения (для публичного доступа)
```sql
-- Политики для чтения
CREATE POLICY "Allow read access to doctors" ON doctors
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow read access to services" ON services
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow read access to news" ON news
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow read access to site_settings" ON site_settings
FOR SELECT USING (true);
```

### 3. Создайте политики для записи (для админ-панели)
Для админ-панели лучше использовать service role key или настроить аутентификацию.

## 🔄 Обновление Netlify Functions для работы с Supabase

### 1. Установка зависимостей
Добавьте в `package.json`:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0"
  }
}
```

### 2. Создание клиента Supabase
Создайте файл `netlify/functions/supabase-client.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

module.exports = supabase;
```

## 📊 Инициализация данных

### 1. Импорт начальных данных
Вы можете импортировать данные из ваших JSON файлов через Supabase Dashboard:
1. Перейдите в "Table Editor"
2. Выберите таблицу
3. Нажмите "Insert" и введите данные вручную
4. Или используйте "Import data" для загрузки CSV

### 2. Использование SQL для импорта
```sql
-- Пример импорта начальных настроек
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_title', 'Перша приватна лікарня', 'text'),
('site_phone', '+38 (044) 495-2-495', 'text'),
('site_email', 'info@medical-center.ua', 'email'),
('emergency_number', '5288', 'text'),
('header_phone_short', '(044) 49...', 'text'),
('company_address', 'м. Київ, вул. Медична, 123', 'text'),
('footer_description', 'Професійна медична допомога на найвищому рівні', 'textarea');
```

## 🧪 Тестирование подключения

### 1. Проверка переменных окружения
Убедитесь, что все переменные окружения правильно установлены в Netlify.

### 2. Тестирование функций
После деплоя проверьте работу функций:
- `/api/load-data?type=doctors`
- `/api/load-data?type=services`
- `/api/load-data?type=settings`

## 🔧 Обновление функций загрузки данных

Обновите `netlify/functions/load-data-db.js`:
```javascript
const supabase = require('./supabase-client');

exports.handler = async (event, context) => {
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
    const urlParams = new URLSearchParams(event.queryStringParameters);
    const dataType = urlParams.get('type');
    
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
    
    let data;
    switch (dataType) {
      case 'doctors':
        const { data: doctors, error: doctorsError } = await supabase
          .from('doctors')
          .select('id, name, specialty, experience, photo_url, description, education, schedule')
          .eq('is_active', true)
          .order('sort_order');
        
        if (doctorsError) throw doctorsError;
        data = doctors;
        break;
        
      case 'services':
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('id, title, description, icon_class, price, duration, category')
          .eq('is_active', true)
          .order('sort_order');
        
        if (servicesError) throw servicesError;
        data = services.map(service => ({
          ...service,
          price: service.price ? service.price.toString() : '0'
        }));
        break;
        
      case 'news':
        const { data: news, error: newsError } = await supabase
          .from('news')
          .select('id, title, description, image_url, badge, is_active')
          .eq('is_active', true)
          .order('sort_order');
        
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
```

## 💡 Полезные советы

1. **Service Role Key** - для админ-панели используйте service role key вместо anon key
2. **Кэширование** - рассмотрите возможность добавления кэширования для улучшения производительности
3. **Мониторинг** - используйте встроенные инструменты Supabase для мониторинга запросов
4. **Резервные копии** - настройте автоматические резервные копии в Supabase

## 📞 Поддержка
Если у вас возникнут проблемы с настройкой:
1. Проверьте логи в Netlify Functions
2. Проверьте логи в Supabase Dashboard
3. Убедитесь, что все переменные окружения установлены правильно