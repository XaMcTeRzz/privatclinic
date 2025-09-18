let currentSlideGroup = 0;
let newsInterval;
let isPaused = false;
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragThreshold = 50;
const slidesPerGroup = 3;
let newsData = [];

// Загрузка данных новостей из API или fallback
async function loadNewsData() {
    try {
        // Пытаемся загрузить из API
        const response = await fetch('api/get-data.php?type=news');
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data.length > 0) {
                newsData = result.data.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    badge: item.badge || '📰 Новина',
                    date: new Date(item.created_at).toLocaleDateString('uk-UA'),
                    image: item.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                }));
                console.log('Загружены данные из API:', newsData);
                return;
            }
        }
        throw new Error('API недоступен');
    } catch (error) {
        console.warn('Ошибка загрузки из API, используем fallback данные:', error);
        newsData = getDefaultNewsData();
    }
}

// Данные по умолчанию (fallback)
function getDefaultNewsData() {
    return [
        {
            id: 1,
            title: "Открылось новое отделение кардиологии",
            description: "С современным оборудованием и опытными специалистами",
            badge: "🆕 Новость",
            date: new Date().toLocaleDateString('uk-UA'),
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            title: "Безкоштовні консультації",
            description: "Кожного вівторка з 9:00 до 12:00 для пенсіонерів",
            badge: "📅 Акція",
            date: new Date().toLocaleDateString('uk-UA'),
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            title: "Нові види лабораторних аналізів",
            description: "Розширили список доступних досліджень",
            badge: "🔬 Послуга",
            date: new Date().toLocaleDateString('uk-UA'),
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            title: "Отримали сертифікат якості ISO 9001",
            description: "Міжнародна сертифікація системи менеджменту",
            badge: "🏆 Досягнення",
            date: new Date().toLocaleDateString('uk-UA'),
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 5,
            title: "Новий спеціаліст з неврології",
            description: "Доктор Петренко Олексій Олександрович",
            badge: "👨‍⚕️ Лікар",
            date: new Date().toLocaleDateString('uk-UA'),
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            title: "Помогли более 5000 пациентов",
            description: "В этом году наша клиника оказала помощь рекордному количеству пациентов",
            badge: "📊 Статистика",
            date: new Date().toLocaleDateString('uk-UA'),
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
    
    container.innerHTML = '';
    
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

function startAutoSlide() {
    clearInterval(newsInterval);
    
    newsInterval = setInterval(() => {
        if (!isPaused && !isDragging) {
            const totalGroups = Math.ceil(newsData.length / slidesPerGroup);
            currentSlideGroup = (currentSlideGroup + 1) % totalGroups;
            
            if (currentSlideGroup === 0) {
                // Возвращаемся к первой группе
                showSlideGroup(0);
            }
            
            console.log('Автопереключение на группу:', currentSlideGroup);
        }
    }, 8000);
}

function setupDragFunctionality(slider) {
    // Touch события для мобильных устройств
    slider.addEventListener('touchstart', handleDragStart, { passive: false });
    slider.addEventListener('touchmove', handleDragMove, { passive: false });
    slider.addEventListener('touchend', handleDragEnd);
    
    // Mouse события для десктопа
    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('mousemove', handleDragMove);
    slider.addEventListener('mouseup', handleDragEnd);
    slider.addEventListener('mouseleave', handleDragEnd);
}

function handleDragStart(e) {
    isDragging = true;
    startX = getClientX(e);
    currentX = startX;
    
    const slider = document.querySelector('.news-slider');
    if (slider) {
        slider.classList.add('dragging');
    }
    
    e.preventDefault();
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    currentX = getClientX(e);
    e.preventDefault();
}

function handleDragEnd(e) {
    if (!isDragging) return;
    
    const deltaX = currentX - startX;
    const totalGroups = Math.ceil(newsData.length / slidesPerGroup);
    
    if (Math.abs(deltaX) > dragThreshold) {
        if (deltaX > 0 && currentSlideGroup > 0) {
            // Свайп вправо - предыдущая группа
            currentSlideGroup--;
            console.log('Свайп вправо, группа:', currentSlideGroup);
        } else if (deltaX < 0 && currentSlideGroup < totalGroups - 1) {
            // Свайп влево - следующая группа
            currentSlideGroup++;
            console.log('Свайп влево, группа:', currentSlideGroup);
        }
        
        showSlideGroup(currentSlideGroup);
    }
    
    isDragging = false;
    isPaused = false;
    
    const slider = document.querySelector('.news-slider');
    if (slider) {
        slider.classList.remove('dragging');
    }
}

function getClientX(e) {
    return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация слайдера новостей...');
    initNewsSlider();
});

// Функция обновления новостей (для использования в админке)
window.updateNews = function() {
    console.log('Обновление новостей...');
    initNewsSlider();
};

// Экспорт функций для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadNewsData,
        createNewsSlides,
        initNewsSlider,
        updateNews: window.updateNews
    };
}