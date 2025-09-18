// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен');
    initializeWebsite();
    initializeNewsSlider();
    console.log('Слайдер новостей инициализирован');
});

// Инициализация сайта
function initializeWebsite() {
    loadContent();
    initializeSlider();
    initializeForms();
    initializeMobileMenu();
    initializeScrollEffects();
}

// Загрузка контента из JSON файлов
async function loadContent() {
    try {
        // Загружаем услуги
        const servicesResponse = await fetch('data/services.json');
        const services = await servicesResponse.json();
        renderServices(services.slice(0, 6)); // Показываем только первые 6

        // Загружаем врачей
        const doctorsResponse = await fetch('data/doctors.json');
        const doctors = await doctorsResponse.json();
        renderDoctors(doctors.slice(0, 4)); // Показываем только первых 4

        // Загружаем отзывы
        const reviewsResponse = await fetch('data/reviews.json');
        const reviews = await reviewsResponse.json();
        renderReviews(reviews);

        // Загружаем новости для слайдера
        await loadNewsContent();

        // Загружаем новости для слайдера
        await loadNewsContent();

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        loadFallbackContent();
    }
}

// Отображение услуг
function renderServices(services) {
    const container = document.getElementById('servicesGrid');
    if (!container) return;

    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-price">от ${service.price} грн</div>
            <a href="services.html" class="btn btn-outline">Подробнее</a>
        </div>
    `).join('');
}

// Отображение врачей
function renderDoctors(doctors) {
    const container = document.getElementById('doctorsGrid');
    if (!container) return;

    container.innerHTML = doctors.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-photo" style="background-image: url('${doctor.photo}')"></div>
            <div class="doctor-info">
                <div class="doctor-name">${doctor.name}</div>
                <div class="doctor-specialty">${doctor.specialty}</div>
                <div class="doctor-experience">Опыт: ${doctor.experience} лет</div>
            </div>
        </div>
    `).join('');
}

// Отображение отзывов
function renderReviews(reviews) {
    const container = document.getElementById('reviewsSlider');
    if (!container) return;

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <div class="review-text">"${review.text}"</div>
            <div class="review-author">${review.author}</div>
        </div>
    `).join('');
}

// Инициализация слайдера
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    if (slides.length <= 1) return;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Инициализация форм
function initializeForms() {
    const quickBookingForm = document.getElementById('quickBookingForm');
    
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', handleQuickBooking);
    }
}

// Обработка быстрой записи
function handleQuickBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Здесь можно добавить отправку данных на сервер
    console.log('Данные записи:', data);
    
    // Показываем сообщение об успехе
    showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
    
    // Очищаем форму
    e.target.reset();
}

// Инициализация мобильного меню
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

// Эффекты при скролле
function initializeScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Наблюдаем за секциями
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
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
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Загрузка запасного контента
function loadFallbackContent() {
    // Запасные данные если JSON файлы не загрузились
    const fallbackServices = [
        {
            name: "Терапия",
            description: "Общая терапевтическая помощь",
            icon: "fas fa-stethoscope",
            price: "500"
        },
        {
            name: "Кардиология",
            description: "Диагностика и лечение сердца",
            icon: "fas fa-heartbeat",
            price: "800"
        },
        {
            name: "Неврология",
            description: "Лечение нервной системы",
            icon: "fas fa-brain",
            price: "700"
        },
        {
            name: "Педиатрия",
            description: "Медицинская помощь детям",
            icon: "fas fa-baby",
            price: "600"
        }
    ];

    const fallbackDoctors = [
        {
            name: "Петров Иван Иванович",
            specialty: "Терапевт",
            experience: 15,
            photo: "images/doctor-placeholder.jpg"
        },
        {
            name: "Иванова Мария Сергеевна", 
            specialty: "Кардиолог",
            experience: 12,
            photo: "images/doctor-placeholder.jpg"
        }
    ];

    const fallbackReviews = [
        {
            text: "Отличное обслуживание и профессиональные врачи!",
            author: "Анна К.",
            rating: 5
        },
        {
            text: "Быстро записали на прием, все прошло отлично.",
            author: "Михаил П.",
            rating: 5
        }
    ];

    renderServices(fallbackServices);
    renderDoctors(fallbackDoctors);
    renderReviews(fallbackReviews);
}

// Утилиты
function formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// === СЛАЙДЕР НОВОСТЕЙ ===
let currentNewsSlide = 0;
let newsSlideInterval;
let isNewsSliderPaused = false;
let slidesPerView = 3; // Количество видимых слайдов
let totalSlides = 0;

// Инициализация слайдера новостей
function initializeNewsSlider() {
    console.log('Начало инициализации слайдера новостей');
    const slides = document.querySelectorAll('.news-slide');
    const container = document.getElementById('newsContainer');
    const indicatorsContainer = document.getElementById('newsIndicators');
    const newsSlider = document.querySelector('.news-slider');
    
    console.log('Найдено слайдов:', slides.length);
    totalSlides = slides.length;
    
    // Определяем количество слайдов на основе размера экрана
    slidesPerView = window.innerWidth <= 768 ? 1 : 3;
    
    if (slides.length === 0) {
        console.log('Слайды не найдены!');
        return;
    }
    
    // Создаем индикаторы для групп слайдов
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = ''; // Очищаем предыдущие индикаторы
        const totalGroups = Math.ceil(totalSlides / slidesPerView);
        for (let i = 0; i < totalGroups; i++) {
            const indicator = document.createElement('div');
            indicator.className = `news-indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToNewsSlideGroup(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Обновляем ширину слайдов
    slides.forEach(slide => {
        if (window.innerWidth <= 768) {
            slide.style.minWidth = '100%';
        } else {
            slide.style.minWidth = 'calc(33.333% - 14px)';
        }
    });
    
    // Начинаем автопрокрутку
    startNewsSlider();
    
    // Пауза при наведении
    if (newsSlider) {
        newsSlider.addEventListener('mouseenter', pauseNewsSlider);
        newsSlider.addEventListener('mouseleave', resumeNewsSlider);
        
        // Добавляем обработчик колесика мыши
        newsSlider.addEventListener('wheel', handleMouseWheel, { passive: false });
        
        // Объединенная система драга для тач-устройств и десктопа
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let touchCurrentY = 0;
        let isTouchDragging = false;
        
        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseMoveX = 0;
        let isMouseDragging = false;
        let dragThreshold = 15; // Минимальное расстояние для начала драга
        
        // Touch события для мобильных устройств
        newsSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isTouchDragging = true;
            pauseNewsSlider();
        }, { passive: true });
        
        newsSlider.addEventListener('touchmove', (e) => {
            if (!isTouchDragging) return;
            touchCurrentX = e.touches[0].clientX;
            touchCurrentY = e.touches[0].clientY;
        }, { passive: true });
        
        newsSlider.addEventListener('touchend', (e) => {
            if (!isTouchDragging) return;
            
            const diffX = touchStartX - touchCurrentX;
            const diffY = Math.abs(touchStartY - touchCurrentY);
            
            // Проверяем, что это горизонтальный свайп (а не вертикальный скролл)
            if (Math.abs(diffX) > 50 && diffY < 100) {
                if (diffX > 0) {
                    // Свайп влево - следующий слайд
                    nextNewsSlideGroup();
                } else {
                    // Свайп вправо - предыдущий слайд
                    prevNewsSlideGroup();
                }
                clearInterval(newsSlideInterval);
                startNewsSlider();
            }
            
            isTouchDragging = false;
            resumeNewsSlider();
        }, { passive: true });
        
        // Система драга для десктопа
        newsSlider.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Только левая кнопка мыши
            
            isMouseDown = true;
            mouseStartX = e.clientX;
            mouseMoveX = e.clientX;
            isMouseDragging = false;
            
            newsSlider.style.cursor = 'grabbing';
            newsSlider.style.userSelect = 'none';
            pauseNewsSlider();
            e.preventDefault();
            e.stopPropagation();
        });
        
        newsSlider.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            mouseMoveX = e.clientX;
            const diffX = Math.abs(mouseStartX - mouseMoveX);
            
            // Начинаем драг если мышь сдвинулась достаточно
            if (diffX > dragThreshold) {
                isMouseDragging = true;
                newsSlider.style.cursor = 'grabbing';
            }
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        newsSlider.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            
            const diffX = mouseStartX - mouseMoveX;
            const absDiffX = Math.abs(diffX);
            
            // Если это был драг, обрабатываем переключение слайдов
            if (isMouseDragging && absDiffX > 35) {
                if (diffX > 0) {
                    // Драг влево - следующий слайд
                    nextNewsSlideGroup();
                } else {
                    // Драг вправо - предыдущий слайд
                    prevNewsSlideGroup();
                }
                clearInterval(newsSlideInterval);
                startNewsSlider();
            }
            
            // Сбрасываем состояние
            isMouseDown = false;
            isMouseDragging = false;
            newsSlider.style.cursor = 'grab';
            newsSlider.style.userSelect = '';
            resumeNewsSlider();
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        newsSlider.addEventListener('mouseleave', () => {
            if (isMouseDown) {
                isMouseDown = false;
                isMouseDragging = false;
                newsSlider.style.cursor = 'grab';
                newsSlider.style.userSelect = '';
                resumeNewsSlider();
            }
        });
        
        // Предотвращаем выделение текста при драге
        newsSlider.addEventListener('selectstart', (e) => {
            if (isMouseDragging) {
                e.preventDefault();
            }
        });
        
        newsSlider.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }
    
    console.log('Слайдер новостей успешно инициализирован');
}
    
    // Пауза при наведении
    if (newsSlider) {
        newsSlider.addEventListener('mouseenter', pauseNewsSlider);
        newsSlider.addEventListener('mouseleave', resumeNewsSlider);
        
        // Добавляем обработчик колесика мыши
        newsSlider.addEventListener('wheel', handleMouseWheel, { passive: false });
        
        // Объединенная система драга для тач-устройств и десктопа
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let touchCurrentY = 0;
        let isTouchDragging = false;
        
        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseMoveX = 0;
        let isMouseDragging = false;
        let dragThreshold = 15; // Минимальное расстояние для начала драга
        
        // Touch события для мобильных устройств
        newsSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isTouchDragging = true;
            pauseNewsSlider();
        }, { passive: true });
        
        newsSlider.addEventListener('touchmove', (e) => {
            if (!isTouchDragging) return;
            touchCurrentX = e.touches[0].clientX;
            touchCurrentY = e.touches[0].clientY;
        }, { passive: true });
        
        newsSlider.addEventListener('touchend', (e) => {
            if (!isTouchDragging) return;
            
            const diffX = touchStartX - touchCurrentX;
            const diffY = Math.abs(touchStartY - touchCurrentY);
            
            // Проверяем, что это горизонтальный свайп (а не вертикальный скролл)
            if (Math.abs(diffX) > 50 && diffY < 100) {
                if (diffX > 0) {
                    // Свайп влево - следующий слайд
                    nextNewsSlideGroup();
                } else {
                    // Свайп вправо - предыдущий слайд
                    prevNewsSlideGroup();
                }
                clearInterval(newsSlideInterval);
                startNewsSlider();
            }
            
            isTouchDragging = false;
            resumeNewsSlider();
        }, { passive: true });
        
        // Система драга для десктопа
        newsSlider.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Только левая кнопка мыши
            
            isMouseDown = true;
            mouseStartX = e.clientX;
            mouseMoveX = e.clientX;
            isMouseDragging = false;
            
            newsSlider.style.cursor = 'grabbing';
            newsSlider.style.userSelect = 'none';
            pauseNewsSlider();
            e.preventDefault();
            e.stopPropagation();
        });
        
        newsSlider.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            mouseMoveX = e.clientX;
            const diffX = Math.abs(mouseStartX - mouseMoveX);
            
            // Начинаем драг если мышь сдвинулась достаточно
            if (diffX > dragThreshold) {
                isMouseDragging = true;
                newsSlider.style.cursor = 'grabbing';
            }
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        newsSlider.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            
            const diffX = mouseStartX - mouseMoveX;
            const absDiffX = Math.abs(diffX);
            
            // Если это был драг, обрабатываем переключение слайдов
            if (isMouseDragging && absDiffX > 35) {
                if (diffX > 0) {
                    // Драг влево - следующий слайд
                    nextNewsSlideGroup();
                } else {
                    // Драг вправо - предыдущий слайд
                    prevNewsSlideGroup();
                }
                clearInterval(newsSlideInterval);
                startNewsSlider();
            }
            
            // Сбрасываем состояние
            isMouseDown = false;
            isMouseDragging = false;
            newsSlider.style.cursor = 'grab';
            newsSlider.style.userSelect = '';
            resumeNewsSlider();
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        newsSlider.addEventListener('mouseleave', () => {
            if (isMouseDown) {
                isMouseDown = false;
                isMouseDragging = false;
                newsSlider.style.cursor = 'grab';
                newsSlider.style.userSelect = '';
                resumeNewsSlider();
            }
        });
        
        // Предотвращаем выделение текста при драге
        newsSlider.addEventListener('selectstart', (e) => {
            if (isMouseDragging) {
                e.preventDefault();
            }
        });
        
        newsSlider.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }
    
    console.log('Слайдер новостей успешно инициализирован');
}

// Запуск автопрокрутки
function startNewsSlider() {
    newsSlideInterval = setInterval(() => {
        if (!isNewsSliderPaused) {
            // Автоматическая прокрутка слева направо
            nextNewsSlideGroup();
        }
    }, 8000); // 8 секунд
}

// Пауза слайдера
function pauseNewsSlider() {
    isNewsSliderPaused = true;
}

// Возобновление слайдера
function resumeNewsSlider() {
    isNewsSliderPaused = false;
}

// Обработка колесика мыши
function handleMouseWheel(e) {
    e.preventDefault();
    
    // Проверяем направление прокрутки
    if (e.deltaY > 0) {
        // Прокрутка вниз - следующий слайд
        nextNewsSlideGroup();
    } else {
        // Прокрутка вверх - предыдущий слайд
        prevNewsSlideGroup();
    }
    
    // Перезапускаем таймер
    clearInterval(newsSlideInterval);
    startNewsSlider();
}

// Переход к следующей группе слайдов
function nextNewsSlideGroup() {
    const totalGroups = Math.ceil(totalSlides / slidesPerView);
    const nextGroup = (currentNewsSlide + 1) % totalGroups;
    goToNewsSlideGroup(nextGroup);
}

// Переход к предыдущей группе слайдов
function prevNewsSlideGroup() {
    const totalGroups = Math.ceil(totalSlides / slidesPerView);
    const prevGroup = (currentNewsSlide - 1 + totalGroups) % totalGroups;
    goToNewsSlideGroup(prevGroup);
}

// Переход к конкретной группе слайдов
function goToNewsSlideGroup(groupIndex) {
    const container = document.getElementById('newsContainer');
    const indicators = document.querySelectorAll('.news-indicator');
    
    if (!container) return;
    
    // Обновляем активный индикатор
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === groupIndex) {
            indicator.classList.add('active');
        }
    });
    
    // Обновляем текущую группу
    currentNewsSlide = groupIndex;
    
    // Рассчитываем смещение
    const offset = groupIndex * slidesPerView * (100 / slidesPerView);
    container.style.transform = `translateX(-${offset}%)`;
    
    // Обновляем прогресс-бар
    updateProgressBar(groupIndex);
}

// Управление слайдером с кнопок
function changeNewsSlide(direction) {
    if (direction === 1) {
        // Кнопка "вправо" - следующий слайд
        nextNewsSlide();
    } else if (direction === -1) {
        // Кнопка "влево" - предыдущий слайд
        prevNewsSlide();
    }
    
    // Перезапускаем таймер после ручного переключения
    clearInterval(newsSlideInterval);
    startNewsSlider();
}

// Обновление прогресс-бара
function updateProgressBar(activeIndex) {
    const indicators = document.querySelectorAll('.news-indicator');
    
    indicators.forEach((indicator, index) => {
        // Удаляем старые прогресс-бары
        const oldProgressBar = indicator.querySelector('.progress-bar');
        if (oldProgressBar) {
            oldProgressBar.remove();
        }
        
        // Добавляем новый прогресс-бар для активного
        if (index === activeIndex) {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            indicator.appendChild(progressBar);
        }
    });
}

// Остановка слайдера при уходе со страницы
window.addEventListener('beforeunload', function() {
    clearInterval(newsSlideInterval);
});

// Загрузка новостей для слайдера
async function loadNewsContent() {
    try {
        const newsResponse = await fetch('data/news.json');
        const news = await newsResponse.json();
        const activeNews = news.filter(item => item.active);
        
        if (activeNews.length > 0) {
            updateNewsSlider(activeNews);
        }
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        // Если файл новостей не найден, используем статичные новости
    }
}

// Обновление слайдера новостей с данными из JSON
function updateNewsSlider(newsData) {
    const newsSlider = document.getElementById('newsSlider');
    if (!newsSlider || newsData.length === 0) return;
    
    // Очищаем существующие слайды
    newsSlider.innerHTML = '';
    
    // Создаем новые слайды
    newsData.forEach((newsItem, index) => {
        const slide = document.createElement('div');
        slide.className = `news-slide ${index === 0 ? 'active' : ''}`;
        
        // Добавляем обработчик клика
        slide.addEventListener('click', () => {
            if (newsItem.link) {
                window.open(newsItem.link, '_blank');
            }
        });
        
        const formattedDate = new Date(newsItem.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        slide.innerHTML = `
            <div class="news-content">
                <div class="news-image" style="background-image: url('${newsItem.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}')"></div>
                <div class="news-text">
                    <span class="news-badge">${newsItem.badge}</span>
                    <h3>${newsItem.title}</h3>
                    <p>${newsItem.description}</p>
                </div>
            </div>
            <div class="news-date">${formattedDate}</div>
        `;
        
        newsSlider.appendChild(slide);
    });
    
    // Перезапускаем слайдер с новыми данными
    currentNewsSlide = 0;
    const indicatorsContainer = document.getElementById('newsIndicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        
        newsData.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `news-indicator ${index === 0 ? 'active' : ''}`;
            
            // Добавляем прогресс-бар для активного индикатора
            if (index === 0) {
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                indicator.appendChild(progressBar);
            }
            
            indicator.addEventListener('click', () => {
                goToNewsSlideGroup(Math.floor(index / slidesPerView));
                // Перезапускаем анимацию
                updateProgressBar(Math.floor(index / slidesPerView));
            });
            indicatorsContainer.appendChild(indicator);
        });
    }
}