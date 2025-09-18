const fs = require('fs');
const path = require('path');

// Тестовые данные с кириллическими символами
const testData = {
  "doctors": [
    {
      "id": 1,
      "name": "Петров Иван Иванович",
      "specialty": "Терапевт",
      "experience": 15
    },
    {
      "id": 2,
      "name": "Иванова Мария Сергеевна",
      "specialty": "Кардиолог",
      "experience": 12
    }
  ]
};

// Путь к тестовому файлу
const testFilePath = path.join('/tmp', 'data', 'test-doctors.json');

// Убедимся что директория существует
const dataDir = path.join('/tmp', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Сохраняем данные с правильной кодировкой
const jsonData = JSON.stringify(testData, null, 2);
fs.writeFileSync(testFilePath, jsonData, { encoding: 'utf8' });
console.log('Тестовые данные сохранены в:', testFilePath);

// Читаем данные с правильной кодировкой
const readData = fs.readFileSync(testFilePath, { encoding: 'utf8' });
const parsedData = JSON.parse(readData);
console.log('Тестовые данные прочитаны:');
console.log(parsedData);

// Проверяем кириллические символы
console.log('Проверка кириллических символов:');
console.log('Имя первого врача:', parsedData.doctors[0].name);
console.log('Специальность второго врача:', parsedData.doctors[1].specialty);

// Удаляем тестовый файл
fs.unlinkSync(testFilePath);
console.log('Тестовый файл удален');