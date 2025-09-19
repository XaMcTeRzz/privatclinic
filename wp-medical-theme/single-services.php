<?php get_header(); ?>

<div class="container">
    <?php while (have_posts()) : the_post(); ?>
        <article class="service-detail">
            <div class="service-header">
                <?php if (has_post_thumbnail()) : ?>
                    <div class="service-image-large">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>
                
                <div class="service-info">
                    <h1><?php the_title(); ?></h1>
                    <?php
                    $price = get_post_meta(get_the_ID(), '_service_price', true);
                    $duration = get_post_meta(get_the_ID(), '_service_duration', true);
                    ?>
                    
                    <?php if ($price) : ?>
                        <div class="service-price">
                            <strong>Цена:</strong> <?php echo esc_html($price); ?> грн
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($duration) : ?>
                        <div class="service-duration">
                            <strong>Длительность:</strong> <?php echo esc_html($duration); ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="service-content">
                <?php the_content(); ?>
            </div>
            
            <div class="service-actions">
                <a href="#" class="btn btn-primary">Записаться на услугу</a>
            </div>
        </article>
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>