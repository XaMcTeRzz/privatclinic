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
                    $badge = trim($_POST['badge'] ?? '');
                    $is_active = isset($_POST['is_active']) ? 1 : 0;
                    $sort_order = intval($_POST['sort_order'] ?? 0);
                    
                    if (empty($title)) {
                        throw new Exception('Заголовок обязателен');
                    }
                    
                    $image_url = $_POST['current_image'] ?? '';
                    
                    // Обработка загрузки изображения
                    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                        $image_url = uploadFile($_FILES['image']);
                    }
                    
                    if ($action === 'add') {
                        $query = "INSERT INTO news (title, description, image_url, badge, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$title, $description, $image_url, $badge, $is_active, $sort_order]);
                        $message = 'Новину успішно додано';
                        $messageType = 'success';
                    } else {
                        $id = intval($_POST['id']);
                        $query = "UPDATE news SET title = ?, description = ?, image_url = ?, badge = ?, is_active = ?, sort_order = ?, updated_at = NOW() WHERE id = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$title, $description, $image_url, $badge, $is_active, $sort_order, $id]);
                        $message = 'Новину успішно оновлено';
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
                    $query = "DELETE FROM news WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$id]);
                    $message = 'Новину успішно видалено';
                    $messageType = 'success';
                } catch (Exception $e) {
                    $message = 'Помилка видалення: ' . $e->getMessage();
                    $messageType = 'danger';
                }
                break;
        }
    }
}

// Получение списка новостей
$query = "SELECT * FROM news ORDER BY sort_order ASC, created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$news = $stmt->fetchAll();

// Получение конкретной новости для редактирования
$editNews = null;
if (isset($_GET['edit'])) {
    $editId = intval($_GET['edit']);
    $query = "SELECT * FROM news WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$editId]);
    $editNews = $stmt->fetch();
}

$csrf_token = $auth->generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управління новинами - Адмін-панель</title>
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
                    <h1>Управління новинами</h1>
                    <p>Додавайте, редагуйте та видаляйте новини сайту</p>
                </div>
                
                <?php if ($message): ?>
                    <div class="alert alert-<?= $messageType ?>" data-auto-dismiss="5000">
                        <?= escape($message) ?>
                        <button class="alert-close">&times;</button>
                    </div>
                <?php endif; ?>
                
                <div class="content-actions">
                    <button class="btn btn-primary" data-modal-target="newsModal">
                        <i class="fas fa-plus"></i>
                        Додати новину
                    </button>
                </div>
                
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Зображення</th>
                                <th>Заголовок</th>
                                <th>Бейдж</th>
                                <th>Статус</th>
                                <th>Порядок</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($news as $item): ?>
                                <tr>
                                    <td>
                                        <?php if ($item['image_url']): ?>
                                            <img src="../<?= escape($item['image_url']) ?>" alt="News" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;">
                                        <?php else: ?>
                                            <div style="width: 60px; height: 40px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                                                <i class="fas fa-image text-muted"></i>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <strong><?= escape($item['title']) ?></strong>
                                        <?php if ($item['description']): ?>
                                            <br><small class="text-muted"><?= escape(substr($item['description'], 0, 50)) ?>...</small>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($item['badge']): ?>
                                            <span class="badge badge-primary"><?= escape($item['badge']) ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge badge-<?= $item['is_active'] ? 'success' : 'secondary' ?>">
                                            <?= $item['is_active'] ? 'Активна' : 'Неактивна' ?>
                                        </span>
                                    </td>
                                    <td><?= escape($item['sort_order']) ?></td>
                                    <td>
                                        <div class="btn-group">
                                            <button class="btn btn-outline btn-sm" onclick="editNews(<?= $item['id'] ?>)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm" onclick="deleteNews(<?= $item['id'] ?>)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            
                            <?php if (empty($news)): ?>
                                <tr>
                                    <td colspan="6" class="text-center py-4">
                                        <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">Новин поки немає</p>
                                        <button class="btn btn-primary" data-modal-target="newsModal">
                                            Додати першу новину
                                        </button>
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Модальное окно для добавления/редактирования новости -->
    <div id="newsModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3 id="modalTitle">Додати новину</h3>
                <button data-modal-close>&times;</button>
            </div>
            
            <form id="newsForm" method="POST" enctype="multipart/form-data" class="needs-validation">
                <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
                <input type="hidden" name="action" value="add" id="formAction">
                <input type="hidden" name="id" id="newsId">
                <input type="hidden" name="current_image" id="currentImage">
                
                <div class="form-group">
                    <label class="form-label">Заголовок *</label>
                    <input type="text" name="title" id="newsTitle" class="form-control" required>
                    <div class="invalid-feedback">Будь ласка, введіть заголовок новини</div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Опис</label>
                    <textarea name="description" id="newsDescription" class="form-control" rows="3" data-autosave></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Бейдж</label>
                    <input type="text" name="badge" id="newsBadge" class="form-control" placeholder="🆕 Новість">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Зображення</label>
                    <div class="drop-zone" style="border: 2px dashed #ddd; padding: 20px; text-align: center; border-radius: 8px;">
                        <input type="file" name="image" id="newsImage" accept="image/*" data-preview="imagePreview" style="display: none;">
                        <img id="imagePreview" style="max-width: 200px; max-height: 150px; display: none; margin-bottom: 10px;">
                        <p>Перетягніть зображення сюди або <button type="button" onclick="document.getElementById('newsImage').click()" class="btn btn-outline btn-sm">оберіть файл</button></p>
                    </div>
                </div>
                
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Порядок сортування</label>
                        <input type="number" name="sort_order" id="newsSortOrder" class="form-control" value="0" min="0">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Статус</label>
                        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" name="is_active" id="newsIsActive" checked>
                            <span>Активна</span>
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
        function editNews(id) {
            // Загружаем данные новости через AJAX или из существующих данных
            const newsData = <?= json_encode($news) ?>;
            const news = newsData.find(item => item.id == id);
            
            if (news) {
                document.getElementById('modalTitle').textContent = 'Редагувати новину';
                document.getElementById('formAction').value = 'edit';
                document.getElementById('newsId').value = news.id;
                document.getElementById('newsTitle').value = news.title;
                document.getElementById('newsDescription').value = news.description || '';
                document.getElementById('newsBadge').value = news.badge || '';
                document.getElementById('newsSortOrder').value = news.sort_order;
                document.getElementById('newsIsActive').checked = news.is_active == 1;
                document.getElementById('currentImage').value = news.image_url || '';
                
                if (news.image_url) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = '../' + news.image_url;
                    preview.style.display = 'block';
                }
                
                AdminPanel.showModal('newsModal');
            }
        }
        
        function deleteNews(id) {
            if (confirm('Ви впевнені, що хочете видалити цю новину?')) {
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
        document.querySelector('[data-modal-target="newsModal"]').addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Додати новину';
            document.getElementById('formAction').value = 'add';
            document.getElementById('newsForm').reset();
            document.getElementById('newsId').value = '';
            document.getElementById('currentImage').value = '';
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('newsIsActive').checked = true;
        });
    </script>
</body>
</html>