<div class="admin-sidebar">
    <div class="sidebar-header">
        <div class="sidebar-logo">
            <i class="fas fa-heartbeat"></i>
            <span>Адмін-панель</span>
        </div>
    </div>
    
    <nav class="sidebar-nav">
        <a href="dashboard.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : '' ?>">
            <i class="fas fa-tachometer-alt"></i>
            <span>Головна</span>
        </a>
        
        <a href="news.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) == 'news.php' ? 'active' : '' ?>">
            <i class="fas fa-newspaper"></i>
            <span>Новини</span>
        </a>
        
        <a href="doctors.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) == 'doctors.php' ? 'active' : '' ?>">
            <i class="fas fa-user-md"></i>
            <span>Лікарі</span>
        </a>
        
        <a href="services.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) == 'services.php' ? 'active' : '' ?>">
            <i class="fas fa-medical-kit"></i>
            <span>Послуги</span>
        </a>
        
        <a href="slides.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) == 'slides.php' ? 'active' : '' ?>">
            <i class="fas fa-images"></i>
            <span>Слайди</span>
        </a>
        
        <a href="settings.php" class="nav-item <?= basename($_SERVER['PHP_SELF']) == 'settings.php' ? 'active' : '' ?>">
            <i class="fas fa-cog"></i>
            <span>Налаштування</span>
        </a>
        
        <div class="nav-divider"></div>
        
        <a href="../index.html" target="_blank" class="nav-item">
            <i class="fas fa-external-link-alt"></i>
            <span>Переглянути сайт</span>
        </a>
        
        <a href="logout.php" class="nav-item logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Вихід</span>
        </a>
    </nav>
</div>