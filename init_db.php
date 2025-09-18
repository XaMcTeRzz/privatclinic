<?php
require_once 'config/database.php';

// Подключение к базе данных
$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "Подключение к базе данных успешно установлено!\n";
    
    // Создание базы данных
    try {
        $db->exec("CREATE DATABASE IF NOT EXISTS `privatna_likarnya` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "База данных 'privatna_likarnya' создана или уже существует.\n";
        
        // Выбор базы данных
        $db->exec("USE `privatna_likarnya`");
        echo "База данных выбрана.\n";
        
        // Создание таблиц
        $sql = file_get_contents('database/setup.sql');
        $statements = explode(';', $sql);
        
        foreach ($statements as $statement) {
            $statement = trim($statement);
            if (!empty($statement)) {
                try {
                    $db->exec($statement);
                    echo "Выполнено: " . substr($statement, 0, 50) . "...\n";
                } catch (PDOException $e) {
                    echo "Ошибка при выполнении: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "Все таблицы успешно созданы!\n";
        
    } catch (PDOException $e) {
        echo "Ошибка при создании базы данных: " . $e->getMessage() . "\n";
    }
} else {
    echo "Ошибка подключения к базе данных.\n";
}
?>