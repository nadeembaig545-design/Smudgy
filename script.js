/* ========================================
   SMUDGY.IN — JAVASCRIPT
   Apple-smooth · Functional · Premium
======================================== */

(function () {
  'use strict';

  /* ===========================
     CURSOR
  =========================== */
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      if (!rafId) rafId = requestAnimationFrame(animateFollower);
    });

    function animateFollower() {
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      followerX += dx * 0.12;
      followerY += dy * 0.12;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      rafId = (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05)
        ? requestAnimationFrame(animateFollower)
        : null;
    }

    document.querySelectorAll('a, button, .product-card, .collection-item, .style-opt, .upload-zone').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ===========================
     LOADER
  =========================== */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderText = document.getElementById('loaderText');
  const loadingMessages = [
    'Brewing your creativity...',
    'Inking the pages...',
    'Pressing flowers...',
    'Almost ready...'
  ];
  let messageIdx = 0;
  let progress = 0;

  const progressInterval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      loaderProgress.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initReveal();
        animateHeroEntrance();
      }, 600);
    } else {
      loaderProgress.style.width = progress + '%';
      if (progress > 30 && messageIdx < 1) { messageIdx = 1; loaderText.textContent = loadingMessages[1]; }
      if (progress > 60 && messageIdx < 2) { messageIdx = 2; loaderText.textContent = loadingMessages[2]; }
      if (progress > 85 && messageIdx < 3) { messageIdx = 3; loaderText.textContent = loadingMessages[3]; }
    }
  }, 130);

  document.body.style.overflow = 'hidden';

  /* ===========================
     NAV SCROLL
  =========================== */
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 60);
        if (scrollY > lastScrollY && scrollY > 200) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        lastScrollY = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  nav.style.transition = 'background 0.5s cubic-bezier(0.25,0.46,0.45,0.94), backdrop-filter 0.5s, box-shadow 0.5s, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';

  /* ===========================
     MOBILE MENU
  =========================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = menuToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      document.body.style.overflow = 'hidden';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      menuToggle.querySelectorAll('span').forEach(s => s.style.transform = '');
      document.body.style.overflow = '';
    });
  });

  /* ===========================
     HERO ENTRANCE
  =========================== */
  function animateHeroEntrance() {
    const lines = document.querySelectorAll('.hero-line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('in-view'), 80 + i * 120);
    });
    setTimeout(() => document.querySelector('.hero-eyebrow')?.classList.add('in-view'), 50);
    document.querySelectorAll('.hero .reveal-text').forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), 200 + i * 150);
    });
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) setTimeout(() => heroTitle.classList.add('in-view'), 100);
  }

  /* ===========================
     SCROLL REVEAL — APPLE-SMOOTH
  =========================== */
  function initReveal() {
    const targets = document.querySelectorAll(
      '.reveal-text, .reveal-card, .reveal-line, .reveal-collection, .section-title, .about-body, .about-stats'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const cards = [...document.querySelectorAll('.reveal-card')];
          const collections = [...document.querySelectorAll('.reveal-collection')];

          if (el.classList.contains('reveal-card')) {
            const idx = cards.indexOf(el);
            el.style.transitionDelay = ((idx % 3) * 100) + 'ms';
          }
          if (el.classList.contains('reveal-collection')) {
            const idx = collections.indexOf(el);
            el.style.transitionDelay = (idx * 90) + 'ms';
          }

          el.classList.add('in-view');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  /* ===========================
     PARALLAX HERO
  =========================== */
  const heroContent = document.getElementById('heroContent');
  let heroTicking = false;

  window.addEventListener('scroll', () => {
    if (!heroTicking && heroContent) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const progress = Math.min(scrollY / vh, 1);
        heroContent.style.transform = `translateY(${scrollY * 0.22}px)`;
        heroContent.style.opacity = Math.max(0, 1 - progress * 1.4);
        heroTicking = false;
      });
      heroTicking = true;
    }
  }, { passive: true });

  /* ===========================
     PARALLAX FLOATERS
  =========================== */
  const floaters = document.querySelectorAll('.floater');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    floaters.forEach(f => {
      const depth = parseFloat(f.dataset.depth) || 0.3;
      f.style.transform = `translateY(${scrollY * depth * 0.3}px)`;
    });
  }, { passive: true });

  /* ===========================
     SMOOTH SCROLL
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===========================
     PRODUCT CARD TILT
  =========================== */
  document.querySelectorAll('.product-card').forEach(card => {
    const imgWrap = card.querySelector('.product-img-wrap');
    if (!imgWrap) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      imgWrap.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      imgWrap.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      imgWrap.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      setTimeout(() => imgWrap.style.transition = '', 600);
    });

    card.addEventListener('mouseenter', () => {
      imgWrap.style.transition = '';
    });
  });

  /* ===========================
     QUICK ADD / CART
  =========================== */
  const cartCount = document.getElementById('cartCount');
  const cartToast = document.getElementById('cartToast');
  const toastText = document.getElementById('toastText');
  let cartItems = 0;
  let toastTimeout;

  document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name || 'Item';
      const original = btn.textContent;

      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      cartItems++;
      cartCount.textContent = cartItems;
      cartCount.classList.add('bump');
      setTimeout(() => cartCount.classList.remove('bump'), 400);

      // Toast
      toastText.textContent = `${name} added to cart!`;
      cartToast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => cartToast.classList.remove('show'), 2800);

      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('added');
      }, 1800);
    });
  });

  /* ===========================
     NEWSLETTER
  =========================== */
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('.newsletter-btn');
      btn.textContent = 'Thank you! ✓';
      btn.style.background = '#5a3a10';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe →';
        btn.style.background = '';
      }, 3000);
    });
  }

  /* ===========================
     TICKER PAUSE
  =========================== */
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
    tickerTrack.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
  }

  /* ===========================
     COLLECTION HOVER
  =========================== */
  document.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('mouseenter', () => item.style.background = 'rgba(255,255,255,0.04)');
    item.addEventListener('mouseleave', () => item.style.background = '');
  });

  /* ===========================
     MAKE IT YOURS — FULL STUDIO
  =========================== */
  const photoUpload = document.getElementById('photoUpload');
  const uploadZone = document.getElementById('uploadZone');
  const studioStep1 = document.getElementById('studioStep1');
  const studioStep2 = document.getElementById('studioStep2');
  const studioStep3 = document.getElementById('studioStep3');
  const cropImage = document.getElementById('cropImage');
  const cropViewport = document.getElementById('cropViewport');
  const zoomSlider = document.getElementById('zoomSlider');
  const calendarCanvas = document.getElementById('calendarCanvas');
  const monthSelect = document.getElementById('monthSelect');
  const captionInput = document.getElementById('captionInput');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const orderCustomBtn = document.getElementById('orderCustomBtn');
  const applyCrop = document.getElementById('applyCrop');
  const cancelCrop = document.getElementById('cancelCrop');
  const backToCrop = document.getElementById('backToCrop');

  let uploadedImage = null;
  let croppedImageData = null;
  let currentStyle = 'classic';
  let cropState = { scale: 1, x: 0, y: 0, isDragging: false, startX: 0, startY: 0 };
  let cropRatio = 1;

  const styles = {
    classic: {
      bg: '#f5ede0',
      headerBg: '#5a3a10',
      headerText: '#f5ede0',
      gridLine: '#c4a882',
      dayText: '#a08060',
      dateText: '#2a2018',
      hlCircle: '#c4a882',
      monthText: '#5a3a10',
      border: '#c4a882',
      accent: '#8b6030'
    },
    minimal: {
      bg: '#ffffff',
      headerBg: '#f8f8f8',
      headerText: '#222222',
      gridLine: '#e0e0e0',
      dayText: '#aaaaaa',
      dateText: '#333333',
      hlCircle: '#333333',
      monthText: '#111111',
      border: '#eeeeee',
      accent: '#555555'
    },
    vintage: {
      bg: '#f0e6d4',
      headerBg: '#8b6030',
      headerText: '#f5ede0',
      gridLine: '#c9a87c',
      dayText: '#8b6030',
      dateText: '#3d2018',
      hlCircle: '#8b6030',
      monthText: '#3d2018',
      border: '#c9a87c',
      accent: '#5a3010'
    },
    botanical: {
      bg: '#f5f0e8',
      headerBg: '#4a7a5a',
      headerText: '#ffffff',
      gridLine: '#9ab89a',
      dayText: '#6a9870',
      dateText: '#2a3a20',
      hlCircle: '#5a8a5a',
      monthText: '#2a3a20',
      border: '#8ab88a',
      accent: '#3a6a3a'
    },
    dark: {
      bg: '#1a1410',
      headerBg: '#2a2018',
      headerText: '#c4a882',
      gridLine: '#3d2e1a',
      dayText: '#7a5a30',
      dateText: '#e8d5bc',
      hlCircle: '#c4a882',
      monthText: '#c4a882',
      border: '#3d2e1a',
      accent: '#c4a882'
    },
    watercolor: {
      bg: '#faf6f0',
      headerBg: '#d4b8a0',
      headerText: '#3d2018',
      gridLine: '#e8d8c8',
      dayText: '#b89878',
      dateText: '#3d2018',
      hlCircle: '#c8a888',
      monthText: '#3d2018',
      border: '#e0c8b0',
      accent: '#a87858'
    }
  };

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragging');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileLoad(file);
  });

  photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileLoad(file);
  });

  function handleFileLoad(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadedImage = new Image();
      uploadedImage.onload = () => {
        // Go to crop step
        studioStep1.classList.add('hidden');
        studioStep2.classList.remove('hidden');
        studioStep3.classList.add('hidden');

        cropImage.src = ev.target.result;
        cropState = { scale: 1, x: 0, y: 0, isDragging: false, startX: 0, startY: 0 };
        zoomSlider.value = 100;
        resetCropPosition();
      };
      uploadedImage.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function resetCropPosition() {
    cropImage.style.transform = '';
    cropImage.style.left = '50%';
    cropImage.style.top = '50%';
    cropImage.style.transform = `translate(-50%, -50%) scale(${cropState.scale})`;
  }

  // Crop interactions
  let lastPointerX = 0, lastPointerY = 0;

  cropViewport.addEventListener('pointerdown', (e) => {
    cropState.isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    cropViewport.setPointerCapture(e.pointerId);
  });

  cropViewport.addEventListener('pointermove', (e) => {
    if (!cropState.isDragging) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    cropState.x += dx;
    cropState.y += dy;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    applyCropTransform();
  });

  cropViewport.addEventListener('pointerup', () => cropState.isDragging = false);
  cropViewport.addEventListener('pointercancel', () => cropState.isDragging = false);

  cropViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    cropState.scale = Math.max(0.5, Math.min(3, cropState.scale + delta));
    zoomSlider.value = Math.round(cropState.scale * 100);
    applyCropTransform();
  }, { passive: false });

  zoomSlider.addEventListener('input', () => {
    cropState.scale = zoomSlider.value / 100;
    applyCropTransform();
  });

  function applyCropTransform() {
    cropImage.style.transform = `translate(calc(-50% + ${cropState.x}px), calc(-50% + ${cropState.y}px)) scale(${cropState.scale})`;
  }

  document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cropRatio = parseFloat(btn.dataset.ratio);
      const cropFrame = document.querySelector('.crop-frame');
      if (cropRatio > 1) {
        cropFrame.style.top = '25%'; cropFrame.style.bottom = '25%';
        cropFrame.style.left = '10%'; cropFrame.style.right = '10%';
      } else if (cropRatio < 1) {
        cropFrame.style.top = '10%'; cropFrame.style.bottom = '10%';
        cropFrame.style.left = '20%'; cropFrame.style.right = '20%';
      } else {
        cropFrame.style.top = '15%'; cropFrame.style.bottom = '15%';
        cropFrame.style.left = '15%'; cropFrame.style.right = '15%';
      }
    });
  });

  cancelCrop.addEventListener('click', () => {
    studioStep1.classList.remove('hidden');
    studioStep2.classList.add('hidden');
    photoUpload.value = '';
  });

  applyCrop.addEventListener('click', () => {
    // Capture cropped region from viewport
    const canvas = document.createElement('canvas');
    const vw = cropViewport.clientWidth;
    const vh = cropViewport.clientHeight;
    const cropFrame = document.querySelector('.crop-frame');
    const cf = cropFrame.getBoundingClientRect();
    const vf = cropViewport.getBoundingClientRect();

    const cropX = cf.left - vf.left;
    const cropY = cf.top - vf.top;
    const cropW = cf.width;
    const cropH = cf.height;

    canvas.width = cropW * 2;
    canvas.height = cropH * 2;
    const ctx = canvas.getContext('2d');

    // Get image bounds
    const imgBounds = cropImage.getBoundingClientRect();
    const imgX = imgBounds.left - vf.left;
    const imgY = imgBounds.top - vf.top;
    const imgW = imgBounds.width;
    const imgH = imgBounds.height;

    // Scale factor from displayed to natural
    const scaleX = uploadedImage.naturalWidth / imgW;
    const scaleY = uploadedImage.naturalHeight / imgH;

    const srcX = (cropX - imgX) * scaleX;
    const srcY = (cropY - imgY) * scaleY;
    const srcW = cropW * scaleX;
    const srcH = cropH * scaleY;

    ctx.drawImage(
      uploadedImage,
      Math.max(0, srcX), Math.max(0, srcY),
      Math.min(srcW, uploadedImage.naturalWidth), Math.min(srcH, uploadedImage.naturalHeight),
      0, 0, canvas.width, canvas.height
    );

    croppedImageData = canvas.toDataURL('image/jpeg', 0.92);

    studioStep2.classList.add('hidden');
    studioStep3.classList.remove('hidden');
    renderCalendarPreview();
  });

  backToCrop.addEventListener('click', () => {
    studioStep3.classList.add('hidden');
    studioStep2.classList.remove('hidden');
  });

  // Style selection
  document.querySelectorAll('.style-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.style-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      currentStyle = opt.dataset.style;
      renderCalendarPreview();
    });
  });

  monthSelect.addEventListener('change', renderCalendarPreview);
  captionInput.addEventListener('input', renderCalendarPreview);

  // Surprise Me
  const styleKeys = Object.keys(styles);
  const months = Array.from(monthSelect.options).map(o => o.value);
  const captions = [
    'My favourite memory ✦', 'Good vibes only ✿', 'Slow living ♡',
    'Memories, pressed like flowers', 'Golden hour ★', 'Wander, always.',
    'Created with love', 'Hyderabad moments', 'Cherish this.'
  ];

  surpriseBtn.addEventListener('click', () => {
    const randStyle = styleKeys[Math.floor(Math.random() * styleKeys.length)];
    const randMonth = months[Math.floor(Math.random() * months.length)];
    const randCaption = captions[Math.floor(Math.random() * captions.length)];

    currentStyle = randStyle;
    monthSelect.value = randMonth;
    captionInput.value = randCaption;

    document.querySelectorAll('.style-opt').forEach(o => {
      o.classList.toggle('active', o.dataset.style === randStyle);
    });

    surpriseBtn.textContent = '✦ Surprise!';
    surpriseBtn.style.transform = 'scale(1.1) rotate(2deg)';
    setTimeout(() => {
      surpriseBtn.textContent = '✦ Surprise Me!';
      surpriseBtn.style.transform = '';
    }, 600);

    renderCalendarPreview();
  });

  // Download
  downloadBtn.addEventListener('click', () => {
    if (!calendarCanvas) return;
    const link = document.createElement('a');
    link.download = 'smudgy-calendar.png';
    link.href = calendarCanvas.toDataURL('image/png');
    link.click();
  });

  // Order custom
  orderCustomBtn.addEventListener('click', () => {
    window.open('https://wa.me/919963913254?text=Hi!%20I%20want%20to%20order%20a%20custom%20Smudgy%20calendar%20with%20my%20photo.%20Please%20help!', '_blank');
  });

  /* ===========================
     CALENDAR CANVAS RENDERER
  =========================== */
  function renderCalendarPreview() {
    if (!calendarCanvas) return;
    const ctx = calendarCanvas.getContext('2d');
    const W = 600, H = 800;
    const s = styles[currentStyle] || styles.classic;
    const monthStr = monthSelect ? monthSelect.value : 'January 2026';
    const caption = captionInput ? captionInput.value : '';

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, W, H);

    // Draw photo as background (top 55%)
    const photoH = Math.round(H * 0.55);

    if (croppedImageData) {
      const img = new Image();
      img.onload = () => {
        drawCalendarWithImage(ctx, img, W, H, photoH, s, monthStr, caption);
      };
      img.src = croppedImageData;
    } else {
      drawCalendarNoImage(ctx, W, H, photoH, s, monthStr, caption);
    }
  }

  function drawCalendarWithImage(ctx, img, W, H, photoH, s, monthStr, caption) {
    // Photo area
    ctx.save();
    roundRect(ctx, 0, 0, W, photoH, 0);
    ctx.clip();

    // Apply style filter via compositing
    ctx.drawImage(img, 0, 0, W, photoH);

    // Style overlays
    applyStyleOverlay(ctx, currentStyle, W, photoH);

    ctx.restore();

    // Calendar body
    drawCalendarBody(ctx, W, H, photoH, s, monthStr, caption);
  }

  function drawCalendarNoImage(ctx, W, H, photoH, s, monthStr, caption) {
    // Placeholder gradient
    const grd = ctx.createLinearGradient(0, 0, W, photoH);
    grd.addColorStop(0, '#e8d5bc');
    grd.addColorStop(1, '#c9a87c');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, photoH);

    // Placeholder text
    ctx.fillStyle = 'rgba(90,58,16,0.3)';
    ctx.font = '900 120px serif';
    ctx.textAlign = 'center';
    ctx.fillText('smudgy.', W / 2, photoH / 2 + 20);

    drawCalendarBody(ctx, W, H, photoH, s, monthStr, caption);
  }

  function applyStyleOverlay(ctx, style, W, H) {
    const overlays = {
      classic: () => {
        ctx.fillStyle = 'rgba(90,58,16,0.08)';
        ctx.fillRect(0, 0, W, H);
      },
      minimal: () => {
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(0, 0, W, H);
      },
      vintage: () => {
        const grd = ctx.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, 'rgba(139,96,48,0.25)');
        grd.addColorStop(1, 'rgba(90,58,16,0.35)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(200,180,160,0.15)';
        ctx.fillRect(0, 0, W, H);
      },
      botanical: () => {
        ctx.fillStyle = 'rgba(74,122,90,0.2)';
        ctx.fillRect(0, 0, W, H);
        // Botanical vignette
        const radGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.7);
        radGrad.addColorStop(0, 'rgba(74,122,90,0)');
        radGrad.addColorStop(1, 'rgba(30,60,30,0.4)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);
      },
      dark: () => {
        ctx.fillStyle = 'rgba(10,8,5,0.45)';
        ctx.fillRect(0, 0, W, H);
        const radGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, H*0.7);
        radGrad.addColorStop(0, 'rgba(196,168,130,0.05)');
        radGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);
      },
      watercolor: () => {
        ctx.fillStyle = 'rgba(212,184,160,0.2)';
        ctx.fillRect(0, 0, W, H);
        // Watercolor blur-like edges
        for (let i = 0; i < 5; i++) {
          const radGrad = ctx.createRadialGradient(
            Math.random() * W, Math.random() * H, 0,
            Math.random() * W, Math.random() * H, 150
          );
          radGrad.addColorStop(0, 'rgba(200,170,140,0.15)');
          radGrad.addColorStop(1, 'rgba(200,170,140,0)');
          ctx.fillStyle = radGrad;
          ctx.fillRect(0, 0, W, H);
        }
      }
    };
    if (overlays[style]) overlays[style]();
  }

  function drawCalendarBody(ctx, W, H, photoH, s, monthStr, caption) {
    const calY = photoH;
    const calH = H - photoH;
    const pad = 28;

    // Calendar background
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, calY, W, calH);

    // Top border line
    ctx.strokeStyle = s.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, calY);
    ctx.lineTo(W, calY);
    ctx.stroke();

    // Month header area
    const headerH = 70;
    ctx.fillStyle = s.headerBg;
    ctx.fillRect(0, calY, W, headerH);

    // Month text
    ctx.fillStyle = s.headerText;
    ctx.font = `300 26px 'Cormorant Garamond', 'Fraunces', serif`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.1em';
    ctx.fillText(monthStr.toUpperCase(), W / 2, calY + 44);

    // Day labels
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const colW = (W - pad * 2) / 7;
    const dayY = calY + headerH + 36;

    ctx.font = `300 10px 'Jost', sans-serif`;
    ctx.fillStyle = s.dayText;
    days.forEach((d, i) => {
      const x = pad + colW * i + colW / 2;
      ctx.fillText(d, x, dayY);
    });

    // Separator line
    ctx.strokeStyle = s.gridLine;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(pad, dayY + 10);
    ctx.lineTo(W - pad, dayY + 10);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Calculate dates for the month
    const [monthName, year] = monthStr.split(' ');
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthIdx = monthNames.indexOf(monthName);
    const firstDay = new Date(parseInt(year), monthIdx, 1);
    const totalDays = new Date(parseInt(year), monthIdx + 1, 0).getDate();
    // Monday=0 offset
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const rowH = 36;
    let dateNum = 1;
    const today = new Date();
    const isCurrentMonth = today.getMonth() === monthIdx && today.getFullYear() === parseInt(year);

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cellIdx = row * 7 + col;
        if (cellIdx < startOffset || dateNum > totalDays) continue;

        const x = pad + colW * col + colW / 2;
        const y = dayY + 30 + rowH * row + rowH / 2;
        const isToday = isCurrentMonth && today.getDate() === dateNum;
        const isSunday = col === 6;

        if (isToday) {
          ctx.beginPath();
          ctx.arc(x, y - 5, 14, 0, Math.PI * 2);
          ctx.fillStyle = s.hlCircle;
          ctx.globalAlpha = 0.25;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.font = `${isToday ? '600' : '300'} 15px 'Cormorant Garamond', serif`;
        ctx.fillStyle = isSunday ? (currentStyle === 'dark' ? '#c4a882' : s.accent) : s.dateText;
        ctx.fillText(dateNum, x, y);
        dateNum++;
      }
    }

    // Caption
    if (caption) {
      ctx.font = `italic 300 14px 'Cormorant Garamond', serif`;
      ctx.fillStyle = s.dayText;
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.7;
      ctx.fillText(caption, W / 2, H - 18);
      ctx.globalAlpha = 1;
    }

    // Smudgy branding
    ctx.font = `300 11px 'Jost', sans-serif`;
    ctx.fillStyle = s.dayText;
    ctx.globalAlpha = 0.4;
    ctx.textAlign = 'right';
    ctx.fillText('smudgy.in', W - pad, H - 18);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ===========================
     APPLE-STYLE SECTION TRANSITIONS
     Intersection-based stagger
  =========================== */
  function initAppleScrollEffects() {
    // Sections fade + lift on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.products, .collections, .make-it-yours, .about, .testimonials, .newsletter').forEach(sec => {
      sectionObserver.observe(sec);
    });
  }

  /* ===========================
     NAV LINK CURSOR EFFECT
  =========================== */
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    link.addEventListener('mouseleave', () => {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  /* ===========================
     STICKY PRODUCTS LABEL
  =========================== */
  const stickyLabel = document.querySelector('.products-sticky-label');
  if (stickyLabel) {
    const productsSection = document.getElementById('products');
    const stickyObs = new IntersectionObserver(([entry]) => {
      stickyLabel.style.opacity = entry.isIntersecting ? '0.6' : '0';
    }, { threshold: 0.05 });
    if (productsSection) stickyObs.observe(productsSection);
  }

  /* ===========================
     ABOUT SECTION — counter animation
  =========================== */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1500;
    const step = 16;
    const totalSteps = duration / step;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      el.textContent = Math.round(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, step);
  }

  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const nums = document.querySelectorAll('.stat-num');
      if (nums[0]) animateCounter(nums[0], 2000, '+');
      if (nums[1]) animateCounter(nums[1], 50, '+');
      if (nums[2]) { nums[2].textContent = '100%'; }
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.about-stats');
  if (statsEl) statsObserver.observe(statsEl);

  /* ===========================
     EASTER EGG: Konami code
  =========================== */
  const konamiCode = [38,38,40,40,37,39,37,39,66,65];
  let konamiIdx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiCode.length) {
        konamiIdx = 0;
        // Ink splash easter egg
        document.body.style.filter = 'sepia(0.5) saturate(1.5)';
        document.title = '🎉 Smudgy loves you!';
        setTimeout(() => {
          document.body.style.filter = '';
          document.title = 'Smudgy — Premium Stationery';
        }, 2000);
      }
    } else {
      konamiIdx = 0;
    }
  });

  /* ===========================
     INIT
  =========================== */
  window.addEventListener('DOMContentLoaded', () => {
    initAppleScrollEffects();
    renderCalendarPreview(); // Render blank calendar on load
  });

})();
