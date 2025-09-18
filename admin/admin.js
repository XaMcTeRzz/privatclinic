// Админ-панель для управления новостями
let newsData = [];

// Загружаем данные новостей при инициализации
document.addEventListener('DOMContentLoaded', function() {
    loadNewsData();
});

// Загрузка данных новостей
async function loadNewsData() {
    try {
        const response = await fetch('../data/news.json');
        if (response.ok) {
            newsData = await response.json();
        } else {
            // Если файл не найден, создаем базовые данные
            newsData = createDefaultNewsData();
        }
        renderNewsCards();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        newsData = createDefaultNewsData();
        renderNewsCards();
    }
}

// Создание базовых данных новостей
function createDefaultNewsData() {
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

// Отрисовка карточек новостей
function renderNewsCards() {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '';

    newsData.forEach((news, index) => {
        const card = createNewsCard(news, index);
        newsGrid.appendChild(card);
    });
}

// Создание карточки новости
function createNewsCard(news, index) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
        <h3>Новость ${index + 1}</h3>
        
        <div class="form-group">
            <label>Текущее изображение:</label>
            <img src="${news.image}" alt="Текущее изображение" class="current-image" id="currentImage_${index}">
        </div>

        <div class="form-group">
            <label>Загрузить новое изображение:</label>
            <div class="image-upload" onclick="selectImage(${index})">
                <input type="file" id="imageInput_${index}" accept="image/*" style="display: none;" onchange="handleImageUpload(${index}, this)">
                <p>📸 Нажмите для выбора изображения</p>
                <p style="font-size: 12px; color: #7f8c8d;">Поддерживаются: JPG, PNG, GIF</p>
                <img id="preview_${index}" class="image-preview" style="display: none;">
            </div>
        </div>

        <div class="form-group">
            <label>Бейдж:</label>
            <input type="text" id="badge_${index}" value="${news.badge}" placeholder="🆕 Новость">
        </div>

        <div class="form-group">
            <label>Заголовок:</label>
            <input type="text" id="title_${index}" value="${news.title}" placeholder="Заголовок новости">
        </div>

        <div class="form-group">
            <label>Описание:</label>
            <textarea id="description_${index}" rows="3" placeholder="Описание новости">${news.description}</textarea>
        </div>

        <div class="form-group">
            <label>Дата:</label>
            <input type="text" id="date_${index}" value="${news.date}" placeholder="15 вересня 2024">
        </div>

        <button class="btn" onclick="saveNews(${index})">
            💾 Сохранить
        </button>
    `;
    return card;
}

// Выбор изображения
function selectImage(index) {
    document.getElementById(`imageInput_${index}`).click();
}

// Обработка загрузки изображения
function handleImageUpload(index, input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(`preview_${index}`);
            const uploadDiv = input.parentElement;
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadDiv.classList.add('has-image');
            
            // Обновляем данные новости
            newsData[index].image = e.target.result;
            
            // Обновляем текущее изображение
            document.getElementById(`currentImage_${index}`).src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Сохранение отдельной новости
function saveNews(index) {
    const badge = document.getElementById(`badge_${index}`).value;
    const title = document.getElementById(`title_${index}`).value;
    const description = document.getElementById(`description_${index}`).value;
    const date = document.getElementById(`date_${index}`).value;

    // Обновляем данные
    newsData[index] = {
        ...newsData[index],
        badge: badge,
        title: title,
        description: description,
        date: date
    };

    showSuccessMessage();
}

// Сохранение всех новостей
async function saveAllNews() {
    // Собираем все данные
    newsData.forEach((news, index) => {
        const badge = document.getElementById(`badge_${index}`).value;
        const title = document.getElementById(`title_${index}`).value;
        const description = document.getElementById(`description_${index}`).value;
        const date = document.getElementById(`date_${index}`).value;

        newsData[index] = {
            ...newsData[index],
            badge: badge,
            title: title,
            description: description,
            date: date
        };
    });

    try {
        // Здесь должна быть отправка данных на сервер
        // Пока просто сохраняем в localStorage
        localStorage.setItem('newsData', JSON.stringify(newsData));
        
        // Обновляем файл на основном сайте
        await updateMainSiteNews();
        
        showSuccessMessage();
        console.log('Данные сохранены:', newsData);
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка сохранения данных');
    }
}

// Обновление новостей на основном сайте
async function updateMainSiteNews() {
    try {
        // В реальном проекте здесь был бы API вызов
        // Пока создаем JSON файл для загрузки
        const jsonData = JSON.stringify(newsData, null, 2);
        
        // Создаем ссылку для скачивания обновленного файла
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Автоматически скачиваем файл
        const a = document.createElement('a');
        a.href = url;
        a.download = 'news.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Файл news.json готов к скачиванию');
        
    } catch (error) {
        console.error('Ошибка обновления:', error);
    }
}

// Показать сообщение об успехе
function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.style.display = 'block';
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
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