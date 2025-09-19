// Утилита для подключения к базе данных в Netlify Functions
const mysql = require('mysql2/promise');

// Конфигурация базы данных из переменных окружения
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'privatna_likarnya',
  charset: 'utf8mb4'
};

// Создание пула соединений для лучшей производительности
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      charset: dbConfig.charset,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Функция для выполнения запросов к базе данных
async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Функция для инициализации базы данных
async function initializeDatabase() {
  try {
    // Создаем временное соединение без указания базы данных
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Создаем базу данных если она не существует
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ База данных создана или уже существует');
    
    // Закрываем временное соединение
    await tempConnection.end();
    
    // Создаем таблицы
    const pool = getPool();
    
    // Таблица врачей
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`doctors\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL,
        \`specialty\` varchar(100) NOT NULL,
        \`experience\` varchar(50),
        \`photo_url\` varchar(500),
        \`description\` text,
        \`education\` text,
        \`schedule\` text,
        \`is_active\` tinyint(1) DEFAULT 1,
        \`sort_order\` int(11) DEFAULT 0,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Таблица услуг
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`title\` varchar(100) NOT NULL,
        \`description\` text,
        \`icon_class\` varchar(50),
        \`price\` decimal(10,2) DEFAULT NULL,
        \`duration\` varchar(50),
        \`category\` varchar(100),
        \`is_active\` tinyint(1) DEFAULT 1,
        \`sort_order\` int(11) DEFAULT 0,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Таблица настроек
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`site_settings\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`setting_key\` varchar(100) NOT NULL UNIQUE,
        \`setting_value\` text NOT NULL,
        \`setting_type\` varchar(20) DEFAULT 'text',
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Таблица новостей
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`news\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`title\` varchar(200) NOT NULL,
        \`description\` text,
        \`image_url\` varchar(500),
        \`badge\` varchar(50),
        \`is_active\` tinyint(1) DEFAULT 1,
        \`sort_order\` int(11) DEFAULT 0,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    console.log('✅ Все таблицы созданы или уже существуют');
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error.message);
    return false;
  }
}

module.exports = {
  query,
  initializeDatabase
};