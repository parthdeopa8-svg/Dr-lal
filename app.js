/* =========================================================
   Dr Lal PathLabs – JavaScript: Interactions & Animations
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────── NAVBAR SCROLL ────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ──────────────── HAMBURGER MENU ────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ──────────────── SCROLL ANIMATIONS ────────────────
  const animateEls = document.querySelectorAll('.animate-up, .animate-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animateEls.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // ──────────────── HERO METRIC BAR ANIMATION ────────────────
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.metric-fill').forEach(fill => {
          const targetWidth = fill.style.width;
          fill.style.width = '0%';
          setTimeout(() => { fill.style.width = targetWidth; }, 400);
        });
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const reportMockup = document.querySelector('.health-report-mockup');
  if (reportMockup) heroObserver.observe(reportMockup);

  // ──────────────── TESTIMONIALS SLIDER ────────────────
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track) {
    const cards     = track.querySelectorAll('.testimonial-card');
    const total     = cards.length;
    let current     = 0;
    let autoTimer   = null;

    // Decide cards per view based on screen
    const cardsPerView = () => window.innerWidth <= 768 ? 1 : 2;

    // Build dots
    const buildDots = () => {
      dotsEl.innerHTML = '';
      const pages = Math.ceil(total / cardsPerView());
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to review page ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      }
    };

    const goTo = (page) => {
      const perView = cardsPerView();
      const pages   = Math.ceil(total / perView);
      current       = Math.max(0, Math.min(page, pages - 1));

      // Compute offset: each card takes up (100/perView)% of track width + gap
      const cardW = cards[0].getBoundingClientRect().width + 24; // 24px gap
      track.style.transform = `translateX(-${current * perView * cardW}px)`;

      dotsEl.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    const advance = () => {
      const pages = Math.ceil(total / cardsPerView());
      goTo((current + 1) % pages);
    };

    const startAuto = () => { autoTimer = setInterval(advance, 4500); };
    const stopAuto  = () => clearInterval(autoTimer);

    prevBtn.addEventListener('click', () => { stopAuto(); const p = Math.ceil(total / cardsPerView()); goTo((current - 1 + p) % p); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); advance(); startAuto(); });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        const p = Math.ceil(total / cardsPerView());
        diff > 0 ? goTo((current + 1) % p) : goTo((current - 1 + p) % p);
      }
      startAuto();
    });

    buildDots();
    startAuto();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }

  // ──────────────── SMOOTH ANCHOR SCROLL ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ──────────────── STAGGERED CARD ANIMATION ────────────────
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, parseFloat(entry.target.style.animationDelay || 0) * 1000);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });

  // ──────────────── MAP WIDGET INTERACTIVE ────────────────
  const mapWidget = document.querySelector('.map-widget');
  if (mapWidget) {
    mapWidget.addEventListener('mouseenter', () => {
      mapWidget.style.transform = 'scale(1.01)';
      mapWidget.style.transition = 'transform 0.4s ease';
    });
    mapWidget.addEventListener('mouseleave', () => {
      mapWidget.style.transform = 'scale(1)';
    });
  }

  // ──────────────── FAB SHOW/HIDE ON SCROLL ────────────────
  const fab = document.getElementById('fabCall');
  if (fab) {
    window.addEventListener('scroll', () => {
      const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
      if (window.scrollY > heroHeight * 0.7) {
        fab.style.opacity = '1';
        fab.style.transform = 'scale(1)';
        fab.style.pointerEvents = 'auto';
      } else {
        fab.style.opacity = '0';
        fab.style.transform = 'scale(0.85)';
        fab.style.pointerEvents = 'none';
      }
    }, { passive: true });
    fab.style.opacity = '0';
    fab.style.transform = 'scale(0.85)';
    fab.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    fab.style.pointerEvents = 'none';
  }

  // ──────────────── SERVICE CARD HOVER RIPPLE ────────────────
  document.querySelectorAll('.service-card, .btn').forEach(el => {
    el.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%; background:rgba(255,255,255,0.35);
        transform:scale(0); animation:ripple 0.6s linear; pointer-events:none;
        left:${e.offsetX - 20}px; top:${e.offsetY - 20}px;
        width:40px; height:40px;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes ripple { to { transform: scale(8); opacity: 0; } }`;
  document.head.appendChild(styleTag);

  console.log('%c Dr Lal PathLabs – Patient Service Centre ', 'background:#0B3C5D;color:white;padding:8px 16px;border-radius:4px;font-weight:bold;');
  console.log('%c Mallital, Nainital · +91 80 3724 1265 ', 'color:#00B4D8;font-weight:600;');
});
