<?php get_header(); ?>

<div class="container">
    <h1 class="page-title">Наши услуги</h1>
    
    <div class="services-grid">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <div class="service-card">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="service-image">
                            <?php the_post_thumbnail('medium'); ?>
                        </div>
                    <?php endif; ?>
                    <div class="service-content">
                        <h3><?php the_title(); ?></h3>
                        <p><?php the_excerpt(); ?></p>
                        <?php
                        $price = get_post_meta(get_the_ID(), '_service_price', true);
                        $duration = get_post_meta(get_the_ID(), '_service_duration', true);
                        ?>
                        <?php if ($price) : ?>
                            <div class="service-price"><?php echo esc_html($price); ?> грн</div>
                        <?php endif; ?>
                        <?php if ($duration) : ?>
                            <div class="service-duration"><?php echo esc_html($duration); ?></div>
                        <?php endif; ?>
                        <a href="<?php the_permalink(); ?>" class="btn btn-secondary">Подробнее</a>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else : ?>
            <p>Услуги не найдены.</p>
        <?php endif; ?>
    </div>
    
    <!-- Навигация по страницам -->
    <?php the_posts_pagination(); ?>
</div>

<?php get_footer(); ?>