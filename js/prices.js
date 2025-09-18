// JavaScript для страницы цен
document.addEventListener('DOMContentLoaded', function() {
    initializePricesPage();
});

let allPrices = [];

async function initializePricesPage() {
    await loadPrices();
    initializeSearch();
    initializeModal();
}

// Загрузка данных цен
async function loadPrices() {
    try {
        const response = await fetch('/api/load-data?filename=prices.json');
        allPrices = await response.json();
        renderPrices(allPrices);
    } catch (error) {
        console.error('Ошибка загрузки цен:', error);
        loadFallbackPrices();
    }
}

// Отображение прайс-листа
function renderPrices(pricesData) {
    const container = document.getElementById('pricesContainer');
    if (!container) return;

    container.innerHTML = pricesData.map(category => `
        <div class="price-category">
            <div class="category-header">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-title">
                    <h2>${category.category}</h2>
                    <div class="category-count">${category.services.length} услуг</div>
                </div>
            </div>
            <table class="services-table">
                <thead>
                    <tr>
                        <th>Услуга</th>
                        <th>Цена</th>
                        <th>Время</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    ${category.services.map(service => `
                        <tr class="service-row" data-service-name="${service.name.toLowerCase()}" data-price="${service.price}">
                            <td>
                                <div class="service-name">${service.name}</div>
                                <div class="service-description">${service.description}</div>
                            </td>
                            <td>
                                <div class="service-price">${service.price} грн</div>
                            </td>
                            <td>
                                <div class="service-duration">${service.duration}</div>
                            </td>
                            <td class="service-action">
                                <button class="btn btn-primary btn-book-small" onclick="openPriceModal('${service.name}', ${service.price}, '${service.duration}', '${service.description}')">
                                    Записаться
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `).join('');
}

// Инициализация поиска и фильтров
function initializeSearch() {
    const searchInput = document.getElementById('priceSearch');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const resetButton = document.getElementById('resetPriceFilters');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(applyFilters, 500));
    }

    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(applyFilters, 500));
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Применение фильтров
function applyFilters() {
    const searchQuery = document.getElementById('priceSearch').value.toLowerCase();
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

    const serviceRows = document.querySelectorAll('.service-row');
    let hasVisibleRows = false;

    // Скрываем все категории сначала
    const categories = document.querySelectorAll('.price-category');
    categories.forEach(category => category.style.display = 'none');

    serviceRows.forEach(row => {
        const serviceName = row.dataset.serviceName;
        const servicePrice = parseInt(row.dataset.price);

        const matchesSearch = !searchQuery || serviceName.includes(searchQuery);
        const matchesPrice = servicePrice >= minPrice && servicePrice <= maxPrice;

        if (matchesSearch && matchesPrice) {
            row.style.display = '';
            // Показываем родительскую категорию
            const category = row.closest('.price-category');
            if (category) {
                category.style.display = 'block';
            }
            hasVisibleRows = true;
        } else {
            row.style.display = 'none';
        }
    });

    // Скрываем категории без видимых услуг
    categories.forEach(category => {
        const visibleRows = category.querySelectorAll('.service-row[style=""], .service-row:not([style])');
        if (visibleRows.length === 0) {
            category.style.display = 'none';
        }
    });

    // Показываем сообщение если ничего не найдено
    showNoResultsMessage(!hasVisibleRows);
}

// Показ сообщения об отсутствии результатов
function showNoResultsMessage(show) {
    let noResultsDiv = document.getElementById('noResults');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'noResults';
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <i class="fas fa-search"></i>
            <p>Услуги не найдены. Попробуйте изменить параметры поиска.</p>
        `;
        document.getElementById('pricesContainer').appendChild(noResultsDiv);
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('priceSearch').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    
    // Показываем все строки и категории
    const serviceRows = document.querySelectorAll('.service-row');
    const categories = document.querySelectorAll('.price-category');
    
    serviceRows.forEach(row => row.style.display = '');
    categories.forEach(category => category.style.display = 'block');
    
    showNoResultsMessage(false);
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
    const modal = document.getElementById('priceModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('priceBookingForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closePriceModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePriceModal();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', handlePriceBooking);
    }

    // Устанавливаем минимальную дату - сегодня
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Открытие модального окна записи
function openPriceModal(serviceName, price, duration, description) {
    const modal = document.getElementById('priceModal');
    const selectedServiceDiv = document.getElementById('selectedPriceService');

    selectedServiceDiv.innerHTML = `
        <div class="selected-price-service">
            <h4>${serviceName}</h4>
            <p>${description}</p>
            <div class="selected-price-details">
                <div class="selected-price-cost">${price} грн</div>
                <div class="selected-price-duration">${duration}</div>
            </div>
        </div>
    `;

    // Сохраняем данные услуги в форме
    const form = document.getElementById('priceBookingForm');
    form.dataset.serviceName = serviceName;
    form.dataset.servicePrice = price;
    form.dataset.serviceDuration = duration;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closePriceModal() {
    const modal = document.getElementById('priceModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    const form = document.getElementById('priceBookingForm');
    form.reset();
}

// Обработка отправки формы записи
function handlePriceBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceName = e.target.dataset.serviceName;
    const servicePrice = e.target.dataset.servicePrice;
    const serviceDuration = e.target.dataset.serviceDuration;
    
    const bookingData = {
        service: serviceName,
        price: servicePrice,
        duration: serviceDuration,
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        comment: formData.get('comment')
    };

    // Здесь можно добавить отправку данных на сервер
    console.log('Данные записи:', bookingData);
    
    // Показываем сообщение об успехе
    showNotification(`Вы успешно записались на "${serviceName}" на ${bookingData.date} в ${bookingData.time}`, 'success');
    
    closePriceModal();
}

// Загрузка запасных данных
function loadFallbackPrices() {
    allPrices = [
        {
            category: "Консультации",
            icon: "fas fa-user-md",
            services: [
                {
                    name: "Консультация терапевта",
                    price: 500,
                    duration: "30 мин",
                    description: "Первичный осмотр и консультация"
                },
                {
                    name: "Консультация кардиолога",
                    price: 800,
                    duration: "45 мин",
                    description: "Обследование сердечно-сосудистой системы"
                }
            ]
        },
        {
            category: "Диагностика",
            icon: "fas fa-stethoscope",
            services: [
                {
                    name: "ЭКГ",
                    price: 200,
                    duration: "15 мин",
                    description: "Электрокардиограмма"
                },
                {
                    name: "УЗИ",
                    price: 400,
                    duration: "25 мин",
                    description: "Ультразвуковое исследование"
                }
            ]
        }
    ];
    renderPrices(allPrices);
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

// Утилиты для работы с ценами
function formatPrice(price) {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0
    }).format(price);
}

function calculateDiscount(price, discountPercent) {
    return Math.round(price * (1 - discountPercent / 100));
}

// Экспорт прайс-листа в PDF (функция для будущего расширения)
function exportToPDF() {
    // Здесь можно добавить функциональность экспорта в PDF
    console.log('Экспорт в PDF...');
    showNotification('Функция экспорта в PDF будет добавлена в ближайшее время', 'info');
}

// Печать прайс-листа
function printPrices() {
    window.print();
}