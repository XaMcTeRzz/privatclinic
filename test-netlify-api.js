// Тестовый скрипт для проверки работы Netlify API локально
const fs = require('fs');
const path = require('path');

// Функция для тестирования загрузки данных
async function testLoadData(filename) {
    try {
        // Имитируем путь к данным Netlify
        const dataDir = path.join('/tmp', 'data');
        const filePath = path.join(dataDir, filename);
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            console.log(`Данные из ${filename}:`, JSON.parse(data));
        } else {
            console.log(`Файл ${filename} не найден`);
        }
    } catch (error) {
        console.error(`Ошибка загрузки ${filename}:`, error.message);
    }
}

// Функция для тестирования сохранения данных
async function testSaveData(filename, data) {
    try {
        // Имитируем путь к данным Netlify
        const dataDir = path.join('/tmp', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const filePath = path.join(dataDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Данные успешно сохранены в ${filename}`);
    } catch (error) {
        console.error(`Ошибка сохранения ${filename}:`, error.message);
    }
}

// Тестовые данные
const testDoctors = [
    { id: 1, name: "Иванов Иван Иванович", specialty: "Терапевт", experience: 10 },
    { id: 2, name: "Петрова Мария Сергеевна", specialty: "Кардиолог", experience: 8 }
];

const testServices = [
    { id: 1, name: "Консультация терапевта", price: 500, category: "consultation" },
    { id: 2, name: "ЭКГ", price: 200, category: "diagnostics" }
];

// Запуск тестов
async function runTests() {
    console.log("=== Тестирование API ===");
    
    // Тест сохранения
    console.log("\n1. Тест сохранения данных:");
    await testSaveData('doctors.json', testDoctors);
    await testSaveData('services.json', testServices);
    
    // Тест загрузки
    console.log("\n2. Тест загрузки данных:");
    await testLoadData('doctors.json');
    await testLoadData('services.json');
    await testLoadData('prices.json'); // Файл, который еще не существует
    
    console.log("\n=== Тестирование завершено ===");
}

// Запуск тестов
runTests();