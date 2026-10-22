/* ============================================================
   cosmic.js — Celestial Constellation Canvas & Interactive Lineage
   Vanilla JS · Zero dependencies · 60 FPS Particle Astronomy
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
     2. CELESTIAL CONSTELLATION CANVAS (Signature Feature)
     Drifting starfield with interactive constellation lineage lines
     ---------------------------------------------------------- */
  var canvas = document.getElementById('cosmicCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var width = 0;
    var height = 0;
    var mouse = { x: -1000, y: -1000, active: false };

    var STAR_COUNT = 85;
    var CONNECT_DIST = 120;
    var MOUSE_DIST = 160;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      stars = [];
      var count = Math.floor((width * height) / 14000);
      var total = Math.min(Math.max(count, 45), 110);

      for (var i = 0; i < total; i++) {
        var isGold = Math.random() > 0.65;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          twinkleOffset: Math.random() * Math.PI * 2,
          isGold: isGold
        });
      }
    }

    var animTime = 0;
    function renderConstellations() {
      ctx.clearRect(0, 0, width, height);
      animTime += 0.02;

      // Update & Draw stars
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];

        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around viewport boundaries
        if (s.x < 0) s.x = width;
        else if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        else if (s.y > height) s.y = 0;

        // Mouse gravitational attraction (subtle)
        if (mouse.active) {
          var dx = mouse.x - s.x;
          var dy = mouse.y - s.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST && dist > 1) {
            var pull = (1 - dist / MOUSE_DIST) * 0.3;
            s.x += (dx / dist) * pull;
            s.y += (dy / dist) * pull;
          }
        }

        // Twinkle alpha
        var alpha = s.baseAlpha + Math.sin(animTime * 2 + s.twinkleOffset) * 0.2;
        alpha = Math.max(0.15, Math.min(alpha, 0.9));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        if (s.isGold) {
          ctx.fillStyle = 'rgba(243, 208, 121, ' + alpha + ')';
          ctx.shadowColor = 'rgba(243, 208, 121, 0.6)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(129, 140, 248, ' + alpha + ')';
          ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw constellation lines between close stars
      ctx.lineWidth = 0.65;
      for (var a = 0; a < stars.length; a++) {
        for (var b = a + 1; b < stars.length; b++) {
          var s1 = stars[a];
          var s2 = stars[b];
          var deltaX = s1.x - s2.x;
          var deltaY = s1.y - s2.y;
          var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance < CONNECT_DIST) {
            var lineAlpha = (1 - distance / CONNECT_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            if (s1.isGold || s2.isGold) {
              ctx.strokeStyle = 'rgba(243, 208, 121, ' + lineAlpha + ')';
            } else {
              ctx.strokeStyle = 'rgba(99, 102, 241, ' + lineAlpha + ')';
            }
            ctx.stroke();
          }
        }

        // Draw line to active mouse
        if (mouse.active) {
          var mdx = s1.x - mouse.x;
          var mdy = s1.y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < MOUSE_DIST) {
            var mAlpha = (1 - mdist / MOUSE_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(243, 208, 121, ' + mAlpha + ')';
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderConstellations);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    window.addEventListener('mouseleave', function () {
      mouse.active = false;
    });

    resizeCanvas();
    renderConstellations();
  }

  /* ----------------------------------------------------------
     3. THEME TOGGLE (LIGHT / COSMIC DEEP SPACE)
     ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  var THEME_KEY = 'cosmic-theme';

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
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = document.body.classList.contains('light-mode');
      var next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL-REVEAL OBSERVER
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
      { threshold: 0.12 }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ----------------------------------------------------------
     5. SIDE NAVIGATION — ACTIVE SECTION TRACKING
     ---------------------------------------------------------- */
  var sectionIds = [
    'hero',
    'metrics',
    'about',
    'experience',
    'case-studies',
    'skills',
    'awards',
    'certifications',
    'projects',
    'education',
    'chillout'
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
     6. MOBILE HAMBURGER & SMOOTH SCROLL
     ---------------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var sideNav = document.getElementById('sideNav');
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  if (hamburger && sideNav) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      sideNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (sideNav.classList.contains('open') && !sideNav.contains(e.target) && e.target !== hamburger) {
        sideNav.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  allAnchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (sideNav && sideNav.classList.contains('open')) {
          sideNav.classList.remove('open');
          if (hamburger) hamburger.classList.remove('active');
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     7. CERTIFICATE LIGHTBOX
     ---------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var certThumbs = document.querySelectorAll('.cert-thumb');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    if (lightboxImg) lightboxImg.src = '';
    document.body.classList.remove('lightbox-open');
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

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
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
     8. COUNTER ANIMATION
     ---------------------------------------------------------- */
  var COUNTER_DURATION = 1500;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatWithCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateCounter(el) {
    var rawVal = el.getAttribute('data-counter');
    var target = parseFloat(rawVal);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = rawVal.indexOf('.') !== -1;
    var decimals = isFloat ? (rawVal.split('.')[1] || '').length : 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / COUNTER_DURATION, 1);
      var easedProgress = easeOutExpo(progress);
      var current = easedProgress * target;

      if (isFloat) {
        el.textContent = prefix + formatWithCommas(current.toFixed(decimals)) + suffix;
      } else {
        el.textContent = prefix + formatWithCommas(Math.round(current)) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
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
     9. CELESTIAL ORBITAL CGPA GAUGE ANIMATION
     ---------------------------------------------------------- */
  var cgpaFill = document.querySelector('.cgpa-fill');
  if (cgpaFill) {
    var RADIUS = 44;
    var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
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
});
