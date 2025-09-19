<?php
/*
Template Name: Головна сторінка
*/
get_header(); ?>

<!-- Слайдер новостей -->
<section class="news-slider-section">
    <div class="container">
        <div class="news-slider" id="newsSlider">
            <div class="news-slides-container" id="newsContainer">
                <!-- Слайды новостей будут загружены через JavaScript -->
            </div>
        </div>
        <div class="news-controls">
            <div class="news-indicators" id="newsIndicators">
                <!-- Индикаторы будут добавлены через JS -->
            </div>
        </div>
    </div>
</section>

<!-- Главный слайдер -->
<section class="hero-slider">
    <div class="slide active">
        <div class="slide-bg" style="background-image: url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <span class="hero-badge">🏆 Краща медична клініка 2024</span>
                    <h1>Повний комплекс медичних послуг</h1>
                    <p>Професійна медична допомога на найвищому рівні. Досвідчені лікарі, сучасне обладнання, індивідуальний підхід.</p>
                    <div class="hero-actions">
                        <button class="btn btn-hero-primary">Записатися на прийом</button>
                        <button class="btn btn-hero-secondary">Консультація онлайн</button>
                    </div>
                </div>
                <div class="hero-widget">
                    <div class="widget-card">
                        <div class="widget-header">
                            <div class="widget-icon">
                                <i class="fas fa-user-md"></i>
                            </div>
                            <h3>Ви допомагаєте — ми лікуємо!</h3>
                        </div>
                        <div class="widget-content">
                            <p>Здорові та поранені українці можуть обміркувати заявки вам на допомогу!</p>
                            <div class="widget-images">
                                <div class="patient-photo"></div>
                                <div class="patient-photo"></div>
                                <div class="patient-photo"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Быстрая запись -->
<section class="quick-booking">
    <div class="container">
        <div class="booking-form">
            <h3>Швидкий запис</h3>
            <form id="quickBookingForm">
                <div class="form-group">
                    <select name="service" required>
                        <option value="">Оберіть послугу</option>
                        <option value="consultation">Консультація</option>
                        <option value="diagnostics">Діагностика</option>
                        <option value="analysis">Аналізи</option>
                    </select>
                </div>
                <div class="form-group">
                    <select name="doctor" required>
                        <option value="">Оберіть лікаря</option>
                        <option value="petrov">Петров И.И.</option>
                        <option value="ivanova">Иванова М.С.</option>
                    </select>
                </div>
                <div class="form-group">
                    <input type="date" name="date" required>
                </div>
                <div class="form-group">
                    <input type="tel" name="phone" placeholder="Телефон" required>
                </div>
                <button type="submit" class="btn btn-primary">Записатися</button>
            </form>
        </div>
    </div>
</section>

<!-- Наши услуги -->
<section class="services-section">
    <div class="container">
        <h2>Наші послуги</h2>
        <div class="services-grid" id="servicesGrid">
            <?php
            $services = new WP_Query(array(
                'post_type' => 'services',
                'posts_per_page' => 6
            ));
            
            if ($services->have_posts()) :
                while ($services->have_posts()) : $services->the_post();
                    $price = get_post_meta(get_the_ID(), '_service_price', true);
                    $duration = get_post_meta(get_the_ID(), '_service_duration', true);
                    $icon = get_post_meta(get_the_ID(), '_service_icon', true);
                    ?>
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="<?php echo esc_attr($icon ? $icon : 'fas fa-stethoscope'); ?>"></i>
                        </div>
                        <h3><?php the_title(); ?></h3>
                        <p><?php the_excerpt(); ?></p>
                        <div class="service-meta">
                            <span class="service-price"><?php echo esc_html($price); ?> грн</span>
                            <span class="service-duration"><?php echo esc_html($duration); ?></span>
                        </div>
                    </div>
                <?php endwhile;
                wp_reset_postdata();
            else :
                // Если нет услуг в базе, показываем данные по умолчанию
                echo do_shortcode('[medical_service name="Терапія" description="Загальна терапевтична допомога та консультації" icon="fas fa-stethoscope" price="500" duration="30 хв"]');
                echo do_shortcode('[medical_service name="Кардіологія" description="Діагностика та лікування серцево-судинних захворювань" icon="fas fa-heartbeat" price="800" duration="45 хв"]');
                echo do_shortcode('[medical_service name="Неврологія" description="Лікування захворювань нервової системи" icon="fas fa-brain" price="700" duration="40 хв"]');
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Наши врачи -->
<section class="doctors-section">
    <div class="container">
        <h2>Наші лікарі</h2>
        <div class="doctors-grid" id="doctorsGrid">
            <?php
            $doctors = new WP_Query(array(
                'post_type' => 'doctors',
                'posts_per_page' => 6
            ));
            
            if ($doctors->have_posts()) :
                while ($doctors->have_posts()) : $doctors->the_post();
                    $specialty = get_post_meta(get_the_ID(), '_doctor_specialty', true);
                    $experience = get_post_meta(get_the_ID(), '_doctor_experience', true);
                    ?>
                    <div class="doctor-card">
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="doctor-photo" style="background-image: url('<?php echo get_the_post_thumbnail_url(get_the_ID(), 'medium'); ?>')"></div>
                        <?php else : ?>
                            <div class="doctor-photo" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/doctor-placeholder.jpg')"></div>
                        <?php endif; ?>
                        <div class="doctor-info">
                            <h3 class="doctor-name"><?php the_title(); ?></h3>
                            <div class="doctor-specialty"><?php echo esc_html($specialty); ?></div>
                            <div class="doctor-experience"><?php echo esc_html($experience); ?> років досвіду</div>
                            <p><?php the_excerpt(); ?></p>
                        </div>
                    </div>
                <?php endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
        <div class="section-footer">
            <a href="<?php echo get_post_type_archive_link('doctors'); ?>" class="btn btn-outline">Усі лікарі</a>
        </div>
    </div>
</section>

<?php echo do_shortcode('[medical_stats]'); ?>

<!-- Отзывы -->
<section class="reviews-section">
    <div class="container">
        <h2>Відгуки пацієнтів</h2>
        <div class="reviews-slider" id="reviewsSlider">
            <!-- Отзывы будут загружены через JavaScript -->
        </div>
    </div>
</section>

<?php get_footer(); ?>