// Пример использования базы данных в коде админ-панели

// Функция для загрузки врачей из базы
async function loadDoctorsFromDB() {
  try {
    // Отправляем запрос к API
    const response = await fetch('/api/load-data?type=doctors');
    
    if (response.ok) {
      // Получаем данные
      const doctors = await response.json();
      console.log('Врачи загружены:', doctors);
      return doctors;
    } else {
      console.error('Ошибка загрузки врачей:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    return [];
  }
}

// Функция для сохранения врачей в базу
async function saveDoctorsToDB(doctors) {
  try {
    // Отправляем данные в API
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataType: 'doctors',
        data: doctors
      })
    });
    
    if (response.ok) {
      console.log('Врачи сохранены успешно');
      return true;
    } else {
      console.error('Ошибка сохранения врачей:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    return false;
  }
}

// Пример использования
async function example() {
  // Загружаем врачей
  const doctors = await loadDoctorsFromDB();
  
  // Добавляем нового врача
  const newDoctor = {
    name: 'Новый Врач',
    specialty: 'Терапевт',
    experience: 5,
    photo: 'images/new-doctor.jpg',
    description: 'Описание нового врача'
  };
  
  doctors.push(newDoctor);
  
  // Сохраняем изменения
  await saveDoctorsToDB(doctors);
}

// Вызываем пример
example();