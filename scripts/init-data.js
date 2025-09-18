// Скрипт для инициализации данных при деплое на Netlify
const fs = require('fs');
const path = require('path');

// Функция для копирования файлов с правильной кодировкой
function copyFileIfExists(source, target) {
  if (fs.existsSync(source)) {
    // Убедимся что директория существует
    const targetDir = path.dirname(target);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Читаем файл с правильной кодировкой и записываем с правильной кодировкой
    const data = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(target, data, 'utf8');
    
    console.log(`Скопирован файл: ${source} -> ${target}`);
    return true;
  }
  return false;
}

// Основная функция инициализации
async function initNetlifyData() {
  console.log('Начинаем инициализацию данных для Netlify...');
  
  // Создаем директорию для данных Netlify
  const netlifyDataDir = path.join('/tmp', 'data');
  if (!fs.existsSync(netlifyDataDir)) {
    fs.mkdirSync(netlifyDataDir, { recursive: true });
    console.log(`Создана директория: ${netlifyDataDir}`);
  }
  
  // Путь к исходным данным
  const sourceDataDir = path.join(__dirname, '..', 'data');
  
  // Список файлов данных для копирования
  const dataFiles = [
    'slides.json',
    'services.json',
    'doctors.json',
    'news.json',
    'reviews.json',
    'prices.json',
    'settings.json'
  ];
  
  let copiedFiles = 0;
  
  // Копируем каждый файл данных
  dataFiles.forEach(filename => {
    const sourcePath = path.join(sourceDataDir, filename);
    const targetPath = path.join(netlifyDataDir, filename);
    
    // Копируем только если файл еще не существует в целевой директории
    if (!fs.existsSync(targetPath)) {
      if (copyFileIfExists(sourcePath, targetPath)) {
        copiedFiles++;
      }
    } else {
      console.log(`Файл уже существует, пропускаем: ${targetPath}`);
    }
  });
  
  console.log(`Инициализация данных завершена. Скопировано файлов: ${copiedFiles}`);
  
  // Возвращаем Promise для правильной обработки асинхронности
  return Promise.resolve();
}

// Запускаем инициализацию если скрипт запущен напрямую
if (require.main === module) {
  initNetlifyData().then(() => {
    console.log('Инициализация завершена');
  }).catch(error => {
    console.error('Ошибка инициализации:', error);
  });
}

module.exports = { initNetlifyData };