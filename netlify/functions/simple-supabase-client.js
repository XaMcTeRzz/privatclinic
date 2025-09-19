// Упрощенный клиент Supabase
const { createClient } = require('@supabase/supabase-js');

// Для локального тестирования используем жестко заданные значения
// В production следует использовать переменные окружения
const supabaseUrl = 'https://egfibejxkmwppddzehet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU';

// Проверяем, что учетные данные заданы
if (!supabaseUrl || !supabaseKey) {
  console.error('ОШИБКА: Не заданы переменные окружения SUPABASE_URL или SUPABASE_KEY');
  console.error('Пожалуйста, добавьте их в настройки Netlify');
  process.exit(1);
}

// Создаем клиент Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;