// Тест API функций
const http = require('http');

// Тест загрузки данных
function testLoadData() {
  const options = {
    hostname: 'localhost',
    port: 9999,
    path: '/.netlify/functions/load-data?filename=doctors.json',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Загрузка данных:');
      console.log('Статус:', res.statusCode);
      console.log('Данные:', data);
      
      // Проверим сохранение данных
      testSaveData();
    });
  });
  
  req.on('error', (error) => {
    console.error('Ошибка загрузки:', error);
  });
  
  req.end();
}

// Тест сохранения данных
function testSaveData() {
  const testData = [
    {
      "id": 1,
      "name": "Петров Иван Иванович",
      "specialty": "Терапевт",
      "experience": 15
    },
    {
      "id": 2,
      "name": "Иванова Мария Сергеевна",
      "specialty": "Кардиолог",
      "experience": 12
    }
  ];
  
  const postData = JSON.stringify({
    filename: 'test-doctors.json',
    data: testData
  });
  
  const options = {
    hostname: 'localhost',
    port: 9999,
    path: '/.netlify/functions/save-data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\nСохранение данных:');
      console.log('Статус:', res.statusCode);
      console.log('Результат:', data);
    });
  });
  
  req.on('error', (error) => {
    console.error('Ошибка сохранения:', error);
  });
  
  req.write(postData);
  req.end();
}

// Запуск тестов
testLoadData();