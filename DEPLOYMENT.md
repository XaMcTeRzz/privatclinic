# Деплой проекта

## Деплой на Netlify

### Автоматический деплой из GitHub

1. Зайдите в панель управления Netlify
2. Нажмите "New site from Git"
3. Выберите GitHub и авторизуйтесь
4. Выберите репозиторий `XaMcTeRzz/privatclinic`
5. Настройте параметры деплоя:
   - Branch to deploy: `master`
   - Build command: оставьте пустым (статический сайт)
   - Publish directory: `.` (точка)
6. Нажмите "Deploy site"

### Настройка переменных окружения

После создания сайта в Netlify, добавьте переменные окружения:

1. Перейдите в "Site settings" → "Build & deploy" → "Environment"
2. Добавьте следующие переменные:
   ```
   SUPABASE_URL=https://egfibejxkmwppddzehet.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU
   ```

3. Пересоберите сайт: "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

### Ручной деплой

Если вы хотите задеплоить проект вручную:

1. Установите Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Авторизуйтесь в Netlify:
   ```
   netlify login
   ```

3. Задеплойте сайт:
   ```
   netlify deploy
   ```

4. Следуйте инструкциям в терминале для выбора директории и настройки сайта

## Деплой на Vercel

### Автоматический деплой из GitHub

1. Зайдите в панель управления Vercel
2. Нажмите "New Project"
3. Импортируйте репозиторий `XaMcTeRzz/privatclinic`
4. Настройте параметры:
   - Framework Preset: Other
   - Root Directory: оставьте пустым
   - Build and Output Settings:
     - Build Command: оставьте пустым
     - Output Directory: `.` (точка)
5. Добавьте переменные окружения во вкладке "Environment Variables":
   ```
   SUPABASE_URL=https://egfibejxkmwppddzehet.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU
   ```

6. Нажмите "Deploy"

## Локальная разработка

### Запуск локального сервера

Для запуска проекта локально:

1. Установите зависимости:
   ```
   npm install
   ```

2. Запустите локальный сервер:
   ```
   npm start
   ```

3. Откройте в браузере:
   - Сайт: http://localhost:8000
   - Админ-панель: http://localhost:8000/admin

### Тестирование API

Для тестирования API функций локально:

1. Установите Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Запустите Netlify Dev:
   ```
   netlify dev
   ```

3. API будет доступен по адресу:
   - Загрузка данных: http://localhost:8888/api/load-data?type=doctors
   - Сохранение данных: http://localhost:8888/api/save-data