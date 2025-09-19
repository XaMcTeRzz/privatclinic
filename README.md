# 🏥 Медицинская клиника - Перша приватна лікарня

Сучасний веб-сайт для медичної клініки з адаптивним дизайном та зручною адміністративною панеллю.

## 🚀 Швидкий старт

### Варіант 1: Автоматична настройка (рекомендовано)
```bash
# Встановлення всіх залежностей та настройка бази даних
node setup.js

# Запуск проекту
npm start
```

### Варіант 2: Ручна настройка (MySQL)
1. Встановіть MySQL сервер (див. [MYSQL_INSTALLATION.md](MYSQL_INSTALLATION.md))
2. Запустіть MySQL сервер
3. Встановіть залежності:
   ```bash
   npm install mysql2
   ```
4. Створіть базу даних:
   ```bash
   node create-database.js
   ```
5. Ініціалізуйте дані:
   ```bash
   node init-db-data.js
   ```
6. Запустіть проект:
   ```bash
   netlify dev
   ```

### Варіант 3: Хмарна настройка (Supabase) - Рекомендовано для Netlify/Vercel
1. Створіть акаунт на [Supabase](https://supabase.com/)
2. Створіть новий проект у Supabase
3. Встановіть залежності:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Додайте змінні оточення в Netlify/Vercel:
   - `SUPABASE_URL` - URL вашого проекту Supabase
   - `SUPABASE_KEY` - Анонімний або сервісний ключ вашого проекту
5. Створіть таблиці в Supabase (див. [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
6. Ініціалізуйте дані (опціонально):
   ```bash
   node scripts/init-supabase.js
   ```
7. Запустіть проект:
   ```bash
   netlify dev
   ```

### Варіант 4: Проста хмарна настройка (мінімальна конфігурація)
Для тих, хто хоче швидко почати без складних налаштувань:

1. Створіть проект на [Supabase](https://supabase.com/)
2. Виконайте кроки з [PROSTAYA_NASTROYKA.md](PROSTAYA_NASTROYKA.md)
3. Додайте змінні оточення в Netlify/Vercel
4. Запустіть проект:
   ```bash
   netlify dev
   ```

### Варіант 5: Найпростіша настройка (тільки підключення)
1. Створіть проект на [Supabase](https://supabase.com/)
2. Додайте змінні оточення в Netlify:
   - `SUPABASE_URL` - URL вашого проекту
   - `SUPABASE_KEY` - anon ключ
3. Пересоберіть сайт в Netlify

Детальніше про інтеграцію з Supabase: [README-SUPABASE.md](README-SUPABASE.md)

## 📁 Структура проекту

```
├── admin/          # Адміністративна панель
├── api/            # API для роботи з даними
├── data/           # JSON файли з даними (резервна копія)
├── database/       # SQL скрипти для створення бази даних
├── netlify/        # Netlify Functions для роботи з базою даних
├── js/             # JavaScript файли
├── styles/         # CSS стилі
├── images/         # Зображення
└── config/         # Конфігураційні файли
```

## 🛠️ Основні команди

```bash
# Запуск проекту
npm start

# Створення бази даних
npm run setup-db

# Ініціалізація даних
npm run init-data

# Перевірка підключення до бази даних
npm run test-db

# Перевірка MySQL сервера
npm run check-mysql

# Ініціалізація Supabase (якщо використовуєте хмарну базу даних)
npm run init-supabase

# Просте тестування Supabase
npm run test-simple-supabase
```

## 🔧 Технічний стек

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Netlify Functions (Node.js)
- **База даних**: MySQL або Supabase (PostgreSQL)
- **Розгортання**: Netlify або Vercel
- **Адміністративна панель**: Кастомна панель керування

## 📱 Адаптивність

Сайт повністю адаптований для всіх пристроїв:
- Десктопи
- Планшети
- Мобільні пристрої

## 🔐 Безпека

- Захист від XSS атак
- Захист від CSRF атак
- Валідація даних
- Санітизація вводу

## 📈 SEO оптимізація

- Семантична розмітка
- Мета-теги
- Open Graph теги
- Структуровані дані

## 🎨 Дизайн

- Сучасний та професійний вигляд
- Палітра кольорів у медичному стилі
- Іконки Font Awesome
- Плавна анімація

## 📞 Контакти

- Телефон: +38 (044) 495-2-495
- Екстрений виклик: 5288
- Email: info@medical-center.ua
- Адреса: м. Київ, вул. Медична, 123

## 🤝 Підтримка

Якщо у вас виникли проблеми з настройкою проекту:
1. Перевірте [MYSQL_INSTALLATION.md](MYSQL_INSTALLATION.md) для інструкцій з встановлення MySQL
2. Перегляньте [DATABASE_SETUP.md](DATABASE_SETUP.md) для детальної настройки бази даних
3. Дивіться [MIGRATION_TO_DB.md](MIGRATION_TO_DB.md) для інформації про міграцію з файлової системи на базу даних
4. Для Supabase інтеграції дивіться [SUPABASE_SETUP.md](SUPABASE_SETUP.md) та [README-SUPABASE.md](README-SUPABASE.md)
5. Для простої настройки дивіться [PROSTAYA_NASTROYKA.md](PROSTAYA_NASTROYKA.md)
6. Для підключення бази дивіться [ПОДКЛЮЧЕНИЕ_БАЗЫ.md](ПОДКЛЮЧЕНИЕ_БАЗЫ.md)

## 📄 Ліцензія

Цей проект призначений для внутрішнього використання медичної клініки.
# Первая приватная клиника

Медицинский сайт с админ-панелью и интеграцией Supabase.

## Описание

Этот проект представляет собой полнофункциональный медицинский сайт с админ-панелью для управления контентом. Сайт включает в себя:

- Главную страницу с слайдером и информацией о клинике
- Страницы врачей и услуг
- Новостной блок
- Админ-панель для управления всем контентом
- Интеграцию с базой данных Supabase

## Технологии

- HTML5, CSS3, JavaScript (ES6+)
- Supabase (база данных и аутентификация)
- Netlify Functions (серверные функции)
- Netlify (хостинг и CI/CD)

## Установка

1. Клонируйте репозиторий:
   ```
   git clone https://github.com/XaMcTeRzz/privatclinic.git
   ```

2. Установите зависимости:
   ```
   npm install
   ```

3. Настройте переменные окружения:
   Создайте файл `.env` в корне проекта с следующими переменными:
   ```
   SUPABASE_URL=ваш_supabase_url
   SUPABASE_KEY=ваш_supabase_key
   ```

## Структура проекта

```
├── admin/                 # Админ-панель
├── api/                   # API endpoint'ы
├── data/                  # JSON данные (резервные копии)
├── js/                    # JavaScript файлы
├── netlify/functions/     # Netlify Functions
├── styles/                # CSS стили
└── wp-medical-theme/      # WordPress тема
```

## Использование

### Локальный запуск

1. Запустите локальный сервер:
   ```
   npm start
   ```

2. Откройте в браузере:
   - Сайт: http://localhost:8000
   - Админ-панель: http://localhost:8000/admin

### Админ-панель

Админ-панель доступна по адресу `/admin`. В ней можно управлять:
- Врачами
- Услугами
- Новостями
- Настройками сайта

## Деплой

### Деплой на Netlify

1. Зайдите в панель управления Netlify
2. Нажмите "New site from Git"
3. Выберите GitHub и авторизуйтесь
4. Выберите репозиторий `XaMcTeRzz/privatclinic`
5. Настройте параметры деплоя:
   - Branch to deploy: `master`
   - Build command: оставьте пустым (статический сайт)
   - Publish directory: `.` (точка)
6. Добавьте переменные окружения:
   - `SUPABASE_URL`: https://egfibejxkmwppddzehet.supabase.co
   - `SUPABASE_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU
7. Нажмите "Deploy site"

Подробная инструкция по деплою находится в файле [DEPLOYMENT.md](DEPLOYMENT.md).

## API

Сайт использует следующие API endpoint'ы:

- `GET /api/load-data?type=doctors` - загрузка врачей
- `GET /api/load-data?type=services` - загрузка услуг
- `GET /api/load-data?type=news` - загрузка новостей
- `GET /api/load-data?type=settings` - загрузка настроек
- `POST /api/save-data` - сохранение данных

## Разработка

### Netlify Functions

Функции находятся в директории `netlify/functions/`:

- `load-data-db.js` - загрузка данных из Supabase
- `save-data-db.js` - сохранение данных в Supabase
- `supabase-client.js` - клиент Supabase

### Конфигурация Supabase

Подробная информация о конфигурации Supabase находится в файле [SUPABASE_CONFIGURATION.md](SUPABASE_CONFIGURATION.md).

## Лицензия

MIT
