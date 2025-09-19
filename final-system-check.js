// Финальный тестовый скрипт для проверки всей системы
const { createClient } = require('@supabase/supabase-js');

// Используем предоставленные данные для подключения
const supabaseUrl = 'https://egfibejxkmwppddzehet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU';

// Создаем клиент Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalSystemCheck() {
  console.log('=== ФИНАЛЬНАЯ ПРОВЕРКА СИСТЕМЫ ===\n');
  
  try {
    // 1. Проверка подключения к базе данных
    console.log('1. Проверка подключения к Supabase...');
    const { data: testDoctors, error: testError } = await supabase
      .from('doctors')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log('❌ ОШИБКА ПОДКЛЮЧЕНИЯ:', testError.message);
      return;
    }
    console.log('✅ Подключение к Supabase установлено успешно\n');
    
    // 2. Проверка таблиц
    console.log('2. Проверка таблиц базы данных...');
    
    // Проверка таблицы doctors
    const { data: doctors, error: doctorsError } = await supabase
      .from('doctors')
      .select('*');
    
    if (doctorsError) {
      console.log('❌ Ошибка таблицы doctors:', doctorsError.message);
    } else {
      console.log(`✅ Таблица doctors: ${doctors.length} записей`);
    }
    
    // Проверка таблицы services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*');
    
    if (servicesError) {
      console.log('❌ Ошибка таблицы services:', servicesError.message);
    } else {
      console.log(`✅ Таблица services: ${services.length} записей`);
    }
    
    // Проверка таблицы news
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*');
    
    if (newsError) {
      console.log('❌ Ошибка таблицы news:', newsError.message);
    } else {
      console.log(`✅ Таблица news: ${news.length} записей`);
    }
    
    // Проверка таблицы site_settings
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*');
    
    if (settingsError) {
      console.log('❌ Ошибка таблицы site_settings:', settingsError.message);
    } else {
      console.log(`✅ Таблица site_settings: ${settings.length} записей`);
    }
    
    console.log('\n3. Проверка функциональности сохранения данных...');
    
    // Тест добавления врача
    const testDoctor = {
      name: 'Тестовый Врач',
      specialty: 'Тестовая специальность',
      experience: 1,
      photo: 'images/test.jpg',
      description: 'Тестовое описание'
    };
    
    const { error: insertError } = await supabase
      .from('doctors')
      .insert([testDoctor]);
    
    if (insertError) {
      console.log('❌ Ошибка добавления врача:', insertError.message);
    } else {
      console.log('✅ Добавление врача работает корректно');
      
      // Удаляем тестового врача
      await supabase
        .from('doctors')
        .delete()
        .eq('name', 'Тестовый Врач');
    }
    
    console.log('\n4. Проверка API endpoint-ов...');
    console.log('Для проверки API endpoint-ов используйте следующие URL:');
    console.log('- GET /api/load-data?type=doctors');
    console.log('- GET /api/load-data?type=services');
    console.log('- GET /api/load-data?type=news');
    console.log('- GET /api/load-data?type=settings');
    console.log('- POST /api/save-data');
    
    console.log('\n=== ПРОВЕРКА ЗАВЕРШЕНА ===');
    console.log('\nДля локального тестирования:');
    console.log('1. Запустите: npm start');
    console.log('2. Откройте в браузере: http://localhost:8000');
    console.log('3. Админ-панель: http://localhost:8000/admin');
    
    console.log('\nДля деплоя на Netlify:');
    console.log('1. Зайдите в панель Netlify');
    console.log('2. Создайте новый сайт из GitHub репозитория');
    console.log('3. Добавьте переменные окружения SUPABASE_URL и SUPABASE_KEY');
    console.log('4. Пересоберите сайт');
    
  } catch (error) {
    console.log('❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
  }
}

// Выполняем финальную проверку
finalSystemCheck();