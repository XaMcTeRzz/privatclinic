// Main JavaScript for Medical Clinic WordPress Theme - Exact Copy of Original Design

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Animate hamburger icon
      const spans = hamburger.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Hero Slider
  const heroSlides = document.querySelectorAll('.hero-slide');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const prevArrow = document.querySelector('.slider-arrow.prev');
  const nextArrow = document.querySelector('.slider-arrow.next');
  let currentSlide = 0;

  function showSlide(index) {
    // Hide all slides
    heroSlides.forEach(slide => slide.classList.remove('active'));
    sliderDots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    heroSlides[index].classList.add('active');
    sliderDots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= heroSlides.length) nextIndex = 0;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) prevIndex = heroSlides.length - 1;
    showSlide(prevIndex);
  }

  // Initialize slider
  if (heroSlides.length > 0) {
    showSlide(0);
    
    // Auto advance slides every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Arrow navigation
    if (prevArrow) prevArrow.addEventListener('click', prevSlide);
    if (nextArrow) nextArrow.addEventListener('click', nextSlide);
    
    // Dot navigation
    sliderDots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });
  }

  // Form Validation
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const inputs = this.querySelectorAll('input, select');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '#ddd';
        }
      });
      
      if (isValid) {
        // In a real implementation, you would submit the form here
        alert('Бронирование успешно отправлено! Мы свяжемся с вами в ближайшее время.');
        this.reset();
      } else {
        alert('Пожалуйста, заполните все обязательные поля.');
      }
    });
  }

  // Smooth Scrolling for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animation on Scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .doctor-card, .stat-item, .news-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll('.service-card, .doctor-card, .stat-item, .news-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Trigger animation on scroll
  window.addEventListener('scroll', animateOnScroll);
  // Trigger once on load
  animateOnScroll();
});

// Initialize counters for statistics
function initCounters() {
  const counters = document.querySelectorAll('.stat-item .number');
  const speed = 200; // The lower the faster

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;

      // Lower inc to slow and higher to slow
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
}

// Initialize counters when the page loads
window.addEventListener('load', initCounters);