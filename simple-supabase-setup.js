// Простая настройка Supabase для медицинской клиники
// Этот скрипт создает минимальную интеграцию Supabase

console.log('=== Простая настройка Supabase ===');

// Шаг 1: Создание проекта Supabase
console.log('1. Создайте проект в Supabase:');
console.log('   - Перейдите на https://supabase.com/');
console.log('   - Нажмите "New Project"');
console.log('   - Введите имя проекта (например, "medical-clinic")');
console.log('   - Выберите регион и пароль');
console.log('   - Дождитесь создания проекта (1-2 минуты)');

// Шаг 2: Получение учетных данных
console.log('\n2. Получите учетные данные:');
console.log('   - В проекте Supabase перейдите в "Project Settings"');
console.log('   - Выберите "API"');
console.log('   - Скопируйте "Project URL" и "anon public" ключ');

// Шаг 3: Настройка переменных окружения
console.log('\n3. Добавьте переменные окружения в Netlify:');
console.log('   SUPABASE_URL = ваш_project_url');
console.log('   SUPABASE_KEY = ваш_anon_key');

// Шаг 4: Создание таблиц
console.log('\n4. Создайте таблицы в Supabase SQL Editor:');
console.log(`
-- Таблица врачей
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  experience INTEGER,
  photo TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица услуг
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица настроек
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL
);
`);

// Шаг 5: Добавление тестовых данных
console.log('\n5. Добавьте тестовые данные:');
console.log(`
-- Добавить тестовых врачей
INSERT INTO doctors (name, specialty, experience, photo, description) VALUES
('Иван Петров', 'Кардиолог', 10, 'images/doctor1.jpg', 'Опытный кардиолог с 10-летним стажем'),
('Мария Сидорова', 'Педиатр', 8, 'images/doctor2.jpg', 'Любящий детей педиатр');

-- Добавить тестовые услуги
INSERT INTO services (name, description, price, duration) VALUES
('Консультация врача', 'Первичная консультация специалиста', 500.00, '30 мин'),
('Анализ крови', 'Общий анализ крови', 300.00, '1 день');

-- Добавить настройки
INSERT INTO settings (key, value) VALUES
('site_title', 'Первая приватная клиника'),
('phone', '+38 (044) 123-45-67');
`);

console.log('\n=== Настройка завершена! ===');
console.log('Теперь вы можете использовать админ-панель с Supabase.');