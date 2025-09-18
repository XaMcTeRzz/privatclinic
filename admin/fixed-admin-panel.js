// Исправленная админ-панель для управления всем контентом сайта

// Глобальные переменные для хранения данных
let slidesData = [];
let servicesData = [];
let doctorsData = [];
let newsData = [];
let reviewsData = [];
let pricesData = [];
let settingsData = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (!localStorage.getItem('adminAuthenticated')) {
        window.location.href = 'login.html';
    }
    
    // Загрузка начальных данных
    loadDashboardData();
});

// Проверка авторизации
function checkAuth() {
    if (!localStorage.getItem('adminAuthenticated')) {
        window.location.href = 'login.html';
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('adminAuthenticated');
    window.location.href = 'login.html';
}

// Навигация по разделам
function switchSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    document.getElementById(sectionId + '-section').classList.add('active');
    
    // Загружаем данные для выбранной секции
    loadSectionData(sectionId);
}

// Загрузка данных для конкретного раздела
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'slider':
            loadSlidesData();
            break;
        case 'services':
            loadServicesData();
            break;
        case 'doctors':
            loadDoctorsData();
            break;
        case 'news':
            loadNewsData();
            break;
        case 'reviews':
            loadReviewsData();
            break;
        case 'prices':
            loadPricesData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// ==================== ДАШБОРД ====================
function loadDashboardData() {
    // Загрузка статистики
    loadJSONData('../data/services.json')
        .then(data => {
            document.getElementById('servicesCount').textContent = data.length;
        })
        .catch(() => {
            document.getElementById('servicesCount').textContent = 0;
        });

    loadJSONData('../data/doctors.json')
        .then(data => {
            document.getElementById('doctorsCount').textContent = data.length;
        })
        .catch(() => {
            document.getElementById('doctorsCount').textContent = 0;
        });

    loadJSONData('../data/slides.json')
        .then(data => {
            document.getElementById('slidesCount').textContent = data.length;
        })
        .catch(() => {
            document.getElementById('slidesCount').textContent = 0;
        });

    loadJSONData('../data/news.json')
        .then(data => {
            document.getElementById('newsCount').textContent = data.length;
        })
        .catch(() => {
            document.getElementById('newsCount').textContent = 0;
        });
}

// ==================== СЛАЙДЕР ====================
function loadSlidesData() {
    loadJSONData('../data/slides.json')
        .then(data => {
            slidesData = data;
            renderSlides();
        })
        .catch(error => {
            console.error('Ошибка загрузки слайдов:', error);
            slidesData = createDefaultSlidesData();
            renderSlides();
        });
}

function createDefaultSlidesData() {
    return [
        {
            id: 1,
            title: "Сучасна медична допомога",
            subtitle: "Професійні лікарі та новітнє обладнання",
            description: "Наша клініка пропонує широкий спектр медичних послуг з використанням сучасних технологій",
            background_image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            button_text: "Записатися на прийом",
            button_link: "/contact"
        }
    ];
}

function renderSlides() {
    const container = document.getElementById('slidesContainer');
    container.innerHTML = '';

    slidesData.forEach((slide, index) => {
        const slideCard = createSlideCard(slide, index);
        container.appendChild(slideCard);
    });
}

function createSlideCard(slide, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3>Слайд ${index + 1}</h3>
        </div>
        
        <div class="form-group">
            <label>Текущее изображение:</label>
            <img src="${slide.background_image}" alt="Текущее изображение" class="current-image" id="slideCurrentImage_${index}">
        </div>

        <div class="form-group">
            <label>Загрузить новое изображение:</label>
            <div class="image-upload" onclick="selectSlideImage(${index})">
                <input type="file" id="slideImageInput_${index}" accept="image/*" style="display: none;" onchange="handleSlideImageUpload(${index}, this)">
                <p>📸 Нажмите для выбора изображения</p>
                <p style="font-size: 12px; color: #7f8c8d;">Поддерживаются: JPG, PNG, GIF</p>
                <img id="slidePreview_${index}" class="image-preview" style="display: none;">
            </div>
        </div>

        <div class="form-group">
            <label>Заголовок:</label>
            <input type="text" id="slideTitle_${index}" value="${slide.title || ''}" placeholder="Заголовок слайда">
        </div>

        <div class="form-group">
            <label>Подзаголовок:</label>
            <input type="text" id="slideSubtitle_${index}" value="${slide.subtitle || ''}" placeholder="Подзаголовок слайда">
        </div>

        <div class="form-group">
            <label>Описание:</label>
            <textarea id="slideDescription_${index}" rows="3" placeholder="Описание слайда">${slide.description || ''}</textarea>
        </div>

        <div class="form-group">
            <label>Текст кнопки:</label>
            <input type="text" id="slideButtonText_${index}" value="${slide.button_text || ''}" placeholder="Текст кнопки">
        </div>

        <div class="form-group">
            <label>Ссылка кнопки:</label>
            <input type="text" id="slideButtonLink_${index}" value="${slide.button_link || ''}" placeholder="Ссылка кнопки">
        </div>

        <div class="action-buttons">
            <button class="btn btn-success" onclick="saveSlide(${index})">
                💾 Сохранить
            </button>
            <button class="btn btn-danger" onclick="deleteSlide(${index})">
                🗑️ Удалить
            </button>
        </div>
    `;
    return card;
}

function selectSlideImage(index) {
    document.getElementById(`slideImageInput_${index}`).click();
}

function handleSlideImageUpload(index, input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(`slidePreview_${index}`);
            const uploadDiv = input.parentElement;
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadDiv.classList.add('has-image');
            
            // Обновляем данные слайда
            slidesData[index].background_image = e.target.result;
            
            // Обновляем текущее изображение
            document.getElementById(`slideCurrentImage_${index}`).src = e.target.result;
            
            // Автоматически сохраняем изменения
            saveSlidesData();
        };
        reader.readAsDataURL(file);
    }
}

function saveSlide(index) {
    const title = document.getElementById(`slideTitle_${index}`).value;
    const subtitle = document.getElementById(`slideSubtitle_${index}`).value;
    const description = document.getElementById(`slideDescription_${index}`).value;
    const buttonText = document.getElementById(`slideButtonText_${index}`).value;
    const buttonLink = document.getElementById(`slideButtonLink_${index}`).value;

    // Обновляем данные
    slidesData[index] = {
        ...slidesData[index],
        title: title,
        subtitle: subtitle,
        description: description,
        button_text: buttonText,
        button_link: buttonLink
    };

    // Сохраняем все слайды
    saveSlidesData();
}

function deleteSlide(index) {
    if (confirm('Вы уверены, что хотите удалить этот слайд?')) {
        slidesData.splice(index, 1);
        saveSlidesData();
        renderSlides();
    }
}

function addNewSlide() {
    const newSlide = {
        id: Date.now(),
        title: "Новий слайд",
        subtitle: "Підзаголовок",
        description: "Опис нового слайду",
        background_image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        button_text: "Детальніше",
        button_link: "/about"
    };
    
    slidesData.push(newSlide);
    saveSlidesData();
    renderSlides();
}

function saveSlidesData() {
    saveJSONData('../data/slides.json', slidesData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения слайдов:', error);
            alert('Ошибка сохранения данных слайдов');
        });
}

// ==================== УСЛУГИ ====================
function loadServicesData() {
    loadJSONData('../data/services.json')
        .then(data => {
            servicesData = data;
            renderServices();
        })
        .catch(error => {
            console.error('Ошибка загрузки услуг:', error);
            servicesData = createDefaultServicesData();
            renderServices();
        });
}

function createDefaultServicesData() {
    return [
        {
            id: 1,
            name: "Терапія",
            description: "Загальна терапевтична допомога та консультації",
            price: "500",
            category: "consultation",
            duration: "30 хв"
        }
    ];
}

function renderServices() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';

    servicesData.forEach((service, index) => {
        const serviceCard = createServiceCard(service, index);
        container.appendChild(serviceCard);
    });
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3>Услуга ${index + 1}</h3>
        </div>
        
        <div class="form-group">
            <label>Название:</label>
            <input type="text" id="serviceName_${index}" value="${service.name || ''}" placeholder="Название услуги">
        </div>

        <div class="form-group">
            <label>Описание:</label>
            <textarea id="serviceDescription_${index}" rows="3" placeholder="Описание услуги">${service.description || ''}</textarea>
        </div>

        <div class="form-group">
            <label>Цена:</label>
            <input type="text" id="servicePrice_${index}" value="${service.price || ''}" placeholder="Цена услуги">
        </div>

        <div class="form-group">
            <label>Категория:</label>
            <input type="text" id="serviceCategory_${index}" value="${service.category || ''}" placeholder="Категория услуги">
        </div>

        <div class="form-group">
            <label>Длительность:</label>
            <input type="text" id="serviceDuration_${index}" value="${service.duration || ''}" placeholder="Длительность услуги">
        </div>

        <div class="action-buttons">
            <button class="btn btn-success" onclick="saveService(${index})">
                💾 Сохранить
            </button>
            <button class="btn btn-danger" onclick="deleteService(${index})">
                🗑️ Удалить
            </button>
        </div>
    `;
    return card;
}

function saveService(index) {
    const name = document.getElementById(`serviceName_${index}`).value;
    const description = document.getElementById(`serviceDescription_${index}`).value;
    const price = document.getElementById(`servicePrice_${index}`).value;
    const category = document.getElementById(`serviceCategory_${index}`).value;
    const duration = document.getElementById(`serviceDuration_${index}`).value;

    // Обновляем данные
    servicesData[index] = {
        ...servicesData[index],
        name: name,
        description: description,
        price: price,
        category: category,
        duration: duration
    };

    // Сохраняем все услуги
    saveServicesData();
}

function deleteService(index) {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
        servicesData.splice(index, 1);
        saveServicesData();
        renderServices();
    }
}

function addNewService() {
    const newService = {
        id: Date.now(),
        name: "Нова послуга",
        description: "Опис нової послуги",
        price: "Ціна",
        category: "other",
        duration: "30 хв"
    };
    
    servicesData.push(newService);
    saveServicesData();
    renderServices();
}

function saveServicesData() {
    saveJSONData('../data/services.json', servicesData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения услуг:', error);
            alert('Ошибка сохранения данных услуг');
        });
}

// ==================== ВРАЧИ ====================
function loadDoctorsData() {
    loadJSONData('../data/doctors.json')
        .then(data => {
            doctorsData = data;
            renderDoctors();
        })
        .catch(error => {
            console.error('Ошибка загрузки врачей:', error);
            doctorsData = createDefaultDoctorsData();
            renderDoctors();
        });
}

function createDefaultDoctorsData() {
    return [
        {
            id: 1,
            name: "Петров Іван Іванович",
            specialty: "Терапевт",
            experience: 15,
            photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Опытный терапевт с 15-летним стажем"
        }
    ];
}

function renderDoctors() {
    const container = document.getElementById('doctorsContainer');
    container.innerHTML = '';

    doctorsData.forEach((doctor, index) => {
        const doctorCard = createDoctorCard(doctor, index);
        container.appendChild(doctorCard);
    });
}

function createDoctorCard(doctor, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3>Врач ${index + 1}</h3>
        </div>
        
        <div class="form-group">
            <label>Текущее фото:</label>
            <img src="${doctor.photo}" alt="Текущее фото" class="current-image" id="doctorCurrentImage_${index}">
        </div>

        <div class="form-group">
            <label>Загрузить новое фото:</label>
            <div class="image-upload" onclick="selectDoctorImage(${index})">
                <input type="file" id="doctorImageInput_${index}" accept="image/*" style="display: none;" onchange="handleDoctorImageUpload(${index}, this)">
                <p>📸 Нажмите для выбора фото</p>
                <p style="font-size: 12px; color: #7f8c8d;">Поддерживаются: JPG, PNG, GIF</p>
                <img id="doctorPreview_${index}" class="image-preview" style="display: none;">
            </div>
        </div>

        <div class="form-group">
            <label>ФИО:</label>
            <input type="text" id="doctorName_${index}" value="${doctor.name || ''}" placeholder="Фамилия Имя Отчество">
        </div>

        <div class="form-group">
            <label>Специальность:</label>
            <input type="text" id="doctorSpecialty_${index}" value="${doctor.specialty || ''}" placeholder="Специальность врача">
        </div>

        <div class="form-group">
            <label>Опыт работы:</label>
            <input type="text" id="doctorExperience_${index}" value="${doctor.experience || ''}" placeholder="Опыт работы">
        </div>

        <div class="form-group">
            <label>Описание:</label>
            <textarea id="doctorDescription_${index}" rows="3" placeholder="Описание врача">${doctor.description || ''}</textarea>
        </div>

        <div class="action-buttons">
            <button class="btn btn-success" onclick="saveDoctor(${index})">
                💾 Сохранить
            </button>
            <button class="btn btn-danger" onclick="deleteDoctor(${index})">
                🗑️ Удалить
            </button>
        </div>
    `;
    return card;
}

function selectDoctorImage(index) {
    document.getElementById(`doctorImageInput_${index}`).click();
}

function handleDoctorImageUpload(index, input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(`doctorPreview_${index}`);
            const uploadDiv = input.parentElement;
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadDiv.classList.add('has-image');
            
            // Обновляем данные врача
            doctorsData[index].photo = e.target.result;
            
            // Обновляем текущее фото
            document.getElementById(`doctorCurrentImage_${index}`).src = e.target.result;
            
            // Автоматически сохраняем изменения
            saveDoctorsData();
        };
        reader.readAsDataURL(file);
    }
}

function saveDoctor(index) {
    const name = document.getElementById(`doctorName_${index}`).value;
    const specialty = document.getElementById(`doctorSpecialty_${index}`).value;
    const experience = document.getElementById(`doctorExperience_${index}`).value;
    const description = document.getElementById(`doctorDescription_${index}`).value;

    // Обновляем данные
    doctorsData[index] = {
        ...doctorsData[index],
        name: name,
        specialty: specialty,
        experience: experience,
        description: description
    };

    // Сохраняем всех врачей
    saveDoctorsData();
}

function deleteDoctor(index) {
    if (confirm('Вы уверены, что хотите удалить этого врача?')) {
        doctorsData.splice(index, 1);
        saveDoctorsData();
        renderDoctors();
    }
}

function addNewDoctor() {
    const newDoctor = {
        id: Date.now(),
        name: "Новий лікар",
        specialty: "Спеціальність",
        experience: "Досвід",
        description: "Опис лікаря",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    };
    
    doctorsData.push(newDoctor);
    saveDoctorsData();
    renderDoctors();
}

function saveDoctorsData() {
    saveJSONData('../data/doctors.json', doctorsData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения врачей:', error);
            alert('Ошибка сохранения данных врачей');
        });
}

// ==================== НОВОСТИ ====================
function loadNewsData() {
    loadJSONData('../data/news.json')
        .then(data => {
            newsData = data;
            renderNews();
        })
        .catch(error => {
            console.error('Ошибка загрузки новостей:', error);
            newsData = createDefaultNewsData();
            renderNews();
        });
}

function createDefaultNewsData() {
    return [
        {
            id: 1,
            title: "Відкрився новий відділ",
            description: "Сучасне обладнання та фахівці",
            badge: "🆕 Новина",
            date: "15 вересня 2024",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
}

function renderNews() {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';

    newsData.forEach((news, index) => {
        const newsCard = createNewsCard(news, index);
        container.appendChild(newsCard);
    });
}

function createNewsCard(news, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3>Новость ${index + 1}</h3>
        </div>
        
        <div class="form-group">
            <label>Текущее изображение:</label>
            <img src="${news.image}" alt="Текущее изображение" class="current-image" id="newsCurrentImage_${index}">
        </div>

        <div class="form-group">
            <label>Загрузить новое изображение:</label>
            <div class="image-upload" onclick="selectNewsImage(${index})">
                <input type="file" id="newsImageInput_${index}" accept="image/*" style="display: none;" onchange="handleNewsImageUpload(${index}, this)">
                <p>📸 Нажмите для выбора изображения</p>
                <p style="font-size: 12px; color: #7f8c8d;">Поддерживаются: JPG, PNG, GIF</p>
                <img id="newsPreview_${index}" class="image-preview" style="display: none;">
            </div>
        </div>

        <div class="form-group">
            <label>Бейдж:</label>
            <input type="text" id="newsBadge_${index}" value="${news.badge || ''}" placeholder="🆕 Новость">
        </div>

        <div class="form-group">
            <label>Заголовок:</label>
            <input type="text" id="newsTitle_${index}" value="${news.title || ''}" placeholder="Заголовок новости">
        </div>

        <div class="form-group">
            <label>Описание:</label>
            <textarea id="newsDescription_${index}" rows="3" placeholder="Описание новости">${news.description || ''}</textarea>
        </div>

        <div class="form-group">
            <label>Дата:</label>
            <input type="text" id="newsDate_${index}" value="${news.date || ''}" placeholder="15 сентября 2024">
        </div>

        <div class="action-buttons">
            <button class="btn btn-success" onclick="saveNewsItem(${index})">
                💾 Сохранить
            </button>
            <button class="btn btn-danger" onclick="deleteNewsItem(${index})">
                🗑️ Удалить
            </button>
        </div>
    `;
    return card;
}

function selectNewsImage(index) {
    document.getElementById(`newsImageInput_${index}`).click();
}

function handleNewsImageUpload(index, input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(`newsPreview_${index}`);
            const uploadDiv = input.parentElement;
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadDiv.classList.add('has-image');
            
            // Обновляем данные новости
            newsData[index].image = e.target.result;
            
            // Обновляем текущее изображение
            document.getElementById(`newsCurrentImage_${index}`).src = e.target.result;
            
            // Автоматически сохраняем изменения
            saveNewsData();
        };
        reader.readAsDataURL(file);
    }
}

function saveNewsItem(index) {
    const badge = document.getElementById(`newsBadge_${index}`).value;
    const title = document.getElementById(`newsTitle_${index}`).value;
    const description = document.getElementById(`newsDescription_${index}`).value;
    const date = document.getElementById(`newsDate_${index}`).value;

    // Обновляем данные
    newsData[index] = {
        ...newsData[index],
        badge: badge,
        title: title,
        description: description,
        date: date
    };

    // Сохраняем все новости
    saveNewsData();
}

function deleteNewsItem(index) {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
        newsData.splice(index, 1);
        saveNewsData();
        renderNews();
    }
}

function addNewNews() {
    const newNews = {
        id: Date.now(),
        title: "Нова новина",
        description: "Опис новини",
        badge: "🆕 Новина",
        date: new Date().toLocaleDateString('ru-RU'),
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    };
    
    newsData.push(newNews);
    saveNewsData();
    renderNews();
}

function saveNewsData() {
    saveJSONData('../data/news.json', newsData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения новостей:', error);
            alert('Ошибка сохранения данных новостей');
        });
}

// ==================== ОТЗЫВЫ ====================
function loadReviewsData() {
    loadJSONData('../data/reviews.json')
        .then(data => {
            reviewsData = data;
            renderReviews();
        })
        .catch(error => {
            console.error('Ошибка загрузки отзывов:', error);
            reviewsData = createDefaultReviewsData();
            renderReviews();
        });
}

function createDefaultReviewsData() {
    return [
        {
            id: 1,
            author: "Анна Петрова",
            text: "Відмінна клініка! Лікарі професійні, персонал увічливий.",
            rating: 5,
            date: "10 вересня 2024"
        }
    ];
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '';

    reviewsData.forEach((review, index) => {
        const reviewCard = createReviewCard(review, index);
        container.appendChild(reviewCard);
    });
}

function createReviewCard(review, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3>Отзыв ${index + 1}</h3>
        </div>
        
        <div class="form-group">
            <label>Автор:</label>
            <input type="text" id="reviewAuthor_${index}" value="${review.author || ''}" placeholder="Имя автора">
        </div>

        <div class="form-group">
            <label>Текст отзыва:</label>
            <textarea id="reviewText_${index}" rows="4" placeholder="Текст отзыва">${review.text || ''}</textarea>
        </div>

        <div class="form-group">
            <label>Рейтинг (1-5):</label>
            <input type="number" id="reviewRating_${index}" value="${review.rating || ''}" min="1" max="5" placeholder="5">
        </div>

        <div class="form-group">
            <label>Дата:</label>
            <input type="text" id="reviewDate_${index}" value="${review.date || ''}" placeholder="10 сентября 2024">
        </div>

        <div class="action-buttons">
            <button class="btn btn-success" onclick="saveReview(${index})">
                💾 Сохранить
            </button>
            <button class="btn btn-danger" onclick="deleteReview(${index})">
                🗑️ Удалить
            </button>
        </div>
    `;
    return card;
}

function saveReview(index) {
    const author = document.getElementById(`reviewAuthor_${index}`).value;
    const text = document.getElementById(`reviewText_${index}`).value;
    const rating = document.getElementById(`reviewRating_${index}`).value;
    const date = document.getElementById(`reviewDate_${index}`).value;

    // Обновляем данные
    reviewsData[index] = {
        ...reviewsData[index],
        author: author,
        text: text,
        rating: parseInt(rating),
        date: date
    };

    // Сохраняем все отзывы
    saveReviewsData();
}

function deleteReview(index) {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        reviewsData.splice(index, 1);
        saveReviewsData();
        renderReviews();
    }
}

function addNewReview() {
    const newReview = {
        id: Date.now(),
        author: "Новий автор",
        text: "Текст відгуку",
        rating: 5,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    reviewsData.push(newReview);
    saveReviewsData();
    renderReviews();
}

function saveReviewsData() {
    saveJSONData('../data/reviews.json', reviewsData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения отзывов:', error);
            alert('Ошибка сохранения данных отзывов');
        });
}

// ==================== ЦЕНЫ ====================
function loadPricesData() {
    loadJSONData('../data/prices.json')
        .then(data => {
            pricesData = data;
            renderPrices();
        })
        .catch(error => {
            console.error('Ошибка загрузки цен:', error);
            pricesData = createDefaultPricesData();
            renderPrices();
        });
}

function createDefaultPricesData() {
    return [
        {
            id: 1,
            service: "Консультація лікаря",
            price: "500 грн",
            category: "Консультації"
        }
    ];
}

function renderPrices() {
    const container = document.getElementById('pricesContainer');
    container.innerHTML = '';

    pricesData.forEach((price, index) => {
        const priceCard = createPriceCard(price, index);
        container.appendChild(priceCard);
    });
}

function createPriceCard(price, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3>Позиция ${index + 1}</h3>
        </div>
        
        <div class="form-group">
            <label>Название услуги:</label>
            <input type="text" id="priceService_${index}" value="${price.service || ''}" placeholder="Название услуги">
        </div>

        <div class="form-group">
            <label>Цена:</label>
            <input type="text" id="priceValue_${index}" value="${price.price || ''}" placeholder="Цена">
        </div>

        <div class="form-group">
            <label>Категория:</label>
            <input type="text" id="priceCategory_${index}" value="${price.category || ''}" placeholder="Категория">
        </div>

        <div class="action-buttons">
            <button class="btn btn-success" onclick="savePrice(${index})">
                💾 Сохранить
            </button>
            <button class="btn btn-danger" onclick="deletePrice(${index})">
                🗑️ Удалить
            </button>
        </div>
    `;
    return card;
}

function savePrice(index) {
    const service = document.getElementById(`priceService_${index}`).value;
    const price = document.getElementById(`priceValue_${index}`).value;
    const category = document.getElementById(`priceCategory_${index}`).value;

    // Обновляем данные
    pricesData[index] = {
        ...pricesData[index],
        service: service,
        price: price,
        category: category
    };

    // Сохраняем все цены
    savePricesData();
}

function deletePrice(index) {
    if (confirm('Вы уверены, что хотите удалить эту позицию?')) {
        pricesData.splice(index, 1);
        savePricesData();
        renderPrices();
    }
}

function addNewPrice() {
    const newPrice = {
        id: Date.now(),
        service: "Нова послуга",
        price: "Ціна",
        category: "Категорія"
    };
    
    pricesData.push(newPrice);
    savePricesData();
    renderPrices();
}

function savePricesData() {
    saveJSONData('../data/prices.json', pricesData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения цен:', error);
            alert('Ошибка сохранения данных цен');
        });
}

// ==================== НАСТРОЙКИ ====================
function loadSettingsData() {
    loadJSONData('../data/settings.json')
        .then(data => {
            settingsData = data;
            renderSettings();
        })
        .catch(error => {
            console.error('Ошибка загрузки настроек:', error);
            settingsData = createDefaultSettingsData();
            renderSettings();
        });
}

function createDefaultSettingsData() {
    return {
        siteName: "Медична клініка",
        phone: "+38 (000) 000-00-00",
        email: "info@clinic.com",
        address: "м. Київ, вул. Медична, 1",
        workingHours: "Пн-Пт: 8:00-20:00, Сб-Нд: 9:00-18:00"
    };
}

function renderSettings() {
    const container = document.getElementById('settingsContainer');
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Основные настройки сайта</h3>
            </div>
            
            <div class="form-group">
                <label>Название сайта:</label>
                <input type="text" id="siteName" value="${settingsData.siteName || ''}" placeholder="Название сайта">
            </div>

            <div class="form-group">
                <label>Телефон:</label>
                <input type="text" id="phone" value="${settingsData.phone || ''}" placeholder="Телефон">
            </div>

            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="email" value="${settingsData.email || ''}" placeholder="Email">
            </div>

            <div class="form-group">
                <label>Адрес:</label>
                <input type="text" id="address" value="${settingsData.address || ''}" placeholder="Адрес">
            </div>

            <div class="form-group">
                <label>Часы работы:</label>
                <input type="text" id="workingHours" value="${settingsData.workingHours || ''}" placeholder="Часы работы">
            </div>

            <div class="form-group">
                <label>Facebook:</label>
                <input type="text" id="facebook" value="${settingsData.facebook || ''}" placeholder="Ссылка на Facebook">
            </div>

            <div class="form-group">
                <label>Instagram:</label>
                <input type="text" id="instagram" value="${settingsData.instagram || ''}" placeholder="Ссылка на Instagram">
            </div>

            <div class="form-group">
                <label>Telegram:</label>
                <input type="text" id="telegram" value="${settingsData.telegram || ''}" placeholder="Ссылка на Telegram">
            </div>

            <button class="btn btn-success" onclick="saveSettings()">
                💾 Сохранить настройки
            </button>
        </div>
    `;
}

function saveSettings() {
    settingsData = {
        siteName: document.getElementById('siteName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        workingHours: document.getElementById('workingHours').value,
        facebook: document.getElementById('facebook').value,
        instagram: document.getElementById('instagram').value,
        telegram: document.getElementById('telegram').value
    };

    saveJSONData('../data/settings.json', settingsData)
        .then(() => {
            showSuccessMessage();
        })
        .catch(error => {
            console.error('Ошибка сохранения настроек:', error);
            alert('Ошибка сохранения настроек');
        });
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
// Функция для загрузки JSON данных
function loadJSONData(url) {
    // Извлекаем имя файла из URL
    const filename = url.split('/').pop();
    
    // Для Netlify используем API endpoint
    return fetch(`/api/load-data?filename=${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Network error when loading data:', error);
            throw error;
        });
}

// Функция для сохранения JSON данных
function saveJSONData(url, data) {
    // Извлекаем имя файла из URL
    const filename = url.split('/').pop();
    
    // Для Netlify отправляем данные через API
    return fetch('/api/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filename: filename,
            data: data
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Network error when saving data:', error);
        throw error;
    });
}

// Показать сообщение об успехе
function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    if (message) {
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }
}

// Конвертация изображения в base64 для хранения
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}