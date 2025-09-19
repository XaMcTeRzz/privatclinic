// Скрипт для диагностики проблемы с сохранением данных
console.log('=== Диагностика системы ===');

// Проверка подключения к API
async function checkApiConnection() {
    try {
        console.log('Проверка подключения к API загрузки данных...');
        const response = await fetch('/api/load-data?filename=services.json');
        const data = await response.json();
        console.log('✅ API загрузки данных работает корректно');
        console.log('Полученные данные:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка подключения к API загрузки данных:', error);
        return null;
    }
}

// Проверка сохранения данных
async function checkDataSaving() {
    try {
        console.log('Проверка сохранения данных...');
        // Получаем текущие данные
        const currentData = await checkApiConnection();
        if (!currentData) return false;
        
        // Попытка сохранить данные
        const saveResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: 'services.json',
                data: currentData
            })
        });
        
        if (saveResponse.ok) {
            console.log('✅ API сохранения данных работает корректно');
            return true;
        } else {
            console.error('❌ Ошибка сохранения данных:', await saveResponse.text());
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка при проверке сохранения данных:', error);
        return false;
    }
}

// Проверка работы с Supabase
async function checkSupabaseConnection() {
    try {
        console.log('Проверка подключения к Supabase...');
        // Попробуем загрузить данные через Supabase
        const response = await fetch('/api/load-data?type=services');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Подключение к Supabase работает');
            console.log('Данные из Supabase:', data);
            return true;
        } else {
            console.log('ℹ️ Supabase API вернул статус:', response.status);
            return false;
        }
    } catch (error) {
        console.log('ℹ️ Supabase недоступен (это нормально для локальной версии):', error.message);
        return false;
    }
}

// Основная функция диагностики
async function runDiagnostics() {
    console.log('Начало диагностики...');
    
    // Проверяем API
    await checkApiConnection();
    
    // Проверяем сохранение
    await checkDataSaving();
    
    // Проверяем Supabase
    await checkSupabaseConnection();
    
    console.log('=== Диагностика завершена ===');
}

// Запускаем диагностику
runDiagnostics();