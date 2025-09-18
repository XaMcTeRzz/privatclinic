<?php
// Тестовый файл для проверки работы сайта
header('Content-Type: application/json; charset=utf-8');

// Проверяем подключение к базе данных
require_once 'config/database.php';

$result = [
    'status' => 'success',
    'message' => 'Сайт работает корректно',
    'database' => []
];

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        $result['database']['status'] = 'connected';
        $result['database']['message'] = 'Подключение к базе данных успешно';
        
        // Проверяем таблицы
        $tables = ['admins', 'site_settings', 'news', 'doctors', 'services', 'hero_slides'];
        $tableStatus = [];
        
        foreach ($tables as $table) {
            try {
                $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
                $stmt->execute();
                $count = $stmt->fetch()['count'];
                $tableStatus[$table] = [
                    'status' => 'accessible',
                    'records' => $count
                ];
            } catch (Exception $e) {
                $tableStatus[$table] = [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];
            }
        }
        
        $result['database']['tables'] = $tableStatus;
    } else {
        $result['database']['status'] = 'disconnected';
        $result['database']['message'] = 'Не удалось подключиться к базе данных';
    }
} catch (Exception $e) {
    $result['status'] = 'error';
    $result['database']['status'] = 'error';
    $result['database']['message'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>