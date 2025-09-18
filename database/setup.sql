-- SQL скрипт для создания базы данных и таблиц
CREATE DATABASE IF NOT EXISTS `privatna_likarnya` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `privatna_likarnya`;

-- Таблица администраторов
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица настроек сайта
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL UNIQUE,
  `setting_value` text NOT NULL,
  `setting_type` varchar(20) DEFAULT 'text',
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица новостей
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text,
  `image_url` varchar(500),
  `badge` varchar(50),
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица врачей
CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `specialty` varchar(100) NOT NULL,
  `experience` varchar(50),
  `photo_url` varchar(500),
  `description` text,
  `education` text,
  `achievements` text,
  `languages` varchar(200),
  `consultation_price` decimal(10,2) DEFAULT NULL,
  `phone` varchar(20),
  `email` varchar(100),
  `schedule` text,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица услуг
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text,
  `full_description` text,
  `icon_class` varchar(50),
  `price` decimal(10,2) DEFAULT NULL,
  `duration` varchar(50),
  `preparation` text,
  `contraindications` text,
  `category` varchar(100),
  `image_url` varchar(500),
  `is_active` tinyint(1) DEFAULT 1,
  `is_popular` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица слайдов главной страницы
CREATE TABLE `hero_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `subtitle` text,
  `description` text,
  `background_image` varchar(500),
  `button_text` varchar(50),
  `button_link` varchar(200),
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Вставка начальных данных
INSERT INTO `admins` (`username`, `password`, `email`) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@privatna-likarnya.com');

-- Начальные настройки сайта
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_type`) VALUES
('site_title', 'Перша приватна лікарня', 'text'),
('site_phone', '+38 (044) 495-2-495', 'text'),
('site_email', 'info@medical-center.ua', 'email'),
('emergency_number', '5288', 'text'),
('header_phone_short', '(044) 49...', 'text'),
('company_address', 'м. Київ, вул. Медична, 123', 'text'),
('footer_description', 'Професійна медична допомога на найвищому рівні', 'textarea');

-- Начальные новости
INSERT INTO `news` (`title`, `description`, `image_url`, `badge`, `sort_order`) VALUES
('Открылось новое отделение кардиологии', 'С современным оборудованием и опытными специалистами', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '🆕 Новость', 1),
('Безкоштовні консультації', 'Кожного вівторка з 9:00 до 12:00 для пенсіонерів', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '📅 Акція', 2),
('Нові види лабораторних аналізів', 'Розширили список доступних досліджень', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '🔬 Послуга', 3);

-- Начальные врачи
INSERT INTO `doctors` (`name`, `specialty`, `experience`, `photo_url`, `description`, `sort_order`) VALUES
('Петренко Олексій Олександрович', 'Кардіолог', '15 років досвіду', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Спеціаліст з діагностики та лікування серцево-судинних захворювань', 1),
('Іванова Марія Сергіївна', 'Терапевт', '12 років досвіду', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Лікар загальної практики з великим досвідом', 2);

-- Начальные услуги
INSERT INTO `services` (`title`, `description`, `icon_class`, `price`, `sort_order`) VALUES
('Консультація терапевта', 'Первинний огляд та діагностика', 'fas fa-user-md', 500.00, 1),
('Кардіологічне обстеження', 'Повне обстеження серцево-судинної системи', 'fas fa-heartbeat', 800.00, 2),
('Лабораторні аналізи', 'Широкий спектр лабораторних досліджень', 'fas fa-flask', 300.00, 3);