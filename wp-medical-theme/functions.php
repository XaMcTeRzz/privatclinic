<?php
// Medical Clinic WordPress Theme Functions

// Theme setup
function medical_clinic_setup() {
    // Add theme support for various features
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => 'Primary Menu',
        'footer' => 'Footer Menu'
    ));
}
add_action('after_setup_theme', 'medical_clinic_setup');

// Enqueue styles and scripts
function medical_clinic_enqueue_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Montserrat:wght@600;700&display=swap', array(), null);
    
    // Enqueue Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', array(), '6.0.0');
    
    // Enqueue main stylesheet
    wp_enqueue_style('medical-clinic-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Enqueue custom CSS with correct path
    wp_enqueue_style('medical-clinic-main-css', get_template_directory_uri() . '/css/main.css', array(), '1.0.0');
    
    // Enqueue jQuery
    wp_enqueue_script('jquery');
    
    // Enqueue main JavaScript
    wp_enqueue_script('medical-clinic-main-js', get_template_directory_uri() . '/js/main.js', array('jquery'), '1.0.0', true);
    
    // Enqueue news slider JavaScript
    wp_enqueue_script('medical-clinic-news-slider-js', get_template_directory_uri() . '/js/news-slider.js', array('jquery'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'medical_clinic_enqueue_scripts');

// Function to get theme settings
function medical_clinic_get_setting($setting) {
    switch($setting) {
        case 'medical_clinic_address':
            return get_theme_mod('clinic_address', 'г. Москва, ул. Медицинская, д. 1');
        case 'medical_clinic_phone':
            return get_theme_mod('phone_number', '+7 (123) 456-78-90');
        case 'medical_clinic_email':
            return get_theme_mod('email_address', 'info@clinic.ru');
        case 'medical_clinic_hours':
            return get_theme_mod('working_hours', 'Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00');
        default:
            return '';
    }
}

// Register Custom Post Types
function medical_clinic_register_post_types() {
    register_post_type('doctors', array(
        'labels' => array(
            'name' => 'Врачи',
            'singular_name' => 'Врач',
            'add_new' => 'Добавить врача',
            'add_new_item' => 'Добавить нового врача',
            'edit_item' => 'Редактировать врача',
            'new_item' => 'Новый врач',
            'view_item' => 'Просмотр врача',
            'search_items' => 'Поиск врача',
            'not_found' => 'Врачи не найдены',
            'not_found_in_trash' => 'Врачи не найдены в корзине'
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'doctors'),
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-groups',
        'show_in_rest' => true,
    ));
    
    register_post_type('services', array(
        'labels' => array(
            'name' => 'Услуги',
            'singular_name' => 'Услуга',
            'add_new' => 'Добавить услугу',
            'add_new_item' => 'Добавить новую услугу',
            'edit_item' => 'Редактировать услугу',
            'new_item' => 'Новая услуга',
            'view_item' => 'Просмотр услуги',
            'search_items' => 'Поиск услуги',
            'not_found' => 'Услуги не найдены',
            'not_found_in_trash' => 'Услуги не найдены в корзине'
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'services'),
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-hammer',
        'show_in_rest' => true,
    ));
}
add_action('init', 'medical_clinic_register_post_types');

// Add meta boxes for custom fields
function medical_clinic_add_meta_boxes() {
    add_meta_box('doctor_details', 'Детали врача', 'doctor_details_callback', 'doctors', 'normal', 'high');
    add_meta_box('service_details', 'Детали услуги', 'service_details_callback', 'services', 'normal', 'high');
}
add_action('add_meta_boxes', 'medical_clinic_add_meta_boxes');

// Doctor details meta box callback
function doctor_details_callback($post) {
    wp_nonce_field('save_doctor_details', 'doctor_details_nonce');
    $specialty = get_post_meta($post->ID, '_doctor_specialty', true);
    $experience = get_post_meta($post->ID, '_doctor_experience', true);
    ?>
    <p>
        <label for="doctor_specialty">Специальность:</label>
        <input type="text" id="doctor_specialty" name="doctor_specialty" value="<?php echo esc_attr($specialty); ?>" style="width:100%;">
    </p>
    <p>
        <label for="doctor_experience">Опыт (лет):</label>
        <input type="number" id="doctor_experience" name="doctor_experience" value="<?php echo esc_attr($experience); ?>" style="width:100%;">
    </p>
    <?php
}

// Service details meta box callback
function service_details_callback($post) {
    wp_nonce_field('save_service_details', 'service_details_nonce');
    $price = get_post_meta($post->ID, '_service_price', true);
    ?>
    <p>
        <label for="service_price">Цена (₽):</label>
        <input type="number" id="service_price" name="service_price" value="<?php echo esc_attr($price); ?>" style="width:100%;">
    </p>
    <?php
}

// Save custom meta box data
function medical_clinic_save_meta_box_data($post_id) {
    // Save doctor details
    if (isset($_POST['doctor_details_nonce']) && wp_verify_nonce($_POST['doctor_details_nonce'], 'save_doctor_details')) {
        if (isset($_POST['doctor_specialty'])) {
            update_post_meta($post_id, '_doctor_specialty', sanitize_text_field($_POST['doctor_specialty']));
        }
        if (isset($_POST['doctor_experience'])) {
            update_post_meta($post_id, '_doctor_experience', intval($_POST['doctor_experience']));
        }
    }
    
    // Save service details
    if (isset($_POST['service_details_nonce']) && wp_verify_nonce($_POST['service_details_nonce'], 'save_service_details')) {
        if (isset($_POST['service_price'])) {
            update_post_meta($post_id, '_service_price', floatval($_POST['service_price']));
        }
    }
}
add_action('save_post', 'medical_clinic_save_meta_box_data');

// Add shortcodes for dynamic content
function doctors_shortcode($atts) {
    $atts = shortcode_atts(array(
        'count' => 6,
    ), $atts);
    
    $query = new WP_Query(array(
        'post_type' => 'doctors',
        'posts_per_page' => $atts['count'],
    ));
    
    ob_start();
    if ($query->have_posts()) {
        echo '<div class="doctors-grid">';
        while ($query->have_posts()) {
            $query->the_post();
            $specialty = get_post_meta(get_the_ID(), '_doctor_specialty', true);
            $experience = get_post_meta(get_the_ID(), '_doctor_experience', true);
            ?>
            <div class="doctor-card">
                <?php if (has_post_thumbnail()) : ?>
                    <div class="doctor-image">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>
                <div class="doctor-info">
                    <h3><?php the_title(); ?></h3>
                    <?php if ($specialty) : ?>
                        <span class="specialty"><?php echo esc_html($specialty); ?></span>
                    <?php endif; ?>
                    <?php the_excerpt(); ?>
                    <?php if ($experience) : ?>
                        <p>Опыт: <?php echo esc_html($experience); ?> лет</p>
                    <?php endif; ?>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <?php
        }
        echo '</div>';
        wp_reset_postdata();
    }
    return ob_get_clean();
}
add_shortcode('doctors_list', 'doctors_shortcode');

function services_shortcode($atts) {
    $atts = shortcode_atts(array(
        'count' => 6,
    ), $atts);
    
    $query = new WP_Query(array(
        'post_type' => 'services',
        'posts_per_page' => $atts['count'],
    ));
    
    ob_start();
    if ($query->have_posts()) {
        echo '<div class="services-grid">';
        while ($query->have_posts()) {
            $query->the_post();
            $price = get_post_meta(get_the_ID(), '_service_price', true);
            ?>
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-stethoscope"></i>
                </div>
                <div class="service-content">
                    <h3><?php the_title(); ?></h3>
                    <?php the_excerpt(); ?>
                    <?php if ($price) : ?>
                        <p class="service-price">Цена: <?php echo esc_html($price); ?> ₽</p>
                    <?php endif; ?>
                    <a href="#" class="btn">Подробнее</a>
                </div>
            </div>
            <?php
        }
        echo '</div>';
        wp_reset_postdata();
    }
    return ob_get_clean();
}
add_shortcode('services_list', 'services_shortcode');

// Add theme customization options
function medical_clinic_customize_register($wp_customize) {
    // Add section for contact information
    $wp_customize->add_section('contact_info', array(
        'title' => 'Контактная информация',
        'priority' => 30,
    ));
    
    // Phone number setting
    $wp_customize->add_setting('phone_number', array(
        'default' => '+7 (123) 456-78-90',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('phone_number', array(
        'label' => 'Номер телефона',
        'section' => 'contact_info',
        'type' => 'text',
    ));
    
    // Email setting
    $wp_customize->add_setting('email_address', array(
        'default' => 'info@clinic.ru',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('email_address', array(
        'label' => 'Email адрес',
        'section' => 'contact_info',
        'type' => 'email',
    ));
    
    // Address setting
    $wp_customize->add_setting('clinic_address', array(
        'default' => 'г. Москва, ул. Медицинская, д. 1',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('clinic_address', array(
        'label' => 'Адрес клиники',
        'section' => 'contact_info',
        'type' => 'text',
    ));
    
    // Working hours setting
    $wp_customize->add_setting('working_hours', array(
        'default' => 'Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('working_hours', array(
        'label' => 'Часы работы',
        'section' => 'contact_info',
        'type' => 'text',
    ));
}
add_action('customize_register', 'medical_clinic_customize_register');
?>