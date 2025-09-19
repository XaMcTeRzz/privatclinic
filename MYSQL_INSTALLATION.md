# 📦 Установка MySQL для разных операционных систем

## 🪟 Windows

### Вариант 1: Установка через MySQL Installer (рекомендуется)

1. **Скачайте MySQL Installer:**
   - Перейдите на https://dev.mysql.com/downloads/installer/
   - Скачайте файл `mysql-installer-web-community-x.x.x.x.msi`

2. **Запустите установку:**
   - Запустите скачанный файл от имени администратора
   - Выберите "Developer Default" конфигурацию
   - Нажмите "Next" и следуйте инструкциям установщика

3. **Настройка root пользователя:**
   - При настройке пароля для root пользователя оставьте поле пустым
   - Это упростит локальную разработку

4. **Завершение установки:**
   - Дождитесь завершения установки
   - MySQL сервер будет автоматически запущен

### Вариант 2: Установка через XAMPP

1. **Скачайте XAMPP:**
   - Перейдите на https://www.apachefriends.org/download.html
   - Скачайте версию для Windows

2. **Установите XAMPP:**
   - Запустите установщик
   - Выберите компоненты: Apache, MySQL, PHP, phpMyAdmin
   - Завершите установку

3. **Запустите MySQL:**
   - Откройте XAMPP Control Panel
   - Нажмите "Start" напротив MySQL

## 🍏 macOS

### Вариант 1: Установка через Homebrew (рекомендуется)

1. **Установите Homebrew (если еще не установлен):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Установите MySQL:**
   ```bash
   brew install mysql
   ```

3. **Запустите MySQL сервер:**
   ```bash
   brew services start mysql
   ```

4. **Настройте безопасность (опционально):**
   ```bash
   mysql_secure_installation
   ```
   При настройке оставьте пароль root пустым для упрощения локальной разработки

### Вариант 2: Установка через официальный установщик

1. **Скачайте MySQL:**
   - Перейдите на https://dev.mysql.com/downloads/mysql/
   - Выберите macOS и скачайте DMG файл

2. **Установите MySQL:**
   - Откройте скачанный DMG файл
   - Следуйте инструкциям установщика
   - Запомните временный пароль root пользователя

3. **Запустите MySQL:**
   - Системные настройки → MySQL → Start MySQL Server

## 🐧 Linux (Ubuntu/Debian)

### Установка через apt

1. **Обновите пакеты:**
   ```bash
   sudo apt update
   ```

2. **Установите MySQL сервер:**
   ```bash
   sudo apt install mysql-server
   ```

3. **Запустите MySQL сервер:**
   ```bash
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

4. **Настройте безопасность:**
   ```bash
   sudo mysql_secure_installation
   ```
   При настройке оставьте пароль root пустым для упрощения локальной разработки

## 🔧 Проверка установки

После установки проверьте, что MySQL работает:

```bash
node check-mysql.js
```

Если все установлено правильно, вы увидите сообщение:
```
✅ MySQL сервер запущен и доступен
```

## 🔐 Настройка пользователя root

Для локальной разработки рекомендуется использовать пустой пароль для пользователя root:

1. **Подключитесь к MySQL:**
   ```bash
   mysql -u root -p
   ```
   (Если установлен пароль, введите его. Если нет - просто нажмите Enter)

2. **Измените пароль на пустой:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
   FLUSH PRIVILEGES;
   EXIT;
   ```

## 🚀 Автоматическое создание базы данных

После установки MySQL вы можете автоматически создать базу данных и все таблицы:

```bash
node create-database.js
```

Этот скрипт:
1. Создаст базу данных `privatna_likarnya`
2. Создаст все необходимые таблицы
3. Добавит начальные данные

## 📋 Часто возникающие проблемы

### Проблема: "Can't connect to local MySQL server"

**Решение:**
- Убедитесь, что MySQL сервер запущен
- Проверьте, что порт 3306 не блокируется брандмауэром
- Перезапустите MySQL сервер

### Проблема: "Access denied for user 'root'@'localhost'"

**Решение:**
- Сбросьте пароль root пользователя:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
  FLUSH PRIVILEGES;
  ```

### Проблема: "ER_NOT_SUPPORTED_AUTH_MODE"

**Решение:**
- Измените метод аутентификации:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
  FLUSH PRIVILEGES;
  ```

## 🛡️ Безопасность для продакшена

Для локальной разработки пустой пароль допустим, но для продакшена обязательно:
1. Установите сложный пароль для root пользователя
2. Создайте отдельного пользователя для приложения
3. Ограничьте права доступа
4. Включите SSL соединение