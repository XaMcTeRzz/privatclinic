<?php get_header(); ?>

<div class="container">
    <?php while (have_posts()) : the_post(); ?>
        <article class="doctor-detail">
            <div class="doctor-header">
                <?php if (has_post_thumbnail()) : ?>
                    <div class="doctor-image-large">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>
                
                <div class="doctor-info">
                    <h1><?php the_title(); ?></h1>
                    <?php
                    $specialty = get_post_meta(get_the_ID(), '_doctor_specialty', true);
                    $experience = get_post_meta(get_the_ID(), '_doctor_experience', true);
                    $education = get_post_meta(get_the_ID(), '_doctor_education', true);
                    ?>
                    
                    <?php if ($specialty) : ?>
                        <div class="doctor-specialty">
                            <strong>Специальность:</strong> <?php echo esc_html($specialty); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($experience) : ?>
                        <div class="doctor-experience">
                            <strong>Опыт работы:</strong> <?php echo esc_html($experience); ?> лет
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($education) : ?>
                        <div class="doctor-education">
                            <strong>Образование:</strong> <?php echo esc_html($education); ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="doctor-content">
                <?php the_content(); ?>
            </div>
            
            <div class="doctor-actions">
                <a href="#" class="btn btn-primary">Записаться на прием</a>
            </div>
        </article>
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>