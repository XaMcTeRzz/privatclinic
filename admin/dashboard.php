<?php
require_once 'includes/auth.php';

$auth = new Auth();
$auth->requireLogin();

$database = new Database();
$db = $database->getConnection();

// Получаем статистику
$stats = [];
$tables = ['news', 'doctors', 'services', 'hero_slides'];

foreach ($tables as $table) {
    $query = "SELECT COUNT(*) as count FROM " . $table;
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats[$table] = $stmt->fetch()['count'];
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель управління - Перша приватна лікарня</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include 'includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="page-header">
                    <h1>Панель управління</h1>
                    <p>Ласкаво просимо до адмін-панелі сайту</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon news">
                            <i class="fas fa-newspaper"></i>
                        </div>
                        <div class="stat-content">
                            <h3><?= $stats['news'] ?></h3>
                            <p>Новини</p>
                        </div>
                        <a href="news.php" class="stat-link">Управління <i class="fas fa-arrow-right"></i></a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon doctors">
                            <i class="fas fa-user-md"></i>
                        </div>
                        <div class="stat-content">
                            <h3><?= $stats['doctors'] ?></h3>
                            <p>Лікарі</p>
                        </div>
                        <a href="doctors.php" class="stat-link">Управління <i class="fas fa-arrow-right"></i></a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon services">
                            <i class="fas fa-medical-kit"></i>
                        </div>
                        <div class="stat-content">
                            <h3><?= $stats['services'] ?></h3>
                            <p>Послуги</p>
                        </div>
                        <a href="services.php" class="stat-link">Управління <i class="fas fa-arrow-right"></i></a>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon slides">
                            <i class="fas fa-images"></i>
                        </div>
                        <div class="stat-content">
                            <h3><?= $stats['hero_slides'] ?></h3>
                            <p>Слайди</p>
                        </div>
                        <a href="slides.php" class="stat-link">Управління <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <h2>Швидкі дії</h2>
                    <div class="action-grid">
                        <a href="news.php?action=add" class="action-card">
                            <i class="fas fa-plus"></i>
                            <span>Додати новину</span>
                        </a>
                        <a href="doctors.php?action=add" class="action-card">
                            <i class="fas fa-user-plus"></i>
                            <span>Додати лікаря</span>
                        </a>
                        <a href="services.php?action=add" class="action-card">
                            <i class="fas fa-plus-circle"></i>
                            <span>Додати послугу</span>
                        </a>
                        <a href="settings.php" class="action-card">
                            <i class="fas fa-cog"></i>
                            <span>Налаштування</span>
                        </a>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h2>Остання активність</h2>
                    <div class="activity-list">
                        <div class="activity-item">
                            <i class="fas fa-sign-in-alt"></i>
                            <div class="activity-content">
                                <p>Вхід до системи</p>
                                <small><?= date('d.m.Y H:i') ?></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="assets/admin.js"></script>
</body>
</html>