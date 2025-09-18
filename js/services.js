// JavaScript для страницы услуг
document.addEventListener('DOMContentLoaded', function() {
    initializeServicesPage();
});

let allServices = [];
let currentCategory = 'all';

async function initializeServicesPage() {
    await loadServices();
    initializeTabs();
    initializeSearch();
    initializeModal();
}

// Загрузка данных услуг
async function loadServices() {
    try {
        const response = await fetch('data/services.json');
        allServices = await response.json();
        renderServices(allServices);
    } catch (error) {
        console.error('Ошибка загрузки услуг:', error);
        loadFallbackServices();
    }
}

// Отображение услуг
function renderServices(services) {
    const container = document.getElementById('servicesGrid');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;

    if (services.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noResults.style.display = 'none';

    container.innerHTML = services.map((service, index) => `
        <div class="service-card ${index % 5 === 0 ? 'featured' : ''}" data-category="${service.category}">
            <div class="service-header">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-title">
                    <h3>${service.name}</h3>
                    <div class="service-category">${getCategoryName(service.category)}</div>
                </div>
            </div>
            
            <div class="service-content">
                <div class="service-description">
                    ${service.description}
                </div>
                
                <div class="service-details">
                    <div class="service-detail">
                        <div class="detail-label">Цена</div>
                        <div class="detail-value service-price">от ${service.price} грн</div>
                    </div>
                    <div class="service-detail">
                        <div class="detail-label">Длительность</div>
                        <div class="detail-value service-duration">${service.duration}</div>
                    </div>
                </div>
                
                <div class="service-actions">
                    <button class="btn btn-primary btn-book" onclick="openServiceModal(${service.id})">
                        Записаться
                    </button>
                    <a href="#" class="btn-info" onclick="showServiceDetails(${service.id})">
                        <i class="fas fa-info-circle"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'consultation': 'Консультация',
        'diagnostics': 'Диагностика',
        'specialist': 'Специалист'
    };
    return categories[category] || category;
}

// Инициализация табов
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Убираем активный класс со всех кнопок
            tabButtons.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс к нажатой кнопке
            e.target.classList.add('active');
            
            // Фильтруем услуги
            currentCategory = e.target.dataset.category;
            applyFilters();
        });
    });
}

// Инициализация поиска и сортировки
function initializeSearch() {
    const searchInput = document.getElementById('serviceSearch');
    const sortSelect = document.getElementById('sortServices');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

// Применение фильтров
function applyFilters() {
    const searchQuery = document.getElementById('serviceSearch').value.toLowerCase();
    const sortBy = document.getElementById('sortServices').value;
    
    let filteredServices = allServices.filter(service => {
        const matchesCategory = currentCategory === 'all' || service.category === currentCategory;
        const matchesSearch = !searchQuery || 
            service.name.toLowerCase().includes(searchQuery) || 
            service.description.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });
    
    // Сортировка
    filteredServices = sortServices(filteredServices, sortBy);
    
    renderServices(filteredServices);
}

// Сортировка услуг
function sortServices(services, sortBy) {
    const sorted = [...services];
    
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
            return sorted.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        case 'price-high':
            return sorted.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        case 'duration':
            return sorted.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        default:
            return sorted;
    }
}

// Debounce функция
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

// Инициализация модального окна
function initializeModal() {
    const modal = document.getElementById('serviceModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('serviceBookingForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeServiceModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeServiceModal();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', handleServiceBooking);
    }

    // Устанавливаем минимальную дату - сегодня
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Открытие модального окна записи
function openServiceModal(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;

    const modal = document.getElementById('serviceModal');
    const selectedServiceDiv = document.getElementById('selectedService');

    selectedServiceDiv.innerHTML = `
        <div class="selected-service-info">
            <div class="selected-service-icon">
                <i class="${service.icon}"></i>
            </div>
            <div class="selected-service-details">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
                <p><strong>Длительность:</strong> ${service.duration}</p>
                <div class="selected-service-price">от ${service.price} грн</div>
            </div>
        </div>
    `;

    // Сохраняем ID услуги в форме
    const form = document.getElementById('serviceBookingForm');
    form.dataset.serviceId = serviceId;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    const form = document.getElementById('serviceBookingForm');
    form.reset();
}

// Обработка отправки формы записи
function handleServiceBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceId = e.target.dataset.serviceId;
    const service = allServices.find(s => s.id == serviceId);
    
    const bookingData = {
        service: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        comment: formData.get('comment')
    };

    // Здесь можно добавить отправку данных на сервер
    console.log('Данные записи на услугу:', bookingData);
    
    // Показываем сообщение об успехе
    showNotification(`Вы успешно записались на ${service.name} на ${bookingData.date} в ${bookingData.time}`, 'success');
    
    closeServiceModal();
}

// Показ подробной информации об услуге
function showServiceDetails(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;

    const detailsHtml = `
        <div class="service-details-modal">
            <div class="service-header-modal">
                <div class="service-icon-large">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.name}</h3>
                <div class="service-category-large">${getCategoryName(service.category)}</div>
            </div>
            
            <div class="service-info-grid">
                <div class="info-item">
                    <strong>Описание:</strong>
                    <p>${service.description}</p>
                </div>
                <div class="info-item">
                    <strong>Стоимость:</strong>
                    <p>от ${service.price} грн</p>
                </div>
                <div class="info-item">
                    <strong>Длительность:</strong>
                    <p>${service.duration}</p>
                </div>
                <div class="info-item">
                    <strong>Категория:</strong>
                    <p>${getCategoryName(service.category)}</p>
                </div>
            </div>
            
            <div class="preparation-info">
                <h4>Подготовка к процедуре:</h4>
                <ul>
                    <li>Запись заранее по телефону или через сайт</li>
                    <li>Иметь при себе документ, удостоверяющий личность</li>
                    <li>Прийти за 15 минут до назначенного времени</li>
                </ul>
            </div>
        </div>
    `;

    // Создаем модальное окно для деталей
    const detailsModal = document.createElement('div');
    detailsModal.className = 'modal';
    detailsModal.innerHTML = `
        <div class="modal-content service-details-content">
            <span class="close">&times;</span>
            ${detailsHtml}
            <div class="details-actions">
                <button class="btn btn-primary" onclick="openServiceModal(${serviceId}); this.closest('.modal').remove(); document.body.style.overflow = 'auto';">
                    Записаться на услугу
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(detailsModal);
    detailsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Обработчик закрытия
    const closeBtn = detailsModal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        detailsModal.remove();
        document.body.style.overflow = 'auto';
    });

    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Загрузка запасных данных
function loadFallbackServices() {
    allServices = [
        {
            id: 1,
            name: "Терапия",
            description: "Общая терапевтическая помощь и консультации",
            icon: "fas fa-stethoscope",
            price: "500",
            category: "consultation",
            duration: "30 мин",
            available: true
        },
        {
            id: 2,
            name: "Кардиология", 
            description: "Диагностика и лечение заболеваний сердца",
            icon: "fas fa-heartbeat",
            price: "800",
            category: "specialist",
            duration: "45 мин",
            available: true
        },
        {
            id: 3,
            name: "Лабораторные анализы",
            description: "Полный спектр лабораторной диагностики",
            icon: "fas fa-vial",
            price: "200",
            category: "diagnostics",
            duration: "15 мин",
            available: true
        }
    ];
    renderServices(allServices);
}

// Показ уведомлений (если функция не определена в main.js)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Дополнительные стили для модального окна деталей
const additionalStyles = `
    <style>
        .service-details-content {
            max-width: 600px;
        }
        
        .service-header-modal {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .service-icon-large {
            width: 80px;
            height: 80px;
            background-color: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: white;
            font-size: 32px;
        }
        
        .service-category-large {
            background-color: var(--background-light);
            color: var(--primary-color);
            padding: 8px 16px;
            border-radius: 15px;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
        }
        
        .service-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-item strong {
            display: block;
            margin-bottom: 5px;
            color: var(--text-dark);
        }
        
        .info-item p {
            color: var(--text-light);
            margin: 0;
        }
        
        .preparation-info {
            background-color: var(--background-light);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
        }
        
        .preparation-info h4 {
            margin-bottom: 15px;
            color: var(--text-dark);
        }
        
        .preparation-info ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .preparation-info li {
            margin-bottom: 8px;
            color: var(--text-light);
        }
        
        .details-actions {
            text-align: center;
        }
    </style>
`;

// Добавляем стили в head
if (!document.querySelector('#service-details-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'service-details-styles';
    styleElement.innerHTML = additionalStyles;
    document.head.appendChild(styleElement);
}