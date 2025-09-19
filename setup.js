// Автоматическая настройка проекта
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

async function setupProject() {
  console.log('🚀 Автоматическая настройка проекта...');
  console.log('=====================================\n');
  
  try {
    // Проверяем наличие Node.js
    console.log('🔍 Проверка Node.js...');
    const nodeVersion = await execAsync('node --version');
    console.log(`✅ Node.js установлен: ${nodeVersion.stdout.trim()}`);
    
    // Проверяем наличие npm
    console.log('\n🔍 Проверка npm...');
    const npmVersion = await execAsync('npm --version');
    console.log(`✅ npm установлен: ${npmVersion.stdout.trim()}`);
    
    // Устанавливаем зависимости
    console.log('\n📦 Установка зависимостей...');
    try {
      await execAsync('npm install mysql2');
      console.log('✅ mysql2 установлен');
    } catch (error) {
      console.log('⚠️  Ошибка установки mysql2, пробуем установить глобально...');
      try {
        await execAsync('npm install -g mysql2');
        console.log('✅ mysql2 установлен глобально');
      } catch (globalError) {
        console.error('❌ Не удалось установить mysql2');
        throw globalError;
      }
    }
    
    // Проверяем наличие файла package.json
    try {
      await fs.access('package.json');
      console.log('✅ package.json найден');
    } catch (error) {
      console.log('⚠️  package.json не найден, создаем...');
      const packageJson = {
        "name": "privatna-likarnya",
        "version": "1.0.0",
        "description": "Медицинская клиника",
        "main": "index.js",
        "scripts": {
          "start": "netlify dev",
          "setup-db": "node create-database.js",
          "init-data": "node init-db-data.js",
          "test-db": "node test-db-connection.js",
          "check-mysql": "node check-mysql.js"
        },
        "dependencies": {
          "mysql2": "^3.9.7"
        }
      };
      
      await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
      console.log('✅ package.json создан');
    }
    
    // Проверяем MySQL сервер
    console.log('\n🔍 Проверка MySQL сервера...');
    try {
      await execAsync('node check-mysql.js');
      console.log('✅ MySQL сервер доступен');
    } catch (error) {
      console.log('❌ MySQL сервер недоступен');
      console.log('\n🔧 Пожалуйста, запустите MySQL сервер и повторите настройку.');
      console.log('   Инструкции по установке: MYSQL_INSTALLATION.md');
      return;
    }
    
    // Создаем базу данных
    console.log('\n🗄️  Создание базы данных...');
    try {
      await execAsync('node create-database.js');
      console.log('✅ База данных создана');
    } catch (error) {
      console.log('⚠️  Ошибка создания базы данных, возможно она уже существует');
    }
    
    // Инициализируем данные
    console.log('\n📥 Инициализация данных...');
    try {
      await execAsync('node init-db-data.js');
      console.log('✅ Данные инициализированы');
    } catch (error) {
      console.log('⚠️  Ошибка инициализации данных');
    }
    
    // Обновляем package.json с зависимостями
    console.log('\n📝 Обновление package.json...');
    try {
      const packageJsonContent = await fs.readFile('package.json', 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // Добавляем зависимости, если их нет
      if (!packageJson.dependencies) {
        packageJson.dependencies = {};
      }
      
      if (!packageJson.dependencies.mysql2) {
        packageJson.dependencies.mysql2 = "^3.9.7";
      }
      
      // Добавляем скрипты, если их нет
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      packageJson.scripts = {
        ...packageJson.scripts,
        "start": "netlify dev",
        "setup-db": "node create-database.js",
        "init-data": "node init-db-data.js",
        "test-db": "node test-db-connection.js",
        "check-mysql": "node check-mysql.js"
      };
      
      await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
      console.log('✅ package.json обновлен');
    } catch (error) {
      console.log('⚠️  Ошибка обновления package.json');
    }
    
    console.log('\n🎉 Настройка завершена успешно!');
    console.log('\n💡 Следующие шаги:');
    console.log('1. Запустите приложение: npm start');
    console.log('2. Откройте админ-панель: http://localhost:8888/admin/');
    console.log('3. Проверьте работу базы данных: npm run test-db');
    
    console.log('\n📚 Полезные команды:');
    console.log('   npm run setup-db    - Создать базу данных');
    console.log('   npm run init-data   - Инициализировать данные');
    console.log('   npm run test-db     - Проверить подключение к базе данных');
    console.log('   npm run check-mysql - Проверить MySQL сервер');
    
  } catch (error) {
    console.error('❌ Ошибка настройки проекта:', error.message);
    
    if (error.message.includes('ENOENT')) {
      console.error('\n🔧 Возможные решения:');
      console.error('   1. Убедитесь, что Node.js и npm установлены');
      console.error('   2. Проверьте, что вы находитесь в корневой директории проекта');
      console.error('   3. Установите Node.js с https://nodejs.org/');
    }
  }
}

// Запускаем настройку
setupProject();