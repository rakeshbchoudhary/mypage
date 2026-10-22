/* ============================================================
   monolith.js — Architectural CAD & Blueprint Interactions
   Vanilla JS · Zero dependencies · High Performance
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
     2. BLUEPRINT SCHEMATIC MODE TOGGLE (Signature Monolith Feature)
     Switches visual language to technical blueprint cyan CAD grid
     ---------------------------------------------------------- */
  var bpBtn = document.getElementById('blueprintToggle');
  var mobileBpBtn = document.getElementById('mobileBlueprintToggle');
  var BP_STORAGE_KEY = 'monolith-blueprint';

  function applyBlueprintMode(enable) {
    if (enable) {
      document.body.classList.add('blueprint-mode');
    } else {
      document.body.classList.remove('blueprint-mode');
    }
    [bpBtn, mobileBpBtn].forEach(function (btn) {
      if (!btn) return;
      var icon = btn.querySelector('i');
      if (icon) {
        if (enable) {
          icon.className = 'fas fa-drafting-compass';
          btn.setAttribute('title', 'Return to Monolith Charcoal Mode');
        } else {
          icon.className = 'fas fa-cube';
          btn.setAttribute('title', 'Toggle Blueprint Schematic CAD Mode');
        }
      }
    });
  }

  // Restore blueprint preference
  var savedBp = localStorage.getItem(BP_STORAGE_KEY);
  if (savedBp === 'active') {
    applyBlueprintMode(true);
  }

  function handleBpToggle() {
    var isBp = document.body.classList.contains('blueprint-mode');
    var next = !isBp;
    applyBlueprintMode(next);
    localStorage.setItem(BP_STORAGE_KEY, next ? 'active' : 'inactive');
  }

  if (bpBtn) bpBtn.addEventListener('click', handleBpToggle);
  if (mobileBpBtn) mobileBpBtn.addEventListener('click', handleBpToggle);

  /* ----------------------------------------------------------
     3. THEME TOGGLE (LIGHT / MONOLITH DARK)
     ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  var THEME_KEY = 'monolith-theme';

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
     9. CGPA CIRCULAR CAD GAUGE ANIMATION
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
