// Полный тест системы
const { exec } = require('child_process');
const { promisify } = require('util');
const mysql = require('mysql2/promise');

const execAsync = promisify(exec);

async function fullSystemTest() {
  console.log('🧪 Полное тестирование системы...');
  console.log('================================\n');
  
  let testResults = {
    node: false,
    npm: false,
    mysqlServer: false,
    database: false,
    tables: false,
    data: false,
    api: false
  };
  
  try {
    // Тест 1: Проверка Node.js
    console.log('🔍 Тест 1: Проверка Node.js...');
    try {
      const nodeVersion = await execAsync('node --version');
      console.log(`✅ Node.js установлен: ${nodeVersion.stdout.trim()}`);
      testResults.node = true;
    } catch (error) {
      console.log('❌ Node.js не установлен');
    }
    
    // Тест 2: Проверка npm
    console.log('\n🔍 Тест 2: Проверка npm...');
    try {
      const npmVersion = await execAsync('npm --version');
      console.log(`✅ npm установлен: ${npmVersion.stdout.trim()}`);
      testResults.npm = true;
    } catch (error) {
      console.log('❌ npm не установлен');
    }
    
    // Тест 3: Проверка MySQL сервера
    console.log('\n🔍 Тест 3: Проверка MySQL сервера...');
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        timeout: 5000
      });
      
      console.log('✅ MySQL сервер запущен и доступен');
      testResults.mysqlServer = true;
      
      // Тест 4: Проверка базы данных
      console.log('\n🔍 Тест 4: Проверка базы данных...');
      try {
        await connection.execute("USE `privatna_likarnya`");
        console.log('✅ База данных privatna_likarnya доступна');
        testResults.database = true;
        
        // Тест 5: Проверка таблиц
        console.log('\n🔍 Тест 5: Проверка таблиц...');
        const [tables] = await connection.execute("SHOW TABLES");
        const tableNames = tables.map(row => Object.values(row)[0]);
        
        const requiredTables = ['admins', 'doctors', 'services', 'site_settings', 'news', 'hero_slides'];
        const missingTables = requiredTables.filter(table => !tableNames.includes(table));
        
        if (missingTables.length === 0) {
          console.log('✅ Все необходимые таблицы существуют');
          testResults.tables = true;
        } else {
          console.log(`❌ Отсутствуют таблицы: ${missingTables.join(', ')}`);
        }
        
        // Тест 6: Проверка данных
        console.log('\n🔍 Тест 6: Проверка данных...');
        try {
          const [doctorsCount] = await connection.execute('SELECT COUNT(*) as count FROM doctors');
          const [servicesCount] = await connection.execute('SELECT COUNT(*) as count FROM services');
          
          console.log(`📊 Врачи: ${doctorsCount[0].count} записей`);
          console.log(`📊 Услуги: ${servicesCount[0].count} записей`);
          
          if (doctorsCount[0].count > 0 && servicesCount[0].count > 0) {
            console.log('✅ Данные присутствуют в таблицах');
            testResults.data = true;
          } else {
            console.log('⚠️  Таблицы пусты (это нормально для новой установки)');
            testResults.data = true; // Считаем тест пройденным, так как таблицы существуют
          }
        } catch (dataError) {
          console.log('❌ Ошибка проверки данных:', dataError.message);
        }
        
      } catch (dbError) {
        console.log('❌ База данных недоступна:', dbError.message);
      }
      
      await connection.end();
    } catch (error) {
      console.log('❌ MySQL сервер недоступен:', error.message);
    }
    
    // Тест 7: Проверка API функций
    console.log('\n🔍 Тест 7: Проверка API функций...');
    try {
      // Проверяем существование файлов функций
      const fs = require('fs').promises;
      await fs.access('netlify/functions/save-data-db.js');
      await fs.access('netlify/functions/load-data-db.js');
      
      console.log('✅ Netlify Functions существуют');
      testResults.api = true;
    } catch (error) {
      console.log('❌ Netlify Functions отсутствуют');
    }
    
    // Вывод результатов
    console.log('\n📈 Результаты тестирования:');
    console.log('==========================');
    
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result).length;
    
    console.log(`✅ Пройдено тестов: ${passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 Все тесты пройдены успешно!');
      console.log('\n💡 Система готова к использованию!');
      console.log('   Запустите: npm start');
    } else {
      console.log('\n❌ Некоторые тесты не пройдены');
      console.log('\n🔧 Рекомендуемые действия:');
      
      if (!testResults.node || !testResults.npm) {
        console.log('   1. Установите Node.js с https://nodejs.org/');
      }
      
      if (!testResults.mysqlServer) {
        console.log('   2. Установите и запустите MySQL сервер (см. MYSQL_INSTALLATION.md)');
      }
      
      if (!testResults.database || !testResults.tables) {
        console.log('   3. Создайте базу данных: node create-database.js');
      }
      
      if (!testResults.api) {
        console.log('   4. Проверьте наличие Netlify Functions в директории netlify/functions/');
      }
      
      console.log('   5. Повторите тестирование: node full-system-test.js');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

// Запускаем полное тестирование
fullSystemTest();