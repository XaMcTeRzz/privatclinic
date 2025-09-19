# Простая настройка Supabase для медицинской клиники

Эта инструкция поможет вам быстро настроить Supabase для вашего сайта медицинской клиники.

## Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com/)
2. Нажмите "Start your project"
3. Войдите или зарегистрируйтесь
4. Нажмите "New Project"
5. Заполните форму:
   - Name: `medical-clinic`
   - Database Password: придумайте надежный пароль
   - Region: выберите ближайший к вам регион
6. Нажмите "Create Project" (ждем 1-2 минуты)

## Шаг 2: Получение учетных данных

1. После создания проекта перейдите в "Project Settings" (шестеренка в меню слева)
2. Выберите "API"
3. Скопируйте:
   - Project URL (пример: `https://abcdefghijklmnopqrst.supabase.co`)
   - anon public (пример: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Шаг 3: Настройка переменных окружения в Netlify

1. Перейдите в настройки вашего сайта в Netlify
2. Выберите "Site settings" → "Build & deploy" → "Environment"
3. Добавьте две переменные:
   ```
   SUPABASE_URL = ваш_скопированный_url
   SUPABASE_KEY = ваш_скопированный_anon_ключ
   ```
4. Сохраните изменения

## Шаг 4: Создание таблиц в Supabase

1. В Supabase перейдите в "SQL Editor" в левом меню
2. Нажмите "New query"
3. Вставьте следующий SQL код:

```sql
-- Создание таблицы врачей
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  experience INTEGER,
  photo TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы услуг
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы настроек
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL
);
```

4. Нажмите "Run" для выполнения запроса

## Шаг 5: Добавление тестовых данных

1. В SQL Editor создайте новый запрос
2. Вставьте тестовые данные:

```sql
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
```

3. Нажмите "Run"

## Шаг 6: Проверка работы

1. Перезапустите сборку сайта в Netlify
2. Откройте админ-панель
3. Попробуйте добавить нового врача или услугу
4. Проверьте, что изменения сохраняются в Supabase:
   - Перейдите в "Table Editor" в Supabase
   - Выберите таблицу "doctors" или "services"
   - Убедитесь, что новые записи появились

## Готово!

Теперь ваш сайт использует Supabase для хранения данных. Все изменения в админ-панели автоматически сохраняются в облачной базе данных.

## Полезные команды

Если вы хотите протестировать работу вручную:

```bash
# Запустить тестовый скрипт
node test-simple-supabase.js
```

## Возможные проблемы

1. **Данные не сохраняются**
   - Проверьте правильность переменных окружения
   - Убедитесь, что функции Netlify пересобрались после добавления переменных

2. **Ошибка CORS**
   - Проверьте настройки заголовков в netlify.toml

3. **Таблицы не создаются**
   - Убедитесь, что вы выполнили SQL запросы в правильном редакторе Supabase