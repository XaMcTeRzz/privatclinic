#!/usr/bin/env node

// Скрипт для деплоя на Netlify
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Подготовка к деплою на Netlify...');

try {
  // Проверяем наличие netlify-cli
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('Netlify CLI найден');
} catch (error) {
  console.log('Netlify CLI не найден, устанавливаем...');
  execSync('npm install -g netlify-cli', { stdio: 'inherit' });
}

// Инициализируем данные
console.log('Инициализация данных...');
execSync('npm run init-data', { stdio: 'inherit' });

// Деплоим на Netlify
console.log('Деплой на Netlify...');
try {
  execSync('netlify deploy --prod', { stdio: 'inherit' });
  console.log('Деплой успешно завершен!');
} catch (error) {
  console.error('Ошибка при деплое:', error.message);
  console.log('Попробуйте выполнить команду вручную: netlify deploy --prod');
}