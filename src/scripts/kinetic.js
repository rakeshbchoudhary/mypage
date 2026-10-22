/* ============================================================
   kinetic.js — Interactive Logic & Particle Stream Canvas
   Theme: Kinetic Stream (High-Throughput Data Flow)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ----------------------------------------------------------
     1. DYNAMIC YEAR
     ---------------------------------------------------------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     2. THEME TOGGLE (LIGHT / DARK)
     ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  var THEME_KEY = 'kinetic-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    if (themeToggle) {
      var icon = themeToggle.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.classList.remove('fa-adjust');
          icon.classList.add('fa-sun');
        } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-adjust');
        }
      }
    }
  }

  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = document.body.classList.contains('light-mode');
      var next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ----------------------------------------------------------
     3. SCROLL-REVEAL ANIMATION
     ---------------------------------------------------------- */
  var revealTargets = document.querySelectorAll('.anim-reveal');

  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     4. SIDE NAVIGATION — ACTIVE SECTION ON SCROLL
     ---------------------------------------------------------- */
  var sectionIds = [
    'hero', 'metrics', 'about', 'experience', 'case-studies',
    'skills', 'awards', 'certifications', 'projects', 'education', 'chillout'
  ];

  var sideNavLinks = document.querySelectorAll('#sideNav a[href^="#"]');

  function getActiveSection() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var winH = window.innerHeight;
    var active = sectionIds[0];

    for (var i = 0; i < sectionIds.length; i++) {
      var sec = document.getElementById(sectionIds[i]);
      if (!sec) continue;
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      if (scrollY + winH * 0.35 >= top && scrollY < top + height) {
        active = sectionIds[i];
      }
    }
    return active;
  }

  function updateSideNavActive() {
    var activeId = getActiveSection();
    sideNavLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateSideNavActive();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  updateSideNavActive();

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL & MOBILE MENU
     ---------------------------------------------------------- */
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  var sideNav = document.getElementById('sideNav');
  var hamburger = document.getElementById('hamburger');

  function closeMobileNav() {
    if (sideNav) sideNav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('active');
  }

  allAnchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
      closeMobileNav();
    });
  });

  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = sideNav && sideNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        if (sideNav) sideNav.classList.add('open');
        hamburger.classList.add('active');
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (!sideNav || !sideNav.classList.contains('open')) return;
    if (!sideNav.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
      closeMobileNav();
    }
  });

  /* ----------------------------------------------------------
     6. CERTIFICATE LIGHTBOX
     ---------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var certThumbs = document.querySelectorAll('.cert-thumb');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.setAttribute('src', src);
    lightbox.style.display = 'flex';
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.classList.remove('lightbox-open');
    if (lightboxImg) lightboxImg.setAttribute('src', '');
  }

  certThumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var img = this.querySelector('img');
      if (img) openLightbox(img.src);
    });

    thumb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        var img = this.querySelector('img');
        if (img) openLightbox(img.src);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && lightbox && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  /* ----------------------------------------------------------
     7. NUMBER COUNTER ANIMATION
     ---------------------------------------------------------- */
  var COUNTER_DURATION = 1500;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatWithCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = String(target).indexOf('.') !== -1;
    var decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / COUNTER_DURATION, 1);
      var current = easeOutExpo(progress) * target;

      if (isFloat) {
        el.textContent = prefix + formatWithCommas(current.toFixed(decimals)) + suffix;
      } else {
        el.textContent = prefix + formatWithCommas(Math.round(current)) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var counterEls = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterEls.length) {
    var counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     8. CGPA RING ANIMATION
     ---------------------------------------------------------- */
  var cgpaFill = document.querySelector('.cgpa-fill');
  if (cgpaFill) {
    var RADIUS = 44;
    var CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 276.46
    var CGPA_FRACTION = 9.02 / 10;
    var targetOffset = CIRCUMFERENCE * (1 - CGPA_FRACTION);

    cgpaFill.style.strokeDasharray = CIRCUMFERENCE;
    cgpaFill.style.strokeDashoffset = CIRCUMFERENCE;

    if ('IntersectionObserver' in window) {
      var cgpaObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              cgpaFill.style.strokeDashoffset = targetOffset;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      cgpaObserver.observe(cgpaFill);
    }
  }

  /* ----------------------------------------------------------
     9. KINETIC PARTICLE STREAM CANVAS
     ---------------------------------------------------------- */
  (function initKineticCanvas() {
    var canvas = document.getElementById('kineticStreamCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStreams();
    });

    var streamCount = 50;
    var streams = [];
    var palette = [
      'rgba(0, 245, 160, ',  // Mint
      'rgba(0, 217, 245, ',  // Cyan
      'rgba(255, 184, 0, '   // Amber
    ];

    function StreamPacket() {
      this.reset(true);
    }

    StreamPacket.prototype.reset = function (initial) {
      this.x = initial ? Math.random() * width : -100;
      this.y = Math.random() * height;
      this.length = 60 + Math.random() * 140;
      this.speed = 3 + Math.random() * 6;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.alpha = 0.2 + Math.random() * 0.5;
      this.thickness = 1 + Math.random() * 1.8;
    };

    StreamPacket.prototype.update = function () {
      this.x += this.speed;
      if (this.x - this.length > width) {
        this.reset(false);
      }
    };

    StreamPacket.prototype.draw = function () {
      var grad = ctx.createLinearGradient(this.x - this.length, this.y, this.x, this.y);
      grad.addColorStop(0, this.color + '0)');
      grad.addColorStop(0.7, this.color + this.alpha + ')');
      grad.addColorStop(1, this.color + (this.alpha + 0.3) + ')');

      ctx.beginPath();
      ctx.moveTo(this.x - this.length, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Lead packet photon
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.thickness + 0.8, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '1)';
      ctx.fill();
    };

    function initStreams() {
      streams = [];
      for (var i = 0; i < streamCount; i++) {
        streams.push(new StreamPacket());
      }
    }

    initStreams();

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < streams.length; i++) {
        streams[i].update();
        streams[i].draw();
      }
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  })();

});
