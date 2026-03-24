/* ============================================================
   DENTAL CLINIC — script.js
   Handles: Mobile Nav | Navbar Scroll | Before/After Slider
   ============================================================ */

/* ── 1. MOBILE NAVIGATION ─────────────────────────────────── */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── 2. NAVBAR SCROLL EFFECT ──────────────────────────────── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
})();

/* ── 3. ACTIVE NAV LINK ───────────────────────────────────── */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── 4. BEFORE / AFTER SLIDER ─────────────────────────────── */
/*
  Each slider requires the following HTML structure:
  <div class="ba-slider" data-slider>
    <div class="ba-slider-inner">
      <div class="ba-before">  ...before content... <span class="ba-label">Before</span> </div>
      <div class="ba-clip">
        <div class="ba-after"> ...after content...  <span class="ba-label">After</span>  </div>
      </div>
      <div class="ba-divider">
        <div class="ba-handle">⇔</div>
      </div>
    </div>
    <div class="ba-caption">Treatment name</div>
  </div>

  The slider works by adjusting the width of `.ba-clip` (and the absolute width of
  `.ba-after` inside it) as the user drags.
*/
(function () {
  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach(slider => {
    const inner    = slider.querySelector('.ba-slider-inner');
    const clip     = slider.querySelector('.ba-clip');
    const divider  = slider.querySelector('.ba-divider');
    const handle   = slider.querySelector('.ba-handle');
    const afterImg = slider.querySelector('.ba-clip .ba-after');

    if (!inner || !clip || !divider) return;

    let isDragging = false;

    // Compute position from pointer X
    const setPosition = (clientX) => {
      const rect  = inner.getBoundingClientRect();
      let   ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0.03, Math.min(0.97, ratio)); // clamp 3%–97%

      const pct = ratio * 100;

      clip.style.width    = pct + '%';
      divider.style.left  = pct + '%';
      if (handle) handle.style.left = pct + '%';

      // Keep the after image full width inside the clip
      if (afterImg) {
        afterImg.style.width = (rect.width) + 'px';
      }
    };

    // ── Mouse events ──────────────────────────────────────
    inner.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // ── Touch events ──────────────────────────────────────
    inner.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    // ── Initialise at 50% ─────────────────────────────────
    // Defer so the DOM has dimensions
    requestAnimationFrame(() => {
      const rect = inner.getBoundingClientRect();
      setPosition(rect.left + rect.width * 0.5);
    });
  });
})();

/* ── 5. CONTACT FORM VALIDATION ───────────────────────────── */
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    let valid = true;

    // Clear previous error states
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.style.borderColor = '';
    });

    // Simple required-field check
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e53935';
        const err = document.createElement('span');
        err.className = 'form-error';
        err.style.cssText = 'color:#e53935;font-size:.78rem;margin-top:.25rem;';
        err.textContent = 'This field is required.';
        field.parentNode.appendChild(err);
      }
    });

    // Email format check
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(emailField.value.trim())) {
        valid = false;
        emailField.style.borderColor = '#e53935';
        const err = document.createElement('span');
        err.className = 'form-error';
        err.style.cssText = 'color:#e53935;font-size:.78rem;margin-top:.25rem;';
        err.textContent = 'Please enter a valid email address.';
        emailField.parentNode.appendChild(err);
      }
    }

    if (!valid) e.preventDefault();
  });
})();