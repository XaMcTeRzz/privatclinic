// Основной JavaScript для админ-панели
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация
    initSidebar();
    initUserMenu();
    initModals();
    initForms();
    initAlerts();
    
    // Сайдбар
    function initSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
            
            // Закрытие сайдбара при клике вне его
            document.addEventListener('click', function(e) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            });
        }
    }
    
    // Пользовательское меню
    function initUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Закрытие меню при клике вне его
            document.addEventListener('click', function() {
                userDropdown.classList.remove('show');
            });
        }
    }
    
    // Модальные окна
    function initModals() {
        // Открытие модальных окон
        document.addEventListener('click', function(e) {
            if (e.target.hasAttribute('data-modal-target')) {
                e.preventDefault();
                const modalId = e.target.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if (modal) {
                    showModal(modal);
                }
            }
        });
        
        // Закрытие модальных окон
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal') || e.target.hasAttribute('data-modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    hideModal(modal);
                }
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    hideModal(openModal);
                }
            }
        });
    }
    
    function showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Формы
    function initForms() {
        // Валидация форм
        const forms = document.querySelectorAll('.needs-validation');
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
        
        // Предварительный просмотр изображений
        const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
        imageInputs.forEach(function(input) {
            input.addEventListener('change', function(e) {
                handleImagePreview(e.target);
            });
        });
        
        // Автосохранение черновиков
        const textareas = document.querySelectorAll('textarea[data-autosave]');
        textareas.forEach(function(textarea) {
            textarea.addEventListener('input', debounce(function() {
                saveFormDraft(textarea.form);
            }, 1000));
        });
    }
    
    function handleImagePreview(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            const previewId = input.getAttribute('data-preview');
            const preview = document.getElementById(previewId);
            
            reader.onload = function(e) {
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    function saveFormDraft(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('form_draft_' + form.id, JSON.stringify(data));
    }
    
    function loadFormDraft(form) {
        const draft = localStorage.getItem('form_draft_' + form.id);
        if (draft) {
            const data = JSON.parse(draft);
            for (let key in data) {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'file') {
                    field.value = data[key];
                }
            }
        }
    }
    
    // Алерты
    function initAlerts() {
        // Автоскрытие алертов
        const alerts = document.querySelectorAll('.alert[data-auto-dismiss]');
        alerts.forEach(function(alert) {
            const delay = parseInt(alert.getAttribute('data-auto-dismiss')) || 5000;
            setTimeout(function() {
                hideAlert(alert);
            }, delay);
        });
        
        // Кнопки закрытия алертов
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('alert-close')) {
                const alert = e.target.closest('.alert');
                if (alert) {
                    hideAlert(alert);
                }
            }
        });
    }
    
    function hideAlert(alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(function() {
            alert.remove();
        }, 300);
    }
    
    // Утилиты
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // AJAX функции
    window.adminAjax = {
        request: function(url, options = {}) {
            const defaults = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            
            const config = Object.assign(defaults, options);
            
            return fetch(url, config)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('AJAX Error:', error);
                    showNotification('Произошла ошибка при выполнении запроса', 'error');
                    throw error;
                });
        },
        
        get: function(url) {
            return this.request(url);
        },
        
        post: function(url, data) {
            return this.request(url, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        put: function(url, data) {
            return this.request(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        delete: function(url) {
            return this.request(url, {
                method: 'DELETE'
            });
        }
    };
    
    // Уведомления
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getIconByType(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close">&times;</button>
        `;
        
        // Добавляем стили для уведомлений
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 500px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .alert-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    opacity: 0.7;
                    margin-left: auto;
                }
                .alert-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Автоскрытие
        setTimeout(() => hideAlert(notification), duration);
        
        // Обработчик закрытия
        notification.querySelector('.alert-close').addEventListener('click', () => {
            hideAlert(notification);
        });
    };
    
    function getIconByType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Подтверждение действий
    window.confirmAction = function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    };
    
    // Инициализация drag & drop для изображений
    function initDragAndDrop() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave);
            zone.addEventListener('drop', handleDrop);
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        const input = e.currentTarget.querySelector('input[type="file"]');
        
        if (input && files.length > 0) {
            input.files = files;
            handleImagePreview(input);
        }
    }
    
    // Инициализация дополнительных функций
    initDragAndDrop();
    
    // Автозагрузка черновиков при загрузке страницы
    const formsWithDrafts = document.querySelectorAll('form[id]');
    formsWithDrafts.forEach(loadFormDraft);
});

// Глобальные функции для использования в других скриптах
window.AdminPanel = {
    showModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },
    
    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },
    
    reloadTable: function(tableId) {
        // Перезагрузка таблицы через AJAX
        const table = document.getElementById(tableId);
        if (table) {
            // Здесь можно добавить логику перезагрузки
            location.reload();
        }
    }
};