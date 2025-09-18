// JavaScript для страницы врачей
document.addEventListener('DOMContentLoaded', function() {
    initializeDoctorsPage();
    // Подключаем слайдер новостей из main.js
    if (typeof initializeNewsSlider === 'function') {
        initializeNewsSlider();
    }
});

let allDoctors = [];

async function initializeDoctorsPage() {
    await loadDoctors();
    initializeFilters();
    initializeModal();
}

// Загрузка данных врачей
async function loadDoctors() {
    try {
        const response = await fetch('/api/load-data?filename=doctors.json');
        allDoctors = await response.json();
        renderDoctors(allDoctors);
    } catch (error) {
        console.error('Ошибка загрузки врачей:', error);
        loadFallbackDoctors();
    }
}

// Отображение врачей
function renderDoctors(doctors) {
    const container = document.getElementById('doctorsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;

    if (doctors.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noResults.style.display = 'none';

    container.innerHTML = doctors.map(doctor => `
        <div class="doctor-card" data-specialty="${doctor.specialty}" data-experience="${doctor.experience}">
            <div class="doctor-photo" style="background-image: url('${doctor.photo || 'images/doctor-placeholder.jpg'}')"></div>
            <div class="doctor-info">
                <div class="doctor-name">${doctor.name}</div>
                <div class="doctor-specialty">${doctor.specialty}</div>
                <div class="doctor-experience">Опыт: ${doctor.experience} лет</div>
                <div class="doctor-description">${doctor.description}</div>
                
                <div class="doctor-rating">
                    <div class="stars">${generateStars(doctor.rating)}</div>
                    <div class="rating-text">${doctor.rating} (${doctor.reviews_count} отзывов)</div>
                </div>
                
                <div class="doctor-schedule">
                    <h5>Расписание на сегодня:</h5>
                    ${generateTodaySchedule(doctor.schedule)}
                </div>
                
                <div class="doctor-actions">
                    <button class="btn btn-primary btn-appointment" onclick="openAppointmentModal(${doctor.id})">
                        Записаться
                    </button>
                    <a href="#" class="btn-details" onclick="showDoctorDetails(${doctor.id})">
                        Подробнее
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Генерация звезд рейтинга
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Генерация расписания на сегодня
function generateTodaySchedule(schedule) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const todaySchedule = schedule[today];
    
    return `
        <div class="schedule-item">
            <span class="schedule-day">Сегодня:</span>
            <span class="schedule-time">${todaySchedule || 'Выходной'}</span>
        </div>
    `;
}

// Инициализация фильтров
function initializeFilters() {
    const specialtyFilter = document.getElementById('specialtyFilter');
    const nameSearch = document.getElementById('nameSearch');
    const experienceFilter = document.getElementById('experienceFilter');
    const resetButton = document.getElementById('resetFilters');

    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', applyFilters);
    }
    
    if (nameSearch) {
        nameSearch.addEventListener('input', debounce(applyFilters, 300));
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', applyFilters);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Применение фильтров
function applyFilters() {
    const specialty = document.getElementById('specialtyFilter').value;
    const nameQuery = document.getElementById('nameSearch').value.toLowerCase();
    const experience = document.getElementById('experienceFilter').value;

    let filteredDoctors = allDoctors.filter(doctor => {
        const matchesSpecialty = !specialty || doctor.specialty === specialty;
        const matchesName = !nameQuery || doctor.name.toLowerCase().includes(nameQuery);
        const matchesExperience = !experience || checkExperienceRange(doctor.experience, experience);
        
        return matchesSpecialty && matchesName && matchesExperience;
    });

    renderDoctors(filteredDoctors);
}

// Проверка диапазона опыта
function checkExperienceRange(experience, range) {
    switch (range) {
        case '5-10':
            return experience >= 5 && experience <= 10;
        case '10-15':
            return experience >= 10 && experience <= 15;
        case '15+':
            return experience > 15;
        default:
            return true;
    }
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('specialtyFilter').value = '';
    document.getElementById('nameSearch').value = '';
    document.getElementById('experienceFilter').value = '';
    renderDoctors(allDoctors);
}

// Debounce функция для поиска
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
    const modal = document.getElementById('appointmentModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('appointmentForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeAppointmentModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAppointmentModal();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', handleAppointmentSubmit);
    }

    // Устанавливаем минимальную дату - сегодня
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Открытие модального окна записи
function openAppointmentModal(doctorId) {
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const modal = document.getElementById('appointmentModal');
    const selectedDoctorDiv = document.getElementById('selectedDoctor');

    selectedDoctorDiv.innerHTML = `
        <div class="selected-doctor-info">
            <div class="selected-doctor-photo" style="background-image: url('${doctor.photo || 'images/doctor-placeholder.jpg'}')"></div>
            <div class="selected-doctor-details">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty}</p>
            </div>
        </div>
    `;

    // Сохраняем ID врача в форме
    const form = document.getElementById('appointmentForm');
    form.dataset.doctorId = doctorId;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    const form = document.getElementById('appointmentForm');
    form.reset();
}

// Обработка отправки формы записи
function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const doctorId = e.target.dataset.doctorId;
    const doctor = allDoctors.find(d => d.id == doctorId);
    
    const appointmentData = {
        doctor: doctor.name,
        specialty: doctor.specialty,
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        comment: formData.get('comment')
    };

    // Здесь можно добавить отправку данных на сервер
    console.log('Данные записи:', appointmentData);
    
    // Показываем сообщение об успехе
    showNotification(`Вы успешно записались к врачу ${doctor.name} на ${appointmentData.date} в ${appointmentData.time}`, 'success');
    
    closeAppointmentModal();
}

// Показ подробной информации о враче
function showDoctorDetails(doctorId) {
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const detailsHtml = `
        <div class="doctor-details-modal">
            <h3>${doctor.name}</h3>
            <p><strong>Специальность:</strong> ${doctor.specialty}</p>
            <p><strong>Опыт:</strong> ${doctor.experience} лет</p>
            <p><strong>Образование:</strong> ${doctor.education}</p>
            <p><strong>Описание:</strong> ${doctor.description}</p>
            <div class="qualifications">
                <strong>Квалификация:</strong>
                <ul>
                    ${doctor.qualifications.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
            <div class="full-schedule">
                <strong>Полное расписание:</strong>
                <div class="schedule-grid">
                    ${Object.entries(doctor.schedule).map(([day, time]) => `
                        <div class="schedule-row">
                            <span>${getDayName(day)}:</span>
                            <span>${time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Создаем модальное окно для деталей
    const detailsModal = document.createElement('div');
    detailsModal.className = 'modal';
    detailsModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${detailsHtml}
            <button class="btn btn-primary" onclick="openAppointmentModal(${doctorId})">Записаться к врачу</button>
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

// Получение названия дня недели
function getDayName(day) {
    const days = {
        'monday': 'Понедельник',
        'tuesday': 'Вторник',
        'wednesday': 'Среда',
        'thursday': 'Четверг',
        'friday': 'Пятница',
        'saturday': 'Суббота',
        'sunday': 'Воскресенье'
    };
    return days[day] || day;
}

// Загрузка запасных данных
function loadFallbackDoctors() {
    allDoctors = [
        {
            id: 1,
            name: "Петров Иван Иванович",
            specialty: "Терапевт",
            experience: 15,
            photo: "images/doctor-placeholder.jpg",
            education: "Киевский национальный медицинский университет",
            description: "Опытный терапевт с 15-летним стажем.",
            qualifications: ["Врач высшей категории"],
            schedule: {
                monday: "9:00-17:00",
                tuesday: "9:00-17:00",
                wednesday: "9:00-17:00",
                thursday: "9:00-17:00",
                friday: "9:00-15:00",
                saturday: "выходной",
                sunday: "выходной"
            },
            rating: 4.8,
            reviews_count: 156,
            available: true
        }
    ];
    renderDoctors(allDoctors);
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