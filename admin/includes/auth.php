<?php
session_start();
require_once '../config/database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    public function login($username, $password) {
        $query = "SELECT id, username, password, email FROM admins WHERE username = :username LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch();
            
            if (password_verify($password, $user['password'])) {
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['admin_email'] = $user['email'];
                
                // Обновляем время последнего входа
                $update_query = "UPDATE admins SET last_login = NOW() WHERE id = :id";
                $update_stmt = $this->db->prepare($update_query);
                $update_stmt->bindParam(':id', $user['id']);
                $update_stmt->execute();
                
                return true;
            }
        }
        
        return false;
    }
    
    public function logout() {
        session_destroy();
        return true;
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['admin_id']);
    }
    
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header('Location: login.php');
            exit();
        }
    }
    
    public function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    public function validateCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
}

// Функция для безопасного вывода HTML
function escape($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// Функция для безопасной загрузки файлов
function uploadFile($file, $uploadDir = '../uploads/') {
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    $maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Недопустимый тип файла. Разрешены: JPG, PNG, GIF, WebP, SVG');
    }
    
    if ($file['size'] > $maxSize) {
        throw new Exception('Файл слишком большой. Максимальный размер: 10MB');
    }
    
    // Генерируем уникальное имя файла
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . strtolower($extension);
    $filepath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Возвращаем относительный путь от корня сайта
        return 'uploads/' . $filename;
    }
    
    throw new Exception('Ошибка загрузки файла');
}

// Функция для обработки настроек с файлами
function handleSettingsUpload() {
    $uploadedFiles = [];
    
    // Обработка логотипа
    if (isset($_FILES['logo_file']) && $_FILES['logo_file']['error'] === UPLOAD_ERR_OK) {
        $uploadedFiles['site_logo'] = uploadFile($_FILES['logo_file']);
    }
    
    // Обработка favicon
    if (isset($_FILES['favicon_file']) && $_FILES['favicon_file']['error'] === UPLOAD_ERR_OK) {
        $uploadedFiles['site_favicon'] = uploadFile($_FILES['favicon_file']);
    }
    
    return $uploadedFiles;
}
?>