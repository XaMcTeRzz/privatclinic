<?php get_header(); ?>

<div class="container">
    <h1 class="page-title">Наши врачи</h1>
    
    <div class="doctors-grid">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <div class="doctor-card">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="doctor-image">
                            <?php the_post_thumbnail('medium'); ?>
                        </div>
                    <?php endif; ?>
                    <div class="doctor-content">
                        <h3><?php the_title(); ?></h3>
                        <?php
                        $specialty = get_post_meta(get_the_ID(), '_doctor_specialty', true);
                        $experience = get_post_meta(get_the_ID(), '_doctor_experience', true);
                        ?>
                        <?php if ($specialty) : ?>
                            <div class="doctor-specialty"><?php echo esc_html($specialty); ?></div>
                        <?php endif; ?>
                        <?php if ($experience) : ?>
                            <div class="doctor-experience"><?php echo esc_html($experience); ?> лет опыта</div>
                        <?php endif; ?>
                        <p><?php the_excerpt(); ?></p>
                        <a href="<?php the_permalink(); ?>" class="btn btn-secondary">Подробнее</a>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else : ?>
            <p>Врачи не найдены.</p>
        <?php endif; ?>
    </div>
    
    <!-- Навигация по страницам -->
    <?php the_posts_pagination(); ?>
</div>

<?php get_footer(); ?>