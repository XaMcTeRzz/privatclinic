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
                    $description = trim($_POST['description'] ?? '');
                    $full_description = trim($_POST['full_description'] ?? '');
                    $icon_class = trim($_POST['icon_class'] ?? '');
                    $price = floatval($_POST['price'] ?? 0);
                    $duration = trim($_POST['duration'] ?? '');
                    $preparation = trim($_POST['preparation'] ?? '');
                    $contraindications = trim($_POST['contraindications'] ?? '');
                    $category = trim($_POST['category'] ?? '');
                    $is_active = isset($_POST['is_active']) ? 1 : 0;
                    $is_popular = isset($_POST['is_popular']) ? 1 : 0;
                    $sort_order = intval($_POST['sort_order'] ?? 0);
                    
                    if (empty($title)) {
                        throw new Exception('Назва послуги обов\'язкова');
                    }
                    
                    $image_url = $_POST['current_image'] ?? '';
                    
                    // Обработка загрузки изображения
                    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                        $image_url = uploadFile($_FILES['image']);
                    }
                    
                    if ($action === 'add') {
                        $query = "INSERT INTO services (title, description, full_description, icon_class, price, duration, preparation, contraindications, category, image_url, is_active, is_popular, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$title, $description, $full_description, $icon_class, $price, $duration, $preparation, $contraindications, $category, $image_url, $is_active, $is_popular, $sort_order]);
                        $message = 'Послугу успішно додано';
                        $messageType = 'success';
                    } else {
                        $id = intval($_POST['id']);
                        $query = "UPDATE services SET title = ?, description = ?, full_description = ?, icon_class = ?, price = ?, duration = ?, preparation = ?, contraindications = ?, category = ?, image_url = ?, is_active = ?, is_popular = ?, sort_order = ?, updated_at = NOW() WHERE id = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$title, $description, $full_description, $icon_class, $price, $duration, $preparation, $contraindications, $category, $image_url, $is_active, $is_popular, $sort_order, $id]);
                        $message = 'Послугу успішно оновлено';
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
                    $query = "DELETE FROM services WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$id]);
                    $message = 'Послугу успішно видалено';
                    $messageType = 'success';
                } catch (Exception $e) {
                    $message = 'Помилка видалення: ' . $e->getMessage();
                    $messageType = 'danger';
                }
                break;
        }
    }
}

// Получение списка услуг
$query = "SELECT * FROM services ORDER BY category ASC, sort_order ASC, created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$services = $stmt->fetchAll();

// Группировка по категориям
$categorizedServices = [];
foreach ($services as $service) {
    $category = $service['category'] ?: 'Загальні послуги';
    if (!isset($categorizedServices[$category])) {
        $categorizedServices[$category] = [];
    }
    $categorizedServices[$category][] = $service;
}

$csrf_token = $auth->generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управління послугами - Адмін-панель</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .services-category {
            margin-bottom: 30px;
        }
        
        .category-header {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            padding: 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        
        .service-card {
            background: #f8f9fa;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .service-header {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .service-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .service-info h4 {
            margin: 0 0 5px 0;
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
        }
        
        .service-price {
            color: #22543d;
            font-weight: 600;
            font-size: 18px;
        }
        
        .service-description {
            color: #4a5568;
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 14px;
        }
        
        .service-meta {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .service-badge {
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
        
        .badge-popular {
            background: #fef5e7;
            color: #c05621;
        }
        
        .service-actions {
            display: flex;
            gap: 8px;
        }
        
        .form-tabs {
            display: flex;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 20px;
        }
        
        .form-tab {
            padding: 12px 20px;
            background: none;
            border: none;
            color: #718096;
            cursor: pointer;
            font-weight: 500;
            border-bottom: 2px solid transparent;
        }
        
        .form-tab.active {
            color: #4facfe;
            border-bottom-color: #4facfe;
        }
        
        .form-tab-content {
            display: none;
        }
        
        .form-tab-content.active {
            display: block;
        }
        
        .icon-selector {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 10px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            background: #f8f9fa;
        }
        
        .icon-option {
            width: 50px;
            height: 50px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: white;
        }
        
        .icon-option:hover,
        .icon-option.selected {
            border-color: #4facfe;
            background: #eef8ff;
            color: #4facfe;
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
                    <h1>Управління послугами</h1>
                    <p>Додавайте та редагуйте медичні послуги вашої клініки</p>
                </div>
                
                <?php if ($message): ?>
                    <div class="alert alert-<?= $messageType ?>" data-auto-dismiss="5000">
                        <?= escape($message) ?>
                        <button class="alert-close">&times;</button>
                    </div>
                <?php endif; ?>
                
                <div class="content-actions">
                    <button class="btn btn-primary" data-modal-target="serviceModal">
                        <i class="fas fa-plus"></i>
                        Додати послугу
                    </button>
                </div>
                
                <?php if (empty($services)): ?>
                    <div style="text-align: center; padding: 60px 20px; color: #718096;">
                        <i class="fas fa-medical-kit fa-4x" style="margin-bottom: 20px; opacity: 0.3;"></i>
                        <h3 style="margin-bottom: 10px;">Послуг поки немає</h3>
                        <p style="margin-bottom: 20px;">Додайте першу медичну послугу до вашої клініки</p>
                        <button class="btn btn-primary" data-modal-target="serviceModal">
                            Додати послугу
                        </button>
                    </div>
                <?php else: ?>
                    <?php foreach ($categorizedServices as $category => $categoryServices): ?>
                        <div class="services-category">
                            <div class="category-header">
                                <i class="fas fa-folder"></i>
                                <?= escape($category) ?>
                                <span style="margin-left: auto; font-size: 14px; opacity: 0.8;">
                                    (<?= count($categoryServices) ?> послуг)
                                </span>
                            </div>
                            <div class="services-grid">
                                <?php foreach ($categoryServices as $service): ?>
                                    <div class="service-card">
                                        <div class="service-header">
                                            <div class="service-icon">
                                                <i class="<?= escape($service['icon_class'] ?: 'fas fa-medical-kit') ?>"></i>
                                            </div>
                                            <div class="service-info">
                                                <h4><?= escape($service['title']) ?></h4>
                                                <?php if ($service['price'] > 0): ?>
                                                    <div class="service-price"><?= number_format($service['price'], 2) ?> грн</div>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                        
                                        <?php if ($service['description']): ?>
                                            <div class="service-description">
                                                <?= escape($service['description']) ?>
                                            </div>
                                        <?php endif; ?>
                                        
                                        <div class="service-meta">
                                            <span class="service-badge <?= $service['is_active'] ? 'badge-active' : 'badge-inactive' ?>">
                                                <?= $service['is_active'] ? 'Активна' : 'Неактивна' ?>
                                            </span>
                                            <?php if ($service['is_popular']): ?>
                                                <span class="service-badge badge-popular">Популярна</span>
                                            <?php endif; ?>
                                            <?php if ($service['duration']): ?>
                                                <span class="service-badge" style="background: #e2e8f0; color: #4a5568;">
                                                    <i class="fas fa-clock"></i> <?= escape($service['duration']) ?>
                                                </span>
                                            <?php endif; ?>
                                        </div>
                                        
                                        <div class="service-actions">
                                            <button class="btn btn-outline btn-sm" onclick="editService(<?= $service['id'] ?>)">
                                                <i class="fas fa-edit"></i>
                                                Редагувати
                                            </button>
                                            <button class="btn btn-danger btn-sm" onclick="deleteService(<?= $service['id'] ?>)">
                                                <i class="fas fa-trash"></i>
                                                Видалити
                                            </button>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Модальное окно для добавления/редактирования услуги -->
    <div id="serviceModal" class="modal">
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3 id="modalTitle">Додати послугу</h3>
                <button data-modal-close>&times;</button>
            </div>
            
            <form id="serviceForm" method="POST" enctype="multipart/form-data" class="needs-validation">
                <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
                <input type="hidden" name="action" value="add" id="formAction">
                <input type="hidden" name="id" id="serviceId">
                <input type="hidden" name="current_image" id="currentImage">
                
                <!-- Табы -->
                <div class="form-tabs">
                    <button type="button" class="form-tab active" data-tab="basic">Основна інформація</button>
                    <button type="button" class="form-tab" data-tab="detailed">Детальна інформація</button>
                    <button type="button" class="form-tab" data-tab="settings">Налаштування</button>
                </div>
                
                <!-- Основная информация -->
                <div class="form-tab-content active" id="basic">
                    <div class="form-group">
                        <label class="form-label">Назва послуги *</label>
                        <input type="text" name="title" id="serviceTitle" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Короткий опис</label>
                        <textarea name="description" id="serviceDescription" class="form-control" rows="3" 
                                  placeholder="Короткий опис послуги для карточки..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Повний опис</label>
                        <textarea name="full_description" id="serviceFullDescription" class="form-control" rows="6" 
                                  placeholder="Детальний опис послуги, що включає, як проводиться..."></textarea>
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label class="form-label">Категорія</label>
                            <input type="text" name="category" id="serviceCategory" class="form-control" 
                                   placeholder="Діагностика, Лікування, Консультації...">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ціна (грн)</label>
                            <input type="number" name="price" id="servicePrice" class="form-control" 
                                   min="0" step="0.01" placeholder="500.00">
                        </div>
                    </div>
                </div>
                
                <!-- Детальная информация -->
                <div class="form-tab-content" id="detailed">
                    <div class="form-group">
                        <label class="form-label">Тривалість процедури</label>
                        <input type="text" name="duration" id="serviceDuration" class="form-control" 
                               placeholder="30 хвилин, 1 година, 2-3 дні...">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Підготовка до процедури</label>
                        <textarea name="preparation" id="servicePreparation" class="form-control" rows="4" 
                                  placeholder="Що потрібно зробити перед процедурою..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Протипоказання</label>
                        <textarea name="contraindications" id="serviceContraindications" class="form-control" rows="4" 
                                  placeholder="За яких умов процедуру не можна проводити..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Зображення послуги</label>
                        <div class="image-upload-area" style="border: 2px dashed #ddd; padding: 20px; text-align: center; border-radius: 8px;">
                            <input type="file" name="image" id="serviceImage" accept="image/*" style="display: none;">
                            <img id="imagePreview" style="max-width: 200px; max-height: 150px; display: none; margin-bottom: 10px;">
                            <p>Перетягніть зображення сюди або <button type="button" onclick="document.getElementById('serviceImage').click()" class="btn btn-outline btn-sm">оберіть файл</button></p>
                        </div>
                    </div>
                </div>
                
                <!-- Настройки -->
                <div class="form-tab-content" id="settings">
                    <div class="form-group">
                        <label class="form-label">Іконка послуги</label>
                        <input type="text" name="icon_class" id="serviceIcon" class="form-control" 
                               placeholder="fas fa-heartbeat" readonly>
                        <div class="icon-selector" style="margin-top: 10px;">
                            <div class="icon-option" data-icon="fas fa-heartbeat">
                                <i class="fas fa-heartbeat"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-user-md">
                                <i class="fas fa-user-md"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-stethoscope">
                                <i class="fas fa-stethoscope"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-syringe">
                                <i class="fas fa-syringe"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-pills">
                                <i class="fas fa-pills"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-x-ray">
                                <i class="fas fa-x-ray"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-microscope">
                                <i class="fas fa-microscope"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-flask">
                                <i class="fas fa-flask"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-tooth">
                                <i class="fas fa-tooth"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-eye">
                                <i class="fas fa-eye"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-brain">
                                <i class="fas fa-brain"></i>
                            </div>
                            <div class="icon-option" data-icon="fas fa-ambulance">
                                <i class="fas fa-ambulance"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label class="form-label">Порядок сортування</label>
                            <input type="number" name="sort_order" id="serviceSortOrder" class="form-control" value="0" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Статус</label>
                            <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" name="is_active" id="serviceIsActive" checked>
                                <span>Активна</span>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Популярна послуга</label>
                            <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" name="is_popular" id="serviceIsPopular">
                                <span>Популярна</span>
                            </label>
                        </div>
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
        // Работа с табами
        document.querySelectorAll('.form-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
        
        // Выбор иконки
        document.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('serviceIcon').value = this.getAttribute('data-icon');
            });
        });
        
        // Обработка загрузки изображения
        document.getElementById('serviceImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        function editService(id) {
            const servicesData = <?= json_encode($services) ?>;
            const service = servicesData.find(item => item.id == id);
            
            if (service) {
                document.getElementById('modalTitle').textContent = 'Редагувати послугу';
                document.getElementById('formAction').value = 'edit';
                document.getElementById('serviceId').value = service.id;
                document.getElementById('serviceTitle').value = service.title;
                document.getElementById('serviceDescription').value = service.description || '';
                document.getElementById('serviceFullDescription').value = service.full_description || '';
                document.getElementById('serviceCategory').value = service.category || '';
                document.getElementById('servicePrice').value = service.price || '';
                document.getElementById('serviceDuration').value = service.duration || '';
                document.getElementById('servicePreparation').value = service.preparation || '';
                document.getElementById('serviceContraindications').value = service.contraindications || '';
                document.getElementById('serviceIcon').value = service.icon_class || '';
                document.getElementById('serviceSortOrder').value = service.sort_order;
                document.getElementById('serviceIsActive').checked = service.is_active == 1;
                document.getElementById('serviceIsPopular').checked = service.is_popular == 1;
                document.getElementById('currentImage').value = service.image_url || '';
                
                // Выбираем иконку
                document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
                const iconOption = document.querySelector(`[data-icon="${service.icon_class}"]`);
                if (iconOption) {
                    iconOption.classList.add('selected');
                }
                
                if (service.image_url) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = '../' + service.image_url;
                    preview.style.display = 'block';
                }
                
                AdminPanel.showModal('serviceModal');
            }
        }
        
        function deleteService(id) {
            if (confirm('Ви впевнені, що хочете видалити цю послугу?')) {
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
        document.querySelector('[data-modal-target="serviceModal"]').addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Додати послугу';
            document.getElementById('formAction').value = 'add';
            document.getElementById('serviceForm').reset();
            document.getElementById('serviceId').value = '';
            document.getElementById('currentImage').value = '';
            
            document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
            document.getElementById('imagePreview').style.display = 'none';
            
            document.getElementById('serviceIsActive').checked = true;
            
            // Возвращаем на первый таб
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector('.form-tab[data-tab="basic"]').classList.add('active');
            document.getElementById('basic').classList.add('active');
        });
    </script>
</body>
</html>