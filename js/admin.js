// JavaScript для админ-панели
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

let currentData = {
    doctors: [],
    services: [],
    prices: [],
    reviews: []
};

let currentEditingId = null;
let currentEditingType = null;

// Инициализация админ-панели
async function initializeAdmin() {
    await loadAllData();
    initializeNavigation();
    initializeModals();
    renderAllSections();
}

// Загрузка всех данных для админки
async function loadAllData() {
    try {
        // Загружаем врачей через API
        const doctorsResponse = await fetch('/api/load-data?type=doctors');
        const doctorsData = await doctorsResponse.json();
        renderDoctors(doctorsData);

        // Загружаем услуги через API
        const servicesResponse = await fetch('/api/load-data?type=services');
        const servicesData = await servicesResponse.json();
        renderServices(servicesData);

        // Загружаем цены через API
        const pricesResponse = await fetch('/api/load-data?filename=prices.json');
        const pricesData = await pricesResponse.json();
        renderPrices(pricesData);

        // Загружаем отзывы через API
        const reviewsResponse = await fetch('/api/load-data?filename=reviews.json');
        const reviewsData = await reviewsResponse.json();
        renderReviews(reviewsData);

        // Загружаем настройки через API
        const settingsResponse = await fetch('/api/load-data?type=settings');
        const settingsData = await settingsResponse.json();
        loadSettings(settingsData);

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Загрузка настроек
function loadSettings(settings) {
    if (settings.siteName) document.getElementById('siteName').value = settings.siteName;
    if (settings.sitePhone) document.getElementById('sitePhone').value = settings.sitePhone;
    if (settings.siteEmail) document.getElementById('siteEmail').value = settings.siteEmail;
    if (settings.siteAddress) document.getElementById('siteAddress').value = settings.siteAddress;
    if (settings.workingHours) document.getElementById('workingHours').value = settings.workingHours;
}

// Инициализация навигации
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Убираем активный класс со всех пунктов
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // Добавляем активный класс к нажатому
            item.classList.add('active');
            
            // Скрываем все секции
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Показываем нужную секцию
            const targetSection = item.dataset.section;
            const section = document.getElementById(`${targetSection}-section`);
            if (section) {
                section.classList.add('active');
            }
        });
    });
}

// Инициализация модальных окон
function initializeModals() {
    // Модальное окно врача
    const doctorModal = document.getElementById('doctorModal');
    const doctorCloseBtn = doctorModal.querySelector('.close');
    const doctorForm = document.getElementById('doctorForm');

    doctorCloseBtn.addEventListener('click', closeDoctorModal);
    doctorForm.addEventListener('submit', handleDoctorSubmit);

    // Модальное окно услуги
    const serviceModal = document.getElementById('serviceModal');
    const serviceCloseBtn = serviceModal.querySelector('.close');
    const serviceForm = document.getElementById('serviceForm');

    serviceCloseBtn.addEventListener('click', closeServiceModal);
    serviceForm.addEventListener('submit', handleServiceSubmit);

    // Закрытие модальных окон по клику вне них
    window.addEventListener('click', (e) => {
        if (e.target === doctorModal) closeDoctorModal();
        if (e.target === serviceModal) closeServiceModal();
    });
}

// Отображение всех секций
function renderAllSections() {
    renderDoctors();
    renderServices();
    renderPrices();
    renderReviews();
}

// Отображение врачей
function renderDoctors() {
    const container = document.getElementById('doctorsList');
    
    if (currentData.doctors.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-md"></i>
                <p>Врачи не добавлены</p>
                <button class="btn btn-primary" onclick="addNewDoctor()">Добавить первого врача</button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentData.doctors.map(doctor => `
        <div class="item-card doctor-card">
            <div class="item-header">
                <div style="display: flex; align-items: center;">
                    <div class="doctor-photo" style="background-image: url('${doctor.photo || 'images/doctor-placeholder.jpg'}')"></div>
                    <div class="item-title">
                        <h3>${doctor.name}</h3>
                        <div class="item-subtitle">${doctor.specialty}</div>
                        <div class="item-meta">
                            <span class="rating-stars">${'★'.repeat(Math.floor(doctor.rating))}</span>
                            ${doctor.rating} • ${doctor.experience} лет опыта
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon btn-edit" onclick="editDoctor(${doctor.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteDoctor(${doctor.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <p><strong>Образование:</strong> ${doctor.education || 'Не указано'}</p>
                <p><strong>Описание:</strong> ${doctor.description || 'Не указано'}</p>
                <span class="badge ${doctor.available ? 'badge-available' : 'badge-unavailable'}">
                    ${doctor.available ? 'Доступен' : 'Недоступен'}
                </span>
            </div>
        </div>
    `).join('');
}

// Отображение услуг
function renderServices() {
    const container = document.getElementById('servicesList');
    
    if (currentData.services.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-stethoscope"></i>
                <p>Услуги не добавлены</p>
                <button class="btn btn-primary" onclick="addNewService()">Добавить первую услугу</button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentData.services.map(service => `
        <div class="item-card service-card">
            <div class="item-header">
                <div class="item-title">
                    <div style="display: flex; align-items: flex-start; gap: 15px;">
                        <div class="service-icon">
                            <i class="${service.icon}"></i>
                        </div>
                        <div>
                            <h3>${service.name}</h3>
                            <div class="item-subtitle">${getCategoryName(service.category)}</div>
                            <div class="item-meta">
                                <span class="price-badge">${service.price} грн</span> • ${service.duration}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon btn-edit" onclick="editService(${service.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteService(${service.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <p>${service.description}</p>
                <span class="badge ${service.available ? 'badge-available' : 'badge-unavailable'}">
                    ${service.available ? 'Доступна' : 'Недоступна'}
                </span>
            </div>
        </div>
    `).join('');
}

// Отображение цен
function renderPrices() {
    const container = document.getElementById('pricesList');
    
    if (currentData.prices.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-money-bill-wave"></i>
                <p>Категории цен не добавлены</p>
                <button class="btn btn-primary" onclick="addNewPriceCategory()">Добавить категорию</button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentData.prices.map((category, categoryIndex) => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">
                    <h3>${category.category}</h3>
                    <div class="item-meta">${category.services.length} услуг</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon btn-edit" onclick="editPriceCategory(${categoryIndex})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deletePriceCategory(${categoryIndex})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-content">
                ${category.services.map(service => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                        <span>${service.name}</span>
                        <span><strong>${service.price} грн</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Отображение отзывов
function renderReviews() {
    const container = document.getElementById('reviewsList');
    
    if (currentData.reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <p>Отзывы не добавлены</p>
                <button class="btn btn-primary" onclick="addNewReview()">Добавить отзыв</button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentData.reviews.map(review => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">
                    <h3>${review.author}</h3>
                    <div class="item-subtitle">
                        <span class="rating-stars">${'★'.repeat(review.rating)}</span>
                        Врач: ${review.doctor || 'Не указан'}
                    </div>
                    <div class="item-meta">${formatDate(review.date)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon btn-edit" onclick="editReview(${review.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteReview(${review.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <p>"${review.text}"</p>
            </div>
        </div>
    `).join('');
}

// Функции для работы с врачами
function addNewDoctor() {
    currentEditingType = 'add';
    currentEditingId = null;
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editDoctor(id) {
    const doctor = currentData.doctors.find(d => d.id === id);
    if (!doctor) return;

    currentEditingType = 'edit';
    currentEditingId = id;

    const form = document.getElementById('doctorForm');
    form.name.value = doctor.name;
    form.specialty.value = doctor.specialty;
    form.experience.value = doctor.experience;
    form.photo.value = doctor.photo || '';
    form.education.value = doctor.education || '';
    form.description.value = doctor.description || '';
    form.rating.value = doctor.rating || 5;

    document.getElementById('doctorModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function deleteDoctor(id) {
    if (confirm('Вы уверены, что хотите удалить этого врача?')) {
        currentData.doctors = currentData.doctors.filter(d => d.id !== id);
        renderDoctors();
        showNotification('Врач удален', 'success');
        
        // Автоматически сохраняем данные на сервер
        saveDoctorsData();
    }
}

function closeDoctorModal() {
    document.getElementById('doctorModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleDoctorSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const doctorData = {
        name: formData.get('name'),
        specialty: formData.get('specialty'),
        experience: parseInt(formData.get('experience')),
        photo: formData.get('photo') || 'images/doctor-placeholder.jpg',
        education: formData.get('education'),
        description: formData.get('description'),
        rating: parseFloat(formData.get('rating')) || 5,
        reviews_count: 0,
        available: true,
        qualifications: [],
        schedule: {
            monday: "9:00-17:00",
            tuesday: "9:00-17:00",
            wednesday: "9:00-17:00",
            thursday: "9:00-17:00",
            friday: "9:00-15:00",
            saturday: "выходной",
            sunday: "выходной"
        }
    };

    if (currentEditingType === 'add') {
        doctorData.id = Date.now();
        currentData.doctors.push(doctorData);
        showNotification('Врач добавлен', 'success');
    } else {
        const index = currentData.doctors.findIndex(d => d.id === currentEditingId);
        if (index !== -1) {
            currentData.doctors[index] = { ...currentData.doctors[index], ...doctorData };
            showNotification('Врач обновлен', 'success');
        }
    }

    renderDoctors();
    closeDoctorModal();
    
    // Автоматически сохраняем данные на сервер
    saveDoctorsData();
}

// Функция для сохранения данных врачей
async function saveDoctorsData() {
    try {
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataType: 'doctors',
                data: currentData.doctors
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save doctors data');
        }
        
        showNotification('Данные врачей сохранены', 'success');
    } catch (error) {
        console.error('Ошибка сохранения данных врачей:', error);
        showNotification('Ошибка сохранения данных врачей: ' + error.message, 'error');
    }
}

// Функции для работы с услугами
function addNewService() {
    currentEditingType = 'add';
    currentEditingId = null;
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editService(id) {
    const service = currentData.services.find(s => s.id === id);
    if (!service) return;

    currentEditingType = 'edit';
    currentEditingId = id;

    const form = document.getElementById('serviceForm');
    form.name.value = service.name;
    form.description.value = service.description;
    form.icon.value = service.icon;
    form.price.value = service.price;
    form.category.value = service.category;
    form.duration.value = service.duration;

    document.getElementById('serviceModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function deleteService(id) {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
        currentData.services = currentData.services.filter(s => s.id !== id);
        renderServices();
        showNotification('Услуга удалена', 'success');
        
        // Автоматически сохраняем данные на сервер
        saveServicesData();
    }
}

function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleServiceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceData = {
        name: formData.get('name'),
        description: formData.get('description'),
        icon: formData.get('icon') || 'fas fa-stethoscope',
        price: formData.get('price'),
        category: formData.get('category'),
        duration: formData.get('duration'),
        available: true
    };

    if (currentEditingType === 'add') {
        serviceData.id = Date.now();
        currentData.services.push(serviceData);
        showNotification('Услуга добавлена', 'success');
    } else {
        const index = currentData.services.findIndex(s => s.id === currentEditingId);
        if (index !== -1) {
            currentData.services[index] = { ...currentData.services[index], ...serviceData };
            showNotification('Услуга обновлена', 'success');
        }
    }

    renderServices();
    closeServiceModal();
    
    // Автоматически сохраняем данные на сервер
    saveServicesData();
}

// Функция для сохранения данных услуг
async function saveServicesData() {
    try {
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataType: 'services',
                data: currentData.services
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save services data');
        }
        
        showNotification('Данные услуг сохранены', 'success');
    } catch (error) {
        console.error('Ошибка сохранения данных услуг:', error);
        showNotification('Ошибка сохранения данных услуг: ' + error.message, 'error');
    }
}

// Функции для работы с ценами
function addNewPriceCategory() {
    showNotification('Функция в разработке', 'warning');
}

function editPriceCategory(index) {
    showNotification('Функция в разработке', 'warning');
}

function deletePriceCategory(index) {
    showNotification('Функция в разработке', 'warning');
}

// Функция для сохранения данных цен
async function savePricesData() {
    try {
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: 'prices.json',
                data: currentData.prices
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save prices data');
        }
        
        showNotification('Данные цен сохранены', 'success');
    } catch (error) {
        console.error('Ошибка сохранения данных цен:', error);
        showNotification('Ошибка сохранения данных цен: ' + error.message, 'error');
    }
}

// Функции для работы с отзывами
function addNewReview() {
    showNotification('Функция в разработке', 'warning');
}

function editReview(id) {
    showNotification('Функция в разработке', 'warning');
}

function deleteReview(id) {
    showNotification('Функция в разработке', 'warning');
}

// Функция для сохранения данных отзывов
async function saveReviewsData() {
    try {
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: 'reviews.json',
                data: currentData.reviews
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save reviews data');
        }
        
        showNotification('Данные отзывов сохранены', 'success');
    } catch (error) {
        console.error('Ошибка сохранения данных отзывов:', error);
        showNotification('Ошибка сохранения данных отзывов: ' + error.message, 'error');
    }
}

// Сохранение настроек
async function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        sitePhone: document.getElementById('sitePhone').value,
        siteEmail: document.getElementById('siteEmail').value,
        siteAddress: document.getElementById('siteAddress').value,
        workingHours: document.getElementById('workingHours').value
    };

    try {
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataType: 'settings',
                data: settings
            })
        });

        if (response.ok) {
            showNotification('Настройки сохранены', 'success');
        } else {
            throw new Error('Failed to save settings');
        }
    } catch (error) {
        console.error('Ошибка сохранения настроек:', error);
        showNotification('Ошибка сохранения настроек: ' + error.message, 'error');
    }
}

// Сохранение всех данных
async function saveAllData() {
    try {
        // Сохраняем данные врачей
        const doctorsResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataType: 'doctors',
                data: currentData.doctors
            })
        });

        if (!doctorsResponse.ok) {
            throw new Error('Failed to save doctors data');
        }

        // Сохраняем данные услуг
        const servicesResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataType: 'services',
                data: currentData.services
            })
        });

        if (!servicesResponse.ok) {
            throw new Error('Failed to save services data');
        }

        // Сохраняем данные цен
        const pricesResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: 'prices.json',
                data: currentData.prices
            })
        });

        if (!pricesResponse.ok) {
            throw new Error('Failed to save prices data');
        }

        // Сохраняем данные отзывов
        const reviewsResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: 'reviews.json',
                data: currentData.reviews
            })
        });

        if (!reviewsResponse.ok) {
            throw new Error('Failed to save reviews data');
        }

        showNotification('Все данные успешно сохранены', 'success');
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
        showNotification('Ошибка сохранения данных: ' + error.message, 'error');
    }
}

// Скачивание JSON файла
function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Утилиты
function getCategoryName(category) {
    const categories = {
        'consultation': 'Консультация',
        'diagnostics': 'Диагностика',
        'specialist': 'Специалист'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}