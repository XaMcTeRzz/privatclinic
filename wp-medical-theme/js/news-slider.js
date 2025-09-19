// News Slider JavaScript for Medical Clinic WordPress Theme - Exact Copy of Original Design

document.addEventListener('DOMContentLoaded', function() {
  const newsSlider = document.querySelector('.news-slider');
  const newsCards = document.querySelectorAll('.news-card');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  
  if (!newsSlider || !newsCards.length) return;
  
  let currentIndex = 0;
  const cardWidth = newsCards[0].offsetWidth + 30; // width + margin
  const totalCards = newsCards.length;
  
  // Set initial position
  newsSlider.style.transform = 'translateX(0px)';
  
  // Next button functionality
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (currentIndex < totalCards - 1) {
        currentIndex++;
        updateSliderPosition();
      }
    });
  }
  
  // Previous button functionality
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSliderPosition();
      }
    });
  }
  
  // Update slider position
  function updateSliderPosition() {
    const newPosition = -currentIndex * cardWidth;
    newsSlider.style.transform = `translateX(${newPosition}px)`;
    
    // Update button states
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
      nextBtn.disabled = currentIndex === totalCards - 1;
      nextBtn.style.opacity = currentIndex === totalCards - 1 ? '0.5' : '1';
      nextBtn.style.cursor = currentIndex === totalCards - 1 ? 'not-allowed' : 'pointer';
    }
  }
  
  // Touch/drag functionality for mobile
  let startX = 0;
  let endX = 0;
  
  newsSlider.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  });
  
  newsSlider.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });
  
  // Mouse drag functionality for desktop
  let isDragging = false;
  
  newsSlider.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX;
    newsSlider.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    // Visual feedback during drag
  });
  
  document.addEventListener('mouseup', function(e) {
    if (!isDragging) return;
    isDragging = false;
    endX = e.clientX;
    newsSlider.style.cursor = 'grab';
    handleSwipe();
  });
  
  function handleSwipe() {
    const threshold = 50; // Minimum swipe distance
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < totalCards - 1) {
        // Swipe left - next slide
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous slide
        currentIndex--;
      }
      updateSliderPosition();
    }
  }
  
  // Initialize button states
  if (prevBtn) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
  }
});