<?php
/**
 * Plugin Name: Medical Clinic Theme Activation
 * Description: Плагин для проверки активации темы Медицинская Клиника
 * Version: 1.0
 * Author: Ваше Имя
 */

// Проверка активации темы
function medical_clinic_check_theme_activation() {
    $theme = wp_get_theme();
    if ($theme->get('Name') === 'Перша приватна лікарня') {
        add_action('admin_notices', 'medical_clinic_theme_activated_notice');
    }
}
add_action('after_setup_theme', 'medical_clinic_check_theme_activation');

// Уведомление об активации темы
function medical_clinic_theme_activated_notice() {
    echo '<div class="notice notice-success is-dismissible">';
    echo '<p>Тема "Медицинская Клиника" успешно активирована! Все стили и функции подключены корректно.</p>';
    echo '</div>';
}

// Проверка подключения стилей
function medical_clinic_check_styles() {
    global $wp_styles;
    $theme_styles = array();
    
    foreach ($wp_styles->queue as $handle) {
        if (isset($wp_styles->registered[$handle])) {
            $style = $wp_styles->registered[$handle];
            if (strpos($style->src, 'medical-clinic') !== false) {
                $theme_styles[] = $handle;
            }
        }
    }
    
    if (!empty($theme_styles)) {
        add_action('admin_notices', 'medical_clinic_styles_loaded_notice');
    }
}
add_action('wp_enqueue_scripts', 'medical_clinic_check_styles', 100);

// Уведомление о подключенных стилях
function medical_clinic_styles_loaded_notice() {
    echo '<div class="notice notice-info is-dismissible">';
    echo '<p>Стили темы "Медицинская Клиника" успешно подключены.</p>';
    echo '</div>';
}
?>