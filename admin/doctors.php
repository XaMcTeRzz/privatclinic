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
                    $name = trim($_POST['name'] ?? '');
                    $specialty = trim($_POST['specialty'] ?? '');
                    $experience = trim($_POST['experience'] ?? '');
                    $description = trim($_POST['description'] ?? '');
                    $education = trim($_POST['education'] ?? '');
                    $achievements = trim($_POST['achievements'] ?? '');
                    $languages = trim($_POST['languages'] ?? '');
                    $consultation_price = floatval($_POST['consultation_price'] ?? 0);
                    $phone = trim($_POST['phone'] ?? '');
                    $email = trim($_POST['email'] ?? '');
                    $schedule = trim($_POST['schedule'] ?? '');
                    $is_active = isset($_POST['is_active']) ? 1 : 0;
                    $sort_order = intval($_POST['sort_order'] ?? 0);
                    
                    if (empty($name) || empty($specialty)) {
                        throw new Exception('Ім\'я та спеціальність обов\'язкові');
                    }
                    
                    $photo_url = $_POST['current_photo'] ?? '';
                    
                    // Обработка загрузки фото
                    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                        $photo_url = uploadFile($_FILES['photo']);
                    }
                    
                    if ($action === 'add') {
                        $query = "INSERT INTO doctors (name, specialty, experience, photo_url, description, education, achievements, languages, consultation_price, phone, email, schedule, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$name, $specialty, $experience, $photo_url, $description, $education, $achievements, $languages, $consultation_price, $phone, $email, $schedule, $is_active, $sort_order]);
                        $message = 'Лікаря успішно додано';
                        $messageType = 'success';
                    } else {
                        $id = intval($_POST['id']);
                        $query = "UPDATE doctors SET name = ?, specialty = ?, experience = ?, photo_url = ?, description = ?, education = ?, achievements = ?, languages = ?, consultation_price = ?, phone = ?, email = ?, schedule = ?, is_active = ?, sort_order = ?, updated_at = NOW() WHERE id = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$name, $specialty, $experience, $photo_url, $description, $education, $achievements, $languages, $consultation_price, $phone, $email, $schedule, $is_active, $sort_order, $id]);
                        $message = 'Інформацію про лікаря успішно оновлено';
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
                    $query = "DELETE FROM doctors WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$id]);
                    $message = 'Лікаря успішно видалено';
                    $messageType = 'success';
                } catch (Exception $e) {
                    $message = 'Помилка видалення: ' . $e->getMessage();
                    $messageType = 'danger';
                }
                break;
        }
    }
}

// Получение списка врачей
$query = "SELECT * FROM doctors ORDER BY sort_order ASC, created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$doctors = $stmt->fetchAll();

// Получение конкретного врача для редактирования
$editDoctor = null;
if (isset($_GET['edit'])) {
    $editId = intval($_GET['edit']);
    $query = "SELECT * FROM doctors WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$editId]);
    $editDoctor = $stmt->fetch();
}

$csrf_token = $auth->generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управління лікарями - Адмін-панель</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .doctor-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        
        .doctor-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .doctor-header {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .doctor-photo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #e2e8f0;
        }
        
        .doctor-info h3 {
            margin: 0 0 5px 0;
            color: #2d3748;
            font-size: 18px;
        }
        
        .doctor-specialty {
            color: #667eea;
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .doctor-experience {
            color: #718096;
            font-size: 14px;
        }
        
        .doctor-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .status-badge {
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-active {
            background: #c6f6d5;
            color: #22543d;
        }
        
        .status-inactive {
            background: #fed7d7;
            color: #742a2a;
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
            color: #667eea;
            border-bottom-color: #667eea;
        }
        
        .form-tab-content {
            display: none;
        }
        
        .form-tab-content.active {
            display: block;
        }
        
        .photo-upload-area {
            width: 150px;
            height: 150px;
            border: 2px dashed #cbd5e0;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f7fafc;
            position: relative;
        }
        
        .photo-upload-area:hover {
            border-color: #667eea;
            background: #edf2f7;
        }
        
        .photo-preview {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
        }
        
        .photo-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            color: white;
        }
        
        .photo-upload-area:hover .photo-overlay {
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
                    <h1>Управління лікарями</h1>
                    <p>Додавайте, редагуйте профілі лікарів та управляйте їх розкладом</p>
                </div>
                
                <?php if ($message): ?>
                    <div class="alert alert-<?= $messageType ?>" data-auto-dismiss="5000">
                        <?= escape($message) ?>
                        <button class="alert-close">&times;</button>
                    </div>
                <?php endif; ?>
                
                <div class="content-actions">
                    <button class="btn btn-primary" data-modal-target="doctorModal">
                        <i class="fas fa-user-plus"></i>
                        Додати лікаря
                    </button>
                </div>
                
                <div class="doctors-grid">
                    <?php foreach ($doctors as $doctor): ?>
                        <div class="doctor-card">
                            <div class="doctor-header">
                                <img src="../<?= escape($doctor['photo_url'] ?: 'images/default-doctor.jpg') ?>" 
                                     alt="<?= escape($doctor['name']) ?>" class="doctor-photo">
                                <div class="doctor-info">
                                    <h3><?= escape($doctor['name']) ?></h3>
                                    <div class="doctor-specialty"><?= escape($doctor['specialty']) ?></div>
                                    <div class="doctor-experience"><?= escape($doctor['experience']) ?></div>
                                    <span class="status-badge <?= $doctor['is_active'] ? 'status-active' : 'status-inactive' ?>">
                                        <?= $doctor['is_active'] ? 'Активний' : 'Неактивний' ?>
                                    </span>
                                </div>
                            </div>
                            
                            <?php if ($doctor['description']): ?>
                                <p style="color: #4a5568; margin-bottom: 15px; line-height: 1.5;">
                                    <?= escape(substr($doctor['description'], 0, 120)) ?>...
                                </p>
                            <?php endif; ?>
                            
                            <?php if ($doctor['consultation_price'] > 0): ?>
                                <div style="margin-bottom: 15px;">
                                    <strong style="color: #22543d;">Консультація: <?= number_format($doctor['consultation_price'], 2) ?> грн</strong>
                                </div>
                            <?php endif; ?>
                            
                            <div class="doctor-actions">
                                <button class="btn btn-outline btn-sm" onclick="editDoctor(<?= $doctor['id'] ?>)">
                                    <i class="fas fa-edit"></i>
                                    Редагувати
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteDoctor(<?= $doctor['id'] ?>)">
                                    <i class="fas fa-trash"></i>
                                    Видалити
                                </button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                    
                    <?php if (empty($doctors)): ?>
                        <div style="text-align: center; padding: 60px 20px; color: #718096;">
                            <i class="fas fa-user-md fa-4x" style="margin-bottom: 20px; opacity: 0.3;"></i>
                            <h3 style="margin-bottom: 10px;">Лікарів поки немає</h3>
                            <p style="margin-bottom: 20px;">Додайте першого лікаря до вашої клініки</p>
                            <button class="btn btn-primary" data-modal-target="doctorModal">
                                Додати лікаря
                            </button>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Модальное окно для добавления/редактирования врача -->
    <div id="doctorModal" class="modal">
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3 id="modalTitle">Додати лікаря</h3>
                <button data-modal-close>&times;</button>
            </div>
            
            <form id="doctorForm" method="POST" enctype="multipart/form-data" class="needs-validation">
                <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
                <input type="hidden" name="action" value="add" id="formAction">
                <input type="hidden" name="id" id="doctorId">
                <input type="hidden" name="current_photo" id="currentPhoto">
                
                <!-- Табы -->
                <div class="form-tabs">
                    <button type="button" class="form-tab active" data-tab="basic">Основна інформація</button>
                    <button type="button" class="form-tab" data-tab="detailed">Детальна інформація</button>
                    <button type="button" class="form-tab" data-tab="contact">Контакти та розклад</button>
                </div>
                
                <!-- Основная информация -->
                <div class="form-tab-content active" id="basic">
                    <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="form-group">
                            <label class="form-label">Фото</label>
                            <div class="photo-upload-area" onclick="document.getElementById('doctorPhoto').click()">
                                <input type="file" name="photo" id="doctorPhoto" accept="image/*" style="display: none;">
                                <img id="photoPreview" class="photo-preview" style="display: none;">
                                <div class="photo-overlay">
                                    <i class="fas fa-camera"></i>
                                </div>
                                <div id="photoPlaceholder">
                                    <i class="fas fa-user fa-2x" style="color: #cbd5e0; margin-bottom: 8px;"></i>
                                    <small style="color: #718096;">Завантажити фото</small>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="form-group">
                                <label class="form-label">Повне ім'я *</label>
                                <input type="text" name="name" id="doctorName" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Спеціальність *</label>
                                <input type="text" name="specialty" id="doctorSpecialty" class="form-control" required 
                                       placeholder="наприклад: Кардіолог">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Досвід роботи</label>
                                <input type="text" name="experience" id="doctorExperience" class="form-control" 
                                       placeholder="наприклад: 15 років досвіду">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Короткий опис</label>
                        <textarea name="description" id="doctorDescription" class="form-control" rows="4" 
                                  placeholder="Коротко опишіть досвід та спеціалізацію лікаря..."></textarea>
                    </div>
                </div>
                
                <!-- Детальная информация -->
                <div class="form-tab-content" id="detailed">
                    <div class="form-group">
                        <label class="form-label">Освіта</label>
                        <textarea name="education" id="doctorEducation" class="form-control" rows="4" 
                                  placeholder="Вищі навчальні заклади, курси підвищення кваліфікації..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Досягнення та сертифікати</label>
                        <textarea name="achievements" id="doctorAchievements" class="form-control" rows="4" 
                                  placeholder="Нагороди, сертифікати, публікації..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Мови</label>
                        <input type="text" name="languages" id="doctorLanguages" class="form-control" 
                               placeholder="Українська, Англійська, Російська">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Вартість консультації (грн)</label>
                        <input type="number" name="consultation_price" id="doctorPrice" class="form-control" 
                               min="0" step="0.01" placeholder="500.00">
                    </div>
                </div>
                
                <!-- Контакты и расписание -->
                <div class="form-tab-content" id="contact">
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label class="form-label">Телефон</label>
                            <input type="tel" name="phone" id="doctorPhone" class="form-control" 
                                   placeholder="+38 (099) 123-45-67">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" id="doctorEmail" class="form-control" 
                                   placeholder="doctor@clinic.com">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Розклад роботи</label>
                        <textarea name="schedule" id="doctorSchedule" class="form-control" rows="4" 
                                  placeholder="Пн-Пт: 9:00-18:00&#10;Сб: 10:00-15:00&#10;Нд: вихідний"></textarea>
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label class="form-label">Порядок сортування</label>
                            <input type="number" name="sort_order" id="doctorSortOrder" class="form-control" value="0" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Статус</label>
                            <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" name="is_active" id="doctorIsActive" checked>
                                <span>Активний</span>
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
                
                // Убираем активный класс с всех табов и контента
                document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
                
                // Добавляем активный класс к выбранному табу и контенту
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
        
        // Обработка загрузки фото
        document.getElementById('doctorPhoto').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('photoPreview');
                    const placeholder = document.getElementById('photoPlaceholder');
                    
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        function editDoctor(id) {
            const doctorsData = <?= json_encode($doctors) ?>;
            const doctor = doctorsData.find(item => item.id == id);
            
            if (doctor) {
                document.getElementById('modalTitle').textContent = 'Редагувати лікаря';
                document.getElementById('formAction').value = 'edit';
                document.getElementById('doctorId').value = doctor.id;
                document.getElementById('doctorName').value = doctor.name;
                document.getElementById('doctorSpecialty').value = doctor.specialty;
                document.getElementById('doctorExperience').value = doctor.experience || '';
                document.getElementById('doctorDescription').value = doctor.description || '';
                document.getElementById('doctorEducation').value = doctor.education || '';
                document.getElementById('doctorAchievements').value = doctor.achievements || '';
                document.getElementById('doctorLanguages').value = doctor.languages || '';
                document.getElementById('doctorPrice').value = doctor.consultation_price || '';
                document.getElementById('doctorPhone').value = doctor.phone || '';
                document.getElementById('doctorEmail').value = doctor.email || '';
                document.getElementById('doctorSchedule').value = doctor.schedule || '';
                document.getElementById('doctorSortOrder').value = doctor.sort_order;
                document.getElementById('doctorIsActive').checked = doctor.is_active == 1;
                document.getElementById('currentPhoto').value = doctor.photo_url || '';
                
                if (doctor.photo_url) {
                    const preview = document.getElementById('photoPreview');
                    const placeholder = document.getElementById('photoPlaceholder');
                    preview.src = '../' + doctor.photo_url;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                }
                
                AdminPanel.showModal('doctorModal');
            }
        }
        
        function deleteDoctor(id) {
            if (confirm('Ви впевнені, що хочете видалити цього лікаря?')) {
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
        document.querySelector('[data-modal-target="doctorModal"]').addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Додати лікаря';
            document.getElementById('formAction').value = 'add';
            document.getElementById('doctorForm').reset();
            document.getElementById('doctorId').value = '';
            document.getElementById('currentPhoto').value = '';
            
            const preview = document.getElementById('photoPreview');
            const placeholder = document.getElementById('photoPlaceholder');
            preview.style.display = 'none';
            placeholder.style.display = 'block';
            
            document.getElementById('doctorIsActive').checked = true;
            
            // Возвращаем на первый таб
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector('.form-tab[data-tab="basic"]').classList.add('active');
            document.getElementById('basic').classList.add('active');
        });
    </script>
</body>
</html>