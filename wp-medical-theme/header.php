<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php if (is_singular() && pings_open(get_queried_object())) : ?>
        <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
    <?php endif; ?>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Header Top -->
<div class="header-top">
    <div class="container header-top-content">
        <div class="contact-info">
            <span><i class="fas fa-phone"></i> <?php echo get_theme_mod('phone_number', '+7 (123) 456-78-90'); ?></span>
            <span><i class="fas fa-envelope"></i> <?php echo get_theme_mod('email_address', 'info@clinic.ru'); ?></span>
            <span><i class="fas fa-map-marker-alt"></i> <?php echo get_theme_mod('clinic_address', 'г. Москва, ул. Медицинская, д. 1'); ?></span>
        </div>
        <div class="language-selector">
            <select>
                <option>RU</option>
                <option>EN</option>
            </select>
        </div>
    </div>
</div>

<!-- Main Header -->
<header class="main-header">
    <div class="container header-content">
        <div class="logo">
            <img src="<?php echo get_template_directory_uri(); ?>/images/logo.png" alt="Логотип">
            <div class="logo-text">Мед<span>Клиник</span></div>
        </div>
        
        <div class="search-box">
            <?php get_search_form(); ?>
        </div>
        
        <nav class="navbar">
            <ul class="nav-menu">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'items_wrap' => '%3$s',
                    'fallback_cb' => false,
                ));
                ?>
                <li><a href="#" class="emergency-btn"><i class="fas fa-ambulance"></i> Экстренный вызов</a></li>
            </ul>
            <button class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </div>
</header>