// Простой слайдер новостей - показываем 3 новости одновременно с drag функционалом
let currentSlideGroup = 0;
let newsInterval;
let isPaused = false;
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragThreshold = 50; // минимальное расстояние для переключения слайда
const slidesPerGroup = 3; // показываем 3 новости сразу
let newsData = []; // данные новостей

// Загрузка данных новостей
async function loadNewsData() {
    try {
        // Пытаемся загрузить из localStorage (админка)
        const savedData = localStorage.getItem('newsData');
        if (savedData) {
            newsData = JSON.parse(savedData);
            console.log('Загружены данные из админки:', newsData);
            return;
        }
        
        // Если нет сохраненных данных, загружаем из JSON файла
        const response = await fetch('data/news.json');
        if (response.ok) {
            newsData = await response.json();
            console.log('Загружены данные из JSON:', newsData);
        } else {
            throw new Error('Файл не найден');
        }
    } catch (error) {
        console.error('Ошибка загрузки данных новостей:', error);
        // Используем данные по умолчанию
        newsData = getDefaultNewsData();
    }
}

// Данные по умолчанию
function getDefaultNewsData() {
    return [
        {
            id: 1,
            title: "Открылось новое отделение кардиологии",
            description: "С современным оборудованием и опытными специалистами",
            badge: "🆕 Новость",
            date: "15 вересня 2024",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            title: "Безкоштовні консультації",
            description: "Кожного вівторка з 9:00 до 12:00 для пенсіонерів",
            badge: "📅 Акція",
            date: "10 вересня 2024",
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            title: "Нові види лабораторних аналізів",
            description: "Розширили список доступних досліджень",
            badge: "🔬 Послуга",
            date: "8 вересня 2024",
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            title: "Отримали сертифікат якості ISO 9001",
            description: "Міжнародна сертифікація системи менеджменту",
            badge: "🏆 Досягнення",
            date: "5 вересня 2024",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 5,
            title: "Новий спеціаліст з неврології",
            description: "Доктор Петренко Олексій Олександрович",
            badge: "👨‍⚕️ Лікар",
            date: "1 вересня 2024",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            title: "Помогли более 5000 пациентов",
            description: "В этом году наша клиника оказала помощь рекордному количеству пациентов",
            badge: "📊 Статистика",
            date: "28 серпня 2024",
            image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
}

// Создание HTML для слайдов
function createNewsSlides() {
    const container = document.getElementById('newsContainer');
    if (!container) {
        console.error('Контейнер новостей не найден');
        return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Создаем слайды из данных
    newsData.forEach((news, index) => {
        const slide = document.createElement('div');
        slide.className = 'news-slide';
        slide.innerHTML = `
            <div class="news-content">
                <div class="news-image" style="background-image: url('${news.image}')"></div>
                <div class="news-text">
                    <span class="news-badge">${news.badge}</span>
                    <h3>${news.title}</h3>
                    <p>${news.description}</p>
                </div>
            </div>
        `;
        container.appendChild(slide);
    });
    
    console.log(`Создано ${newsData.length} слайдов новостей`);
}

async function initNewsSlider() {
    console.log('Инициализация слайдера новостей - 3 новости одновременно');
    
    // Загружаем данные новостей
    await loadNewsData();
    
    // Создаем слайды из данных
    createNewsSlides();
    
    const container = document.getElementById('newsContainer');
    const slides = document.querySelectorAll('.news-slide');
    const slider = document.querySelector('.news-slider');
    
    console.log('Найдено слайдов:', slides.length);
    console.log('Контейнер найден:', !!container);
    
    if (!container || slides.length === 0) {
        console.error('Не найден контейнер или слайды');
        return;
    }
    
    // Показываем первые 3 слайда одновременно
    showSlideGroup(0);
    
    const totalGroups = Math.ceil(slides.length / slidesPerGroup);
    console.log('Всего групп по 3 слайда:', totalGroups);
    
    // Запускаем автопрокрутку если есть несколько групп
    if (totalGroups > 1) {
        startAutoSlide();
    }
    
    // Управление наведением мыши
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            isPaused = true;
            console.log('Автопрокрутка приостановлена');
        });
        slider.addEventListener('mouseleave', () => {
            if (!isDragging) {
                isPaused = false;
                console.log('Автопрокрутка возобновлена');
            }
        });
    }
    
    // Добавляем drag функционал
    if (slider && totalGroups > 1) {
        setupDragFunctionality(slider);
    }
    
    console.log('Слайдер успешно инициализирован - 3 новости одновременно');
}

function showSlideGroup(groupIndex) {
    console.log('Показ группы слайдов:', groupIndex);
    
    const slides = document.querySelectorAll('.news-slide');
    
    if (slides.length === 0) {
        console.error('Нет слайдов для отображения');
        return;
    }
    
    // Показываем все первые 3 слайда одновременно
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index < 3) {
            slide.classList.add('active');
            slide.style.display = 'flex';
        } else {
            slide.style.display = 'none';
        }
    });
    
    console.log('Показаны первые 3 новости одновременно');
}

function setupDragFunctionality(slider) {
    // Mouse events
    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('mousemove', handleDragMove);
    slider.addEventListener('mouseup', handleDragEnd);
    slider.addEventListener('mouseleave', handleDragEnd);
    
    // Touch events для мобильных устройств
    slider.addEventListener('touchstart', handleDragStart, { passive: false });
    slider.addEventListener('touchmove', handleDragMove, { passive: false });
    slider.addEventListener('touchend', handleDragEnd);
    
    // Предотвращаем выделение текста при перетаскивании
    slider.addEventListener('selectstart', (e) => e.preventDefault());
    slider.addEventListener('dragstart', (e) => e.preventDefault());
    
    console.log('Drag функционал настроен');
}

function handleDragStart(e) {
    e.preventDefault();
    isDragging = true;
    isPaused = true;
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startX = clientX;
    currentX = clientX;
    
    document.body.style.cursor = 'grabbing';
    console.log('Начало перетаскивания');
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    currentX = clientX;
    
    const deltaX = currentX - startX;
    const container = document.getElementById('newsContainer');
    
    // Визуальная обратная связь при перетаскивании
    if (container) {
        const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 200);
        container.style.opacity = opacity;
        
        // Небольшой сдвиг для визуального эффекта
        const translateX = deltaX * 0.1; // уменьшаем сдвиг для плавности
        container.style.transform = `translateX(${translateX}px)`;
    }
}

function handleDragEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    document.body.style.cursor = '';
    
    const deltaX = currentX - startX;
    const container = document.getElementById('newsContainer');
    
    // Восстанавливаем стили
    if (container) {
        container.style.opacity = '1';
        container.style.transform = 'translateX(0)';
    }
    
    console.log('Окончание перетаскивания, смещение:', deltaX);
    
    // Определяем направление и переключаем группу слайдов если смещение достаточно большое
    if (Math.abs(deltaX) > dragThreshold) {
        if (deltaX > 0) {
            // Перетащили вправо - предыдущая группа
            prevSlideGroup();
            console.log('Перетащили вправо - предыдущая группа');
        } else {
            // Перетащили влево - следующая группа
            nextSlideGroup();
            console.log('Перетащили влево - следующая группа');
        }
    }
    
    // Возобновляем автопрокрутку через небольшую задержку
    setTimeout(() => {
        if (!document.querySelector('.news-slider:hover')) {
            isPaused = false;
        }
    }, 500);
}

function nextSlideGroup() {
    const slides = document.querySelectorAll('.news-slide');
    const totalGroups = Math.ceil(slides.length / slidesPerGroup);
    const nextIndex = (currentSlideGroup + 1) % totalGroups;
    console.log('Следующая группа:', nextIndex);
    showSlideGroup(nextIndex);
}

function prevSlideGroup() {
    const slides = document.querySelectorAll('.news-slide');
    const totalGroups = Math.ceil(slides.length / slidesPerGroup);
    const prevIndex = (currentSlideGroup - 1 + totalGroups) % totalGroups;
    console.log('Предыдущая группа:', prevIndex);
    showSlideGroup(prevIndex);
}

function startAutoSlide() {
    console.log('Запуск автопрокрутки групп');
    
    newsInterval = setInterval(() => {
        if (!isPaused && !isDragging) {
            console.log('Автоматический переход к следующей группе');
            nextSlideGroup();
        }
    }, 8000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запуск слайдера');
    // Небольшая задержка, чтобы CSS успел примениться
    setTimeout(() => {
        initNewsSlider();
    }, 100);
});