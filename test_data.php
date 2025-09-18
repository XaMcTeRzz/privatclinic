<?php
// Тестовый файл для проверки работы с базой данных
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

// Тест получения настроек
echo "=== Тест настроек ===\n";
$query = "SELECT setting_key, setting_value FROM site_settings";
$stmt = $db->prepare($query);
$stmt->execute();
$settings = [];
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
echo "Название сайта: " . ($settings['site_title'] ?? 'Не задано') . "\n";

// Тест получения новостей
echo "\n=== Тест новостей ===\n";
$query = "SELECT * FROM news";
$stmt = $db->prepare($query);
$stmt->execute();
$news = $stmt->fetchAll();
echo "Количество новостей: " . count($news) . "\n";

// Тест получения врачей
echo "\n=== Тест врачей ===\n";
$query = "SELECT * FROM doctors";
$stmt = $db->prepare($query);
$stmt->execute();
$doctors = $stmt->fetchAll();
echo "Количество врачей: " . count($doctors) . "\n";

// Тест получения услуг
echo "\n=== Тест услуг ===\n";
$query = "SELECT * FROM services";
$stmt = $db->prepare($query);
$stmt->execute();
$services = $stmt->fetchAll();
echo "Количество услуг: " . count($services) . "\n";

// Тест получения слайдов
echo "\n=== Тест слайдов ===\n";
$query = "SELECT * FROM hero_slides";
$stmt = $db->prepare($query);
$stmt->execute();
$slides = $stmt->fetchAll();
echo "Количество слайдов: " . count($slides) . "\n";

echo "\n=== Все тесты пройдены успешно! ===\n";
?>