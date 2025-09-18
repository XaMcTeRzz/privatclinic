<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $type = $_GET['type'] ?? '';
    
    switch ($type) {
        case 'news':
            $query = "SELECT * FROM news WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $data = $stmt->fetchAll();
            break;
            
        case 'doctors':
            $query = "SELECT * FROM doctors WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $data = $stmt->fetchAll();
            break;
            
        case 'services':
            $query = "SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $data = $stmt->fetchAll();
            break;
            
        case 'settings':
            $query = "SELECT setting_key, setting_value FROM site_settings";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll();
            
            $data = [];
            foreach ($results as $row) {
                $data[$row['setting_key']] = $row['setting_value'];
            }
            break;
            
        case 'hero_slides':
            $query = "SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $data = $stmt->fetchAll();
            break;
            
        default:
            throw new Exception('Невірний тип запиту');
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>