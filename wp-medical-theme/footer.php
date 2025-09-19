    <!-- Футер -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Контакти</h4>
                    <p><i class="fas fa-map-marker-alt"></i> <?php echo medical_clinic_get_setting('medical_clinic_address'); ?></p>
                    <p><i class="fas fa-phone"></i> <?php echo medical_clinic_get_setting('medical_clinic_phone'); ?></p>
                    <p><i class="fas fa-envelope"></i> <?php echo medical_clinic_get_setting('medical_clinic_email'); ?></p>
                </div>
                <div class="footer-section">
                    <h4>Режим роботи</h4>
                    <p><?php echo medical_clinic_get_setting('medical_clinic_hours'); ?></p>
                    <p>Невідкладна допомога: 24/7</p>
                </div>
                <div class="footer-section">
                    <h4>Соціальні мережі</h4>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-telegram"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> Медичний центр. Усі права захищені.</p>
            </div>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>