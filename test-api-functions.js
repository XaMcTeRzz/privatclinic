// Тестовый скрипт для проверки работы API функций
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
            return JSON.parse(data);
        } else {
            console.log(`Файл ${filename} не найден`);
            return null;
        }
    } catch (error) {
        console.error(`Ошибка загрузки ${filename}:`, error.message);
        return null;
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
        return true;
    } catch (error) {
        console.error(`Ошибка сохранения ${filename}:`, error.message);
        return false;
    }
}

// Тестовые данные врачей
const testDoctors = [
    { 
        id: 1, 
        name: "Иванов Иван Иванович", 
        specialty: "Терапевт", 
        experience: 10,
        photo: "images/doctors/ivanov.jpg",
        education: "Киевский национальный медицинский университет",
        description: "Опытный терапевт с 10-летним стажем",
        qualifications: ["Врач высшей категории"],
        schedule: {
            monday: "9:00-17:00",
            tuesday: "9:00-17:00",
            wednesday: "9:00-17:00",
            thursday: "9:00-17:00",
            friday: "9:00-15:00",
            saturday: "выходной",
            sunday: "выходной"
        },
        rating: 4.8,
        reviews_count: 156,
        available: true
    }
];

// Тестовые данные услуг
const testServices = [
    { 
        id: 1, 
        name: "Консультация терапевта", 
        description: "Первичная консультация по общим вопросам",
        icon: "fas fa-stethoscope",
        price: "500",
        category: "consultation",
        duration: "30 мин",
        available: true
    }
];

// Тестовые данные цен
const testPrices = [
    {
        category: "Консультации",
        icon: "fas fa-stethoscope",
        services: [
            {
                name: "Консультация терапевта",
                price: "500",
                duration: "30 мин",
                description: "Первичная консультация по общим вопросам"
            }
        ]
    }
];

// Запуск тестов
async function runTests() {
    console.log("=== Тестирование API функций ===");
    
    // Тест сохранения
    console.log("\n1. Тест сохранения данных:");
    await testSaveData('doctors.json', testDoctors);
    await testSaveData('services.json', testServices);
    await testSaveData('prices.json', testPrices);
    
    // Тест загрузки
    console.log("\n2. Тест загрузки данных:");
    await testLoadData('doctors.json');
    await testLoadData('services.json');
    await testLoadData('prices.json');
    
    console.log("\n=== Тестирование завершено ===");
}

// Запуск тестов
runTests();