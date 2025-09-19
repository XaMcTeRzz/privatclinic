# 🗄️ Настройка базы данных для проекта

## 📋 Необходимые компоненты

1. **MySQL сервер** (версия 5.6 или выше)
2. **Node.js** (версия 14 или выше)
3. **npm** (менеджер пакетов Node.js)

## 🚀 Быстрая настройка

### 1. Установка MySQL

#### Windows:
1. Скачайте MySQL Installer с официального сайта: https://dev.mysql.com/downloads/installer/
2. Выберите "Developer Default" конфигурацию
3. Установите сервер с пустым паролем для root пользователя

#### macOS:
```bash
# Установка через Homebrew
brew install mysql

# Запуск MySQL сервера
brew services start mysql
```

#### Linux (Ubuntu/Debian):
```bash
# Установка MySQL
sudo apt update
sudo apt install mysql-server

# Запуск MySQL сервера
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Создание базы данных

1. Подключитесь к MySQL:
```bash
mysql -u root -p
```

2. Создайте базу данных:
```sql
CREATE DATABASE IF NOT EXISTS `privatna_likarnya` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Используйте базу данных:
```sql
USE `privatna_likarnya`;
```

4. Выполните SQL скрипт для создания таблиц:
```sql
source database/setup.sql
```

Или вставьте содержимое файла `database/setup.sql` в консоль MySQL.

### 3. Установка Node.js зависимостей

В корневой директории проекта выполните:
```bash
npm install mysql2
```

### 4. Проверка подключения

Запустите тестовый скрипт:
```bash
node test-db-connection.js
```

Вы должны увидеть сообщение об успешном подключении и информацию о таблицах.

## 🛠️ Конфигурация

### Файл конфигурации базы данных: `config/database.php`

```php
<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'privatna_likarnya';
    private $username = 'root';
    private $password = '';  // Пустой пароль для локальной разработки
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch(PDOException $exception) {
            echo "Ошибка подключения: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>
```

### Конфигурация Netlify Functions: `netlify/functions/save-data-db.js`

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',  // Пустой пароль для локальной разработки
  database: 'privatna_likarnya',
  charset: 'utf8mb4'
};
```

## 🔧 Решение проблем

### Проблема: "Access denied for user 'root'@'localhost'"

**Решение:**
1. Подключитесь к MySQL как root:
```bash
mysql -u root -p
```

2. Создайте нового пользователя или измените пароль:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

### Проблема: "Can't connect to local MySQL server"

**Решение:**
1. Убедитесь, что MySQL сервер запущен:
```bash
# Windows
net start mysql

# macOS/Linux
sudo systemctl start mysql
# или
brew services start mysql
```

### Проблема: "Database 'privatna_likarnya' doesn't exist"

**Решение:**
1. Создайте базу данных вручную:
```sql
CREATE DATABASE IF NOT EXISTS `privatna_likarnya` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 📊 Структура базы данных

### Таблица `doctors`
- `id` - уникальный идентификатор
- `name` - имя врача
- `specialty` - специальность
- `experience` - опыт работы
- `photo_url` - ссылка на фото
- `description` - описание
- `education` - образование
- `schedule` - расписание (JSON)
- `is_active` - активен ли врач
- `sort_order` - порядок сортировки

### Таблица `services`
- `id` - уникальный идентификатор
- `title` - название услуги
- `description` - краткое описание
- `full_description` - полное описание
- `icon_class` - CSS класс иконки
- `price` - цена
- `duration` - продолжительность
- `category` - категория
- `is_active` - активна ли услуга
- `sort_order` - порядок сортировки

### Таблица `site_settings`
- `setting_key` - ключ настройки
- `setting_value` - значение настройки
- `setting_type` - тип настройки

## 🔄 Миграция с файловой системы на базу данных

Если у вас уже есть данные в JSON файлах, вы можете импортировать их в базу данных:

1. Исппользуйте скрипт `init-data.js` для импорта начальных данных
2. Или вручную вставьте данные через SQL запросы

## 🛡️ Безопасность

Для продакшена обязательно:
1. Установите сложный пароль для пользователя базы данных
2. Ограничьте права доступа к базе данных
3. Используйте SSL соединение
4. Регулярно создавайте резервные копии

## 📈 Производительность

Для оптимизации производительности:
1. Добавьте индексы на часто запрашиваемые поля
2. Используйте кэширование для часто запрашиваемых данных
3. Оптимизируйте SQL запросы
4. Регулярно анализируйте и оптимизируйте таблицы