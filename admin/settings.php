<?php
require_once 'includes/auth.php';

$auth = new Auth();
$auth->requireLogin();

$database = new Database();
$db = $database->getConnection();

$message = '';
$messageType = '';

// Обработка сохранения настроек
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$auth->validateCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = 'Недійсний CSRF токен';
        $messageType = 'danger';
    } else {
        try {
            $settings = $_POST['settings'] ?? [];
            
            foreach ($settings as $key => $value) {
                $query = "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) 
                         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()";
                $stmt = $db->prepare($query);
                $stmt->execute([$key, $value]);
            }
            
            $message = 'Налаштування успішно збережено';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Помилка збереження: ' . $e->getMessage();
            $messageType = 'danger';
        }
    }
}

// Получаем все настройки
$query = "SELECT setting_key, setting_value, setting_type FROM site_settings ORDER BY setting_key";
$stmt = $db->prepare($query);
$stmt->execute();
$settings = [];
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = [
        'value' => $row['setting_value'],
        'type' => $row['setting_type']
    ];
}

$csrf_token = $auth->generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Налаштування сайту - Адмін-панель</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .settings-section {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .settings-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .settings-content {
            padding: 25px;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .color-input {
            width: 50px;
            height: 40px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        
        .image-upload-area {
            border: 2px dashed #cbd5e0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }
        
        .image-upload-area:hover {
            border-color: #667eea;
            background: #f1f5f9;
        }
        
        .image-upload-area.dragover {
            border-color: #667eea;
            background: #eef2ff;
        }
        
        .uploaded-image {
            max-width: 200px;
            max-height: 150px;
            border-radius: 8px;
            margin: 10px 0;
        }
        
        .setting-group {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .setting-group h4 {
            margin: 0 0 15px 0;
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include 'includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="page-header">
                    <h1>Налаштування сайту</h1>
                    <p>Управління основними параметрами та контентом сайту</p>
                </div>
                
                <?php if ($message): ?>
                    <div class="alert alert-<?= $messageType ?>" data-auto-dismiss="5000">
                        <?= escape($message) ?>
                        <button class="alert-close">&times;</button>
                    </div>
                <?php endif; ?>
                
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
                    
                    <!-- Основная информация -->
                    <div class="settings-section">
                        <div class="settings-header">
                            <i class="fas fa-info-circle"></i>
                            Основна інформація
                        </div>
                        <div class="settings-content">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Назва сайту</label>
                                    <input type="text" name="settings[site_title]" class="form-control" 
                                           value="<?= escape($settings['site_title']['value'] ?? 'Перша приватна лікарня') ?>" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Слоган / Підзаголовок</label>
                                    <input type="text" name="settings[site_slogan]" class="form-control" 
                                           value="<?= escape($settings['site_slogan']['value'] ?? 'Професійна медична допомога') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Опис сайту</label>
                                    <textarea name="settings[site_description]" class="form-control" rows="4"><?= escape($settings['site_description']['value'] ?? 'Сучасна приватна лікарня з досвідченими лікарями та новітнім обладнанням') ?></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Ключові слова (SEO)</label>
                                    <input type="text" name="settings[site_keywords]" class="form-control" 
                                           value="<?= escape($settings['site_keywords']['value'] ?? 'лікарня, медицина, лікарі, здоров\'я') ?>">
                                    <small class="text-muted">Розділяйте комами</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Контактная информация -->
                    <div class="settings-section">
                        <div class="settings-header">
                            <i class="fas fa-phone"></i>
                            Контактна інформація
                        </div>
                        <div class="settings-content">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Основний телефон</label>
                                    <input type="tel" name="settings[site_phone]" class="form-control" 
                                           value="<?= escape($settings['site_phone']['value'] ?? '+38 (044) 495-2-495') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Короткий номер (в шапці)</label>
                                    <input type="text" name="settings[header_phone_short]" class="form-control" 
                                           value="<?= escape($settings['header_phone_short']['value'] ?? '(044) 49...') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="settings[site_email]" class="form-control" 
                                           value="<?= escape($settings['site_email']['value'] ?? 'info@medical-center.ua') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Номер екстреної допомоги</label>
                                    <input type="text" name="settings[emergency_number]" class="form-control" 
                                           value="<?= escape($settings['emergency_number']['value'] ?? '5288') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Адреса клініки</label>
                                    <textarea name="settings[company_address]" class="form-control" rows="3"><?= escape($settings['company_address']['value'] ?? 'м. Київ, вул. Медична, 123') ?></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Години роботи</label>
                                    <textarea name="settings[working_hours]" class="form-control" rows="3"><?= escape($settings['working_hours']['value'] ?? 'Пн-Пт: 8:00-20:00\nСб: 9:00-18:00\nНд: 10:00-16:00') ?></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Социальные сети -->
                    <div class="settings-section">
                        <div class="settings-header">
                            <i class="fab fa-facebook"></i>
                            Соціальні мережі
                        </div>
                        <div class="settings-content">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Facebook</label>
                                    <input type="url" name="settings[facebook_url]" class="form-control" 
                                           value="<?= escape($settings['facebook_url']['value'] ?? '') ?>" 
                                           placeholder="https://facebook.com/yourpage">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Instagram</label>
                                    <input type="url" name="settings[instagram_url]" class="form-control" 
                                           value="<?= escape($settings['instagram_url']['value'] ?? '') ?>" 
                                           placeholder="https://instagram.com/yourpage">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">YouTube</label>
                                    <input type="url" name="settings[youtube_url]" class="form-control" 
                                           value="<?= escape($settings['youtube_url']['value'] ?? '') ?>" 
                                           placeholder="https://youtube.com/yourchannel">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Telegram</label>
                                    <input type="url" name="settings[telegram_url]" class="form-control" 
                                           value="<?= escape($settings['telegram_url']['value'] ?? '') ?>" 
                                           placeholder="https://t.me/yourchannel">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Логотип и медиа -->
                    <div class="settings-section">
                        <div class="settings-header">
                            <i class="fas fa-image"></i>
                            Логотип та медіа
                        </div>
                        <div class="settings-content">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Логотип сайту</label>
                                    <div class="image-upload-area" data-upload="logo">
                                        <input type="file" name="logo_file" accept="image/*" style="display: none;" id="logoUpload">
                                        <input type="hidden" name="settings[site_logo]" value="<?= escape($settings['site_logo']['value'] ?? '') ?>">
                                        
                                        <?php if (!empty($settings['site_logo']['value'])): ?>
                                            <img src="../<?= escape($settings['site_logo']['value']) ?>" class="uploaded-image" alt="Logo">
                                            <br>
                                        <?php endif; ?>
                                        
                                        <i class="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
                                        <p>Перетягніть логотип сюди або <button type="button" onclick="document.getElementById('logoUpload').click()" class="btn btn-outline btn-sm">оберіть файл</button></p>
                                        <small class="text-muted">Рекомендуємо PNG з прозорим фоном, 200x60px</small>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Favicon</label>
                                    <div class="image-upload-area" data-upload="favicon">
                                        <input type="file" name="favicon_file" accept="image/*" style="display: none;" id="faviconUpload">
                                        <input type="hidden" name="settings[site_favicon]" value="<?= escape($settings['site_favicon']['value'] ?? '') ?>">
                                        
                                        <?php if (!empty($settings['site_favicon']['value'])): ?>
                                            <img src="../<?= escape($settings['site_favicon']['value']) ?>" class="uploaded-image" alt="Favicon" style="width: 32px; height: 32px;">
                                            <br>
                                        <?php endif; ?>
                                        
                                        <i class="fas fa-globe fa-2x text-muted mb-2"></i>
                                        <p>Перетягніть favicon сюди або <button type="button" onclick="document.getElementById('faviconUpload').click()" class="btn btn-outline btn-sm">оберіть файл</button></p>
                                        <small class="text-muted">ICO або PNG, 32x32px</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Цвета и стили -->
                    <div class="settings-section">
                        <div class="settings-header">
                            <i class="fas fa-palette"></i>
                            Кольори та стилі
                        </div>
                        <div class="settings-content">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Основний колір</label>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <input type="color" name="settings[primary_color]" class="color-input" 
                                               value="<?= escape($settings['primary_color']['value'] ?? '#1a73e8') ?>">
                                        <input type="text" name="settings[primary_color_hex]" class="form-control" 
                                               value="<?= escape($settings['primary_color']['value'] ?? '#1a73e8') ?>" 
                                               placeholder="#1a73e8" style="flex: 1;">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Вторинний колір</label>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <input type="color" name="settings[secondary_color]" class="color-input" 
                                               value="<?= escape($settings['secondary_color']['value'] ?? '#0d47a1') ?>">
                                        <input type="text" name="settings[secondary_color_hex]" class="form-control" 
                                               value="<?= escape($settings['secondary_color']['value'] ?? '#0d47a1') ?>" 
                                               placeholder="#0d47a1" style="flex: 1;">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Колір акценту</label>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <input type="color" name="settings[accent_color]" class="color-input" 
                                               value="<?= escape($settings['accent_color']['value'] ?? '#ea4335') ?>">
                                        <input type="text" name="settings[accent_color_hex]" class="form-control" 
                                               value="<?= escape($settings['accent_color']['value'] ?? '#ea4335') ?>" 
                                               placeholder="#ea4335" style="flex: 1;">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Шрифт</label>
                                    <select name="settings[site_font]" class="form-control">
                                        <option value="Inter" <?= ($settings['site_font']['value'] ?? 'Inter') === 'Inter' ? 'selected' : '' ?>>Inter (за замовчуванням)</option>
                                        <option value="Roboto" <?= ($settings['site_font']['value'] ?? '') === 'Roboto' ? 'selected' : '' ?>>Roboto</option>
                                        <option value="Open Sans" <?= ($settings['site_font']['value'] ?? '') === 'Open Sans' ? 'selected' : '' ?>>Open Sans</option>
                                        <option value="Lato" <?= ($settings['site_font']['value'] ?? '') === 'Lato' ? 'selected' : '' ?>>Lato</option>
                                        <option value="Montserrat" <?= ($settings['site_font']['value'] ?? '') === 'Montserrat' ? 'selected' : '' ?>>Montserrat</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- SEO и аналитика -->
                    <div class="settings-section">
                        <div class="settings-header">
                            <i class="fas fa-chart-line"></i>
                            SEO та аналітика
                        </div>
                        <div class="settings-content">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Google Analytics ID</label>
                                    <input type="text" name="settings[google_analytics]" class="form-control" 
                                           value="<?= escape($settings['google_analytics']['value'] ?? '') ?>" 
                                           placeholder="GA-XXXXXXXXX-X">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Google Tag Manager ID</label>
                                    <input type="text" name="settings[google_tag_manager]" class="form-control" 
                                           value="<?= escape($settings['google_tag_manager']['value'] ?? '') ?>" 
                                           placeholder="GTM-XXXXXXX">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Meta Keywords</label>
                                    <textarea name="settings[meta_keywords]" class="form-control" rows="3"><?= escape($settings['meta_keywords']['value'] ?? 'медична клініка, лікарі, здоров\'я, Київ') ?></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Meta Description</label>
                                    <textarea name="settings[meta_description]" class="form-control" rows="3"><?= escape($settings['meta_description']['value'] ?? 'Професійна медична допомога в приватній лікарні. Досвідчені лікарі, сучасне обладнання.') ?></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center" style="margin-top: 30px;">
                        <button type="submit" class="btn btn-primary btn-lg" style="padding: 15px 40px; font-size: 16px;">
                            <i class="fas fa-save"></i>
                            Зберегти всі налаштування
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="assets/admin.js"></script>
    <script>
        // Синхронизация color input с text input
        document.querySelectorAll('input[type="color"]').forEach(colorInput => {
            const textInput = colorInput.nextElementSibling;
            
            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
            });
            
            textInput.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                    colorInput.value = this.value;
                }
            });
        });
        
        // Обработка загрузки изображений
        document.querySelectorAll('.image-upload-area').forEach(area => {
            const input = area.querySelector('input[type="file"]');
            const hiddenInput = area.querySelector('input[type="hidden"]');
            
            area.addEventListener('click', () => {
                if (input) input.click();
            });
            
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });
            
            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });
            
            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && input) {
                    input.files = files;
                    handleFileUpload(input, area);
                }
            });
            
            if (input) {
                input.addEventListener('change', () => {
                    handleFileUpload(input, area);
                });
            }
        });
        
        function handleFileUpload(input, area) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    let existingImg = area.querySelector('.uploaded-image');
                    if (existingImg) {
                        existingImg.src = e.target.result;
                    } else {
                        const img = document.createElement('img');
                        img.className = 'uploaded-image';
                        img.src = e.target.result;
                        img.alt = 'Preview';
                        
                        // Вставляем перед текстом
                        const icon = area.querySelector('i');
                        if (icon) {
                            icon.parentNode.insertBefore(img, icon);
                            area.appendChild(document.createElement('br'));
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    </script>
</body>
</html>