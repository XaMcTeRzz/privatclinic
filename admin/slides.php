<?php
require_once 'includes/auth.php';

$auth = new Auth();
$auth->requireLogin();

$database = new Database();
$db = $database->getConnection();

$message = '';
$messageType = '';

// Обработка действий
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$auth->validateCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = 'Недійсний CSRF токен';
        $messageType = 'danger';
    } else {
        $action = $_POST['action'] ?? '';
        
        switch ($action) {
            case 'add':
            case 'edit':
                try {
                    $title = trim($_POST['title'] ?? '');
                    $subtitle = trim($_POST['subtitle'] ?? '');
                    $description = trim($_POST['description'] ?? '');
                    $button_text = trim($_POST['button_text'] ?? '');
                    $button_link = trim($_POST['button_link'] ?? '');
                    $is_active = isset($_POST['is_active']) ? 1 : 0;
                    $sort_order = intval($_POST['sort_order'] ?? 0);
                    
                    if (empty($title)) {
                        throw new Exception('Заголовок слайду обов\'язковий');
                    }
                    
                    $background_image = $_POST['current_background'] ?? '';
                    
                    // Обработка загрузки фонового изображения
                    if (isset($_FILES['background_image']) && $_FILES['background_image']['error'] === UPLOAD_ERR_OK) {
                        $background_image = uploadFile($_FILES['background_image']);
                    }
                    
                    if ($action === 'add') {
                        $query = "INSERT INTO hero_slides (title, subtitle, description, background_image, button_text, button_link, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$title, $subtitle, $description, $background_image, $button_text, $button_link, $is_active, $sort_order]);
                        $message = 'Слайд успішно додано';
                        $messageType = 'success';
                    } else {
                        $id = intval($_POST['id']);
                        $query = "UPDATE hero_slides SET title = ?, subtitle = ?, description = ?, background_image = ?, button_text = ?, button_link = ?, is_active = ?, sort_order = ?, updated_at = NOW() WHERE id = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$title, $subtitle, $description, $background_image, $button_text, $button_link, $is_active, $sort_order, $id]);
                        $message = 'Слайд успішно оновлено';
                        $messageType = 'success';
                    }
                } catch (Exception $e) {
                    $message = 'Помилка: ' . $e->getMessage();
                    $messageType = 'danger';
                }
                break;
                
            case 'delete':
                try {
                    $id = intval($_POST['id']);
                    $query = "DELETE FROM hero_slides WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$id]);
                    $message = 'Слайд успішно видалено';
                    $messageType = 'success';
                } catch (Exception $e) {
                    $message = 'Помилка видалення: ' . $e->getMessage();
                    $messageType = 'danger';
                }
                break;
        }
    }
}

// Получение списка слайдов
$query = "SELECT * FROM hero_slides ORDER BY sort_order ASC, created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$slides = $stmt->fetchAll();

$csrf_token = $auth->generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управління слайдами - Адмін-панель</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .slides-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
        }
        
        .slide-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .slide-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .slide-preview {
            position: relative;
            height: 200px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            overflow: hidden;
        }
        
        .slide-preview::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 1;
        }
        
        .slide-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 20px;
        }
        
        .slide-content h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .slide-content .subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 12px;
        }
        
        .slide-content .description {
            font-size: 13px;
            opacity: 0.8;
            line-height: 1.4;
        }
        
        .slide-info {
            padding: 20px;
        }
        
        .slide-meta {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .slide-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .badge-active {
            background: #c6f6d5;
            color: #22543d;
        }
        
        .badge-inactive {
            background: #fed7d7;
            color: #742a2a;
        }
        
        .slide-actions {
            display: flex;
            gap: 8px;
        }
        
        .large-image-upload {
            width: 100%;
            height: 200px;
            border: 2px dashed #cbd5e0;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f7fafc;
            position: relative;
            overflow: hidden;
        }
        
        .large-image-upload:hover {
            border-color: #667eea;
            background: #edf2f7;
        }
        
        .image-preview-large {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
        }
        
        .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            color: white;
            z-index: 2;
        }
        
        .large-image-upload:hover .image-overlay {
            opacity: 1;
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
                    <h1>Управління слайдами</h1>
                    <p>Створюйте та редагуйте слайди для головної сторінки</p>
                </div>
                
                <?php if ($message): ?>
                    <div class="alert alert-<?= $messageType ?>" data-auto-dismiss="5000">
                        <?= escape($message) ?>
                        <button class="alert-close">&times;</button>
                    </div>
                <?php endif; ?>
                
                <div class="content-actions">
                    <button class="btn btn-primary" data-modal-target="slideModal">
                        <i class="fas fa-plus"></i>
                        Додати слайд
                    </button>
                </div>
                
                <?php if (empty($slides)): ?>
                    <div style="text-align: center; padding: 60px 20px; color: #718096;">
                        <i class="fas fa-images fa-4x" style="margin-bottom: 20px; opacity: 0.3;"></i>
                        <h3 style="margin-bottom: 10px;">Слайдів поки немає</h3>
                        <p style="margin-bottom: 20px;">Створіть перший слайд для головної сторінки</p>
                        <button class="btn btn-primary" data-modal-target="slideModal">
                            Додати слайд
                        </button>
                    </div>
                <?php else: ?>
                    <div class="slides-grid">
                        <?php foreach ($slides as $slide): ?>
                            <div class="slide-card">
                                <div class="slide-preview" style="<?= $slide['background_image'] ? 'background-image: url(\'../'.escape($slide['background_image']).'\')' : '' ?>">
                                    <div class="slide-content">
                                        <h3><?= escape($slide['title']) ?></h3>
                                        <?php if ($slide['subtitle']): ?>
                                            <div class="subtitle"><?= escape($slide['subtitle']) ?></div>
                                        <?php endif; ?>
                                        <?php if ($slide['description']): ?>
                                            <div class="description"><?= escape(substr($slide['description'], 0, 80)) ?>...</div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                
                                <div class="slide-info">
                                    <div class="slide-meta">
                                        <span class="slide-badge <?= $slide['is_active'] ? 'badge-active' : 'badge-inactive' ?>">
                                            <?= $slide['is_active'] ? 'Активний' : 'Неактивний' ?>
                                        </span>
                                        <span class="slide-badge" style="background: #e2e8f0; color: #4a5568;">
                                            Порядок: <?= escape($slide['sort_order']) ?>
                                        </span>
                                        <?php if ($slide['button_text']): ?>
                                            <span class="slide-badge" style="background: #fef5e7; color: #c05621;">
                                                <i class="fas fa-external-link-alt"></i> Кнопка
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                    
                                    <div class="slide-actions">
                                        <button class="btn btn-outline btn-sm" onclick="editSlide(<?= $slide['id'] ?>)">
                                            <i class="fas fa-edit"></i>
                                            Редагувати
                                        </button>
                                        <button class="btn btn-danger btn-sm" onclick="deleteSlide(<?= $slide['id'] ?>)">
                                            <i class="fas fa-trash"></i>
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Модальное окно для добавления/редактирования слайда -->
    <div id="slideModal" class="modal">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h3 id="modalTitle">Додати слайд</h3>
                <button data-modal-close>&times;</button>
            </div>
            
            <form id="slideForm" method="POST" enctype="multipart/form-data" class="needs-validation">
                <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
                <input type="hidden" name="action" value="add" id="formAction">
                <input type="hidden" name="id" id="slideId">
                <input type="hidden" name="current_background" id="currentBackground">
                
                <div class="form-group">
                    <label class="form-label">Фонове зображення</label>
                    <div class="large-image-upload" onclick="document.getElementById('backgroundImage').click()">
                        <input type="file" name="background_image" id="backgroundImage" accept="image/*" style="display: none;">
                        <img id="backgroundPreview" class="image-preview-large" style="display: none;">
                        <div class="image-overlay">
                            <i class="fas fa-camera fa-2x"></i>
                        </div>
                        <div id="backgroundPlaceholder">
                            <i class="fas fa-image fa-3x" style="color: #cbd5e0; margin-bottom: 12px;"></i>
                            <p style="color: #718096; margin: 0;">Завантажити фонове зображення</p>
                            <small style="color: #a0aec0;">Рекомендований розмір: 1920x600px</small>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Заголовок слайду *</label>
                    <input type="text" name="title" id="slideTitle" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Підзаголовок</label>
                    <input type="text" name="subtitle" id="slideSubtitle" class="form-control" 
                           placeholder="Додатковий текст над заголовком">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Опис</label>
                    <textarea name="description" id="slideDescription" class="form-control" rows="4" 
                              placeholder="Детальний опис для слайду..."></textarea>
                </div>
                
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Текст кнопки</label>
                        <input type="text" name="button_text" id="slideButtonText" class="form-control" 
                               placeholder="Записатися на прийом">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Посилання кнопки</label>
                        <input type="url" name="button_link" id="slideButtonLink" class="form-control" 
                               placeholder="https://example.com">
                    </div>
                </div>
                
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Порядок сортування</label>
                        <input type="number" name="sort_order" id="slideSortOrder" class="form-control" value="0" min="0">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Статус</label>
                        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" name="is_active" id="slideIsActive" checked>
                            <span>Активний</span>
                        </label>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" data-modal-close class="btn btn-outline">Скасувати</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Зберегти
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <script src="assets/admin.js"></script>
    <script>
        // Обработка загрузки фонового изображения
        document.getElementById('backgroundImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('backgroundPreview');
                    const placeholder = document.getElementById('backgroundPlaceholder');
                    
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        function editSlide(id) {
            const slidesData = <?= json_encode($slides) ?>;
            const slide = slidesData.find(item => item.id == id);
            
            if (slide) {
                document.getElementById('modalTitle').textContent = 'Редагувати слайд';
                document.getElementById('formAction').value = 'edit';
                document.getElementById('slideId').value = slide.id;
                document.getElementById('slideTitle').value = slide.title;
                document.getElementById('slideSubtitle').value = slide.subtitle || '';
                document.getElementById('slideDescription').value = slide.description || '';
                document.getElementById('slideButtonText').value = slide.button_text || '';
                document.getElementById('slideButtonLink').value = slide.button_link || '';
                document.getElementById('slideSortOrder').value = slide.sort_order;
                document.getElementById('slideIsActive').checked = slide.is_active == 1;
                document.getElementById('currentBackground').value = slide.background_image || '';
                
                if (slide.background_image) {
                    const preview = document.getElementById('backgroundPreview');
                    const placeholder = document.getElementById('backgroundPlaceholder');
                    preview.src = '../' + slide.background_image;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                }
                
                AdminPanel.showModal('slideModal');
            }
        }
        
        function deleteSlide(id) {
            if (confirm('Ви впевнені, що хочете видалити цей слайд?')) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="${id}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
        
        // Сброс формы при открытии модального окна для добавления
        document.querySelector('[data-modal-target="slideModal"]').addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Додати слайд';
            document.getElementById('formAction').value = 'add';
            document.getElementById('slideForm').reset();
            document.getElementById('slideId').value = '';
            document.getElementById('currentBackground').value = '';
            
            const preview = document.getElementById('backgroundPreview');
            const placeholder = document.getElementById('backgroundPlaceholder');
            preview.style.display = 'none';
            placeholder.style.display = 'block';
            
            document.getElementById('slideIsActive').checked = true;
        });
    </script>
</body>
</html>