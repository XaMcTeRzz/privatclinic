<div class="admin-header">
    <div class="header-left">
        <button class="sidebar-toggle" id="sidebarToggle">
            <i class="fas fa-bars"></i>
        </button>
        <h2 class="page-title"><?= ucfirst(str_replace('.php', '', basename($_SERVER['PHP_SELF']))) ?></h2>
    </div>
    
    <div class="header-right">
        <div class="header-actions">
            <a href="../index.html" target="_blank" class="header-btn" title="Переглянути сайт">
                <i class="fas fa-external-link-alt"></i>
            </a>
            
            <div class="user-menu">
                <button class="user-btn" id="userMenuBtn">
                    <i class="fas fa-user"></i>
                    <span><?= escape($_SESSION['admin_username']) ?></span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                
                <div class="user-dropdown" id="userDropdown">
                    <a href="profile.php">
                        <i class="fas fa-user-cog"></i>
                        Профіль
                    </a>
                    <a href="settings.php">
                        <i class="fas fa-cog"></i>
                        Налаштування
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="logout.php" class="text-danger">
                        <i class="fas fa-sign-out-alt"></i>
                        Вихід
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>