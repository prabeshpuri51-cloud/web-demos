/* script.js */
document.addEventListener("DOMContentLoaded", function() {

  // A. SCROLL REVEAL ANIMATIONS (WITH GRACEFUL FALLBACK)
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');
  
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If Observer not supported or reduced motion on, make everything visible immediately
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }


  // B. DYNAMIC WHATSAPP ENQUIRY ROUTER
  const form = document.getElementById('whatsapp-enquiry-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const type = document.getElementById('event-type').value;
      const date = document.getElementById('event-date').value;
      const venue = document.getElementById('event-venue').value;
      const guests = document.getElementById('guest-count').value;
      
      // Target WhatsApp phone number
      const phoneNum = "9779823314206";
      
      // Compose readable natural message
      const intro = `Namaste Rang Events! I'm reaching out from the website demo to ask about your event availability:`;
      const details = `\n\n• Event Type: ${type}\n• Tentative Date: ${date}\n• Venue: ${venue}\n• Estimated Guests: ${guests}`;
      const outro = `\n\nCould you please send over packages or check if this date is open? (Sample enquiry)`;
      
      const fullMsg = encodeURIComponent(intro + details + outro);
      const waURL = `https://wa.me/${phoneNum}?text=${fullMsg}`;
      
      // Launch in new tab
      window.open(waURL, '_blank', 'noopener,noreferrer');
    });
  }


  // C. ACCESSIBLE GALLERY LIGHTBOX VIEWER
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-nav.prev');
  const nextBtn = document.querySelector('.lightbox-nav.next');
  
  let currentIndex = 0;
  let activeGalleryArray = [];

  function openLightbox(index, gallery) {
    activeGalleryArray = Array.from(gallery);
    currentIndex = index;
    updateLightboxContent();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    
    // Bind Keyboard and Focus Trap Events
    document.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
    
    // Return Focus to trigger image
    if (activeGalleryArray[currentIndex]) {
      activeGalleryArray[currentIndex].focus();
    }
  }

  function navigateLightbox(direction) {
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % activeGalleryArray.length;
    } else if (direction === 'prev') {
      currentIndex = (currentIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
    }
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const currentItem = activeGalleryArray[currentIndex];
    const imgEl = currentItem.querySelector('img');
    
    if (imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
      lightboxCaption.textContent = currentItem.getAttribute('data-caption') || imgEl.alt;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    } else if (e.key === 'Tab') {
      // Basic focus trap
      const focusables = lightbox.querySelectorAll('button, [tabindex="0"]');
      const firstFocus = focusables[0];
      const lastFocus = focusables[focusables.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocus) {
          lastFocus.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocus) {
          firstFocus.focus();
          e.preventDefault();
        }
      }
    }
  }

  // Setup Accessibility Attribute & Pointer bindings
  galleryItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Open full photo viewer');
    
    // Extract local Event Block to constrain previous/next carousel navigations locally
    const parentEventBlock = item.closest('.event-block');
    const localGallery = parentEventBlock ? parentEventBlock.querySelectorAll('.gallery-item') : galleryItems;
    
    item.addEventListener('click', function() {
      const index = Array.from(localGallery).indexOf(item);
      openLightbox(index, localGallery);
    });

    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const index = Array.from(localGallery).indexOf(item);
        openLightbox(index, localGallery);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox('prev'));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox('next'));
  
  // Close on Backdrop Click
  const backdrop = document.querySelector('.lightbox-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeLightbox);


  // D. MOBILE STICKY BOTTOM BAR VISIBILITY CONTROL
  const bottomBar = document.querySelector('.sticky-bottom-bar');
  const heroSection = document.querySelector('.hero-section');
  const footer = document.querySelector('.site-footer');

  if (bottomBar && heroSection && footer) {
    function toggleBottomBar() {
      const scrollPos = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      const footerTop = footer.offsetTop;
      const viewportHeight = window.innerHeight;

      // Show after user scroll passes the heroic visual & hide before overlapping dark footer (saving overlaps!)
      // QuickBuild fix: use a class so the CSS (phones only) decides; was inline style that also showed the bar on desktop and before scrolling
      bottomBar.classList.toggle('is-visible', scrollPos > heroHeight - 80 && (scrollPos + viewportHeight) < footerTop);
    }

    window.addEventListener('scroll', toggleBottomBar, { passive: true });
    window.addEventListener('resize', toggleBottomBar);
    toggleBottomBar();
  }

  // E. QuickBuild fix: photo fallback (the original onerror attribute was broken HTML and left stray text)
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    function showFallback() {
      var box = document.createElement('div');
      box.className = 'fallback-img';
      box.textContent = img.getAttribute('data-fallback');
      if (img.parentNode) img.parentNode.replaceChild(box, img);
    }
    if (img.complete && img.naturalWidth === 0) { showFallback(); }
    else { img.addEventListener('error', showFallback, { once: true }); }
  });

  // F. QuickBuild fix: swipe left/right in the photo viewer (the prompt asked for it; Gemini left it out)
  if (lightbox) {
    var touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 50) { navigateLightbox(dx < 0 ? 'next' : 'prev'); }
    }, { passive: true });
  }

});