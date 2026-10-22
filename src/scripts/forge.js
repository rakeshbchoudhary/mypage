/* ============================================================
   forge.js — Portfolio Page Interactions
   Vanilla JS · No dependencies · ES5+ compatible
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
     Persists preference in localStorage under 'forge-theme'.
     ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  var THEME_KEY = 'forge-theme';

  /** Apply the given theme ('light' | 'dark') to the page. */
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    // Swap the toggle icon
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

  // Restore saved preference on load
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
     3. SCROLL-REVEAL ANIMATION
     IntersectionObserver adds 'revealed' once, then unobserves.
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
     4. SIDE NAVIGATION — ACTIVE STATE ON SCROLL
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

  /** Return the ID of the section currently most in view. */
  function getActiveSection() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var winH = window.innerHeight;
    var active = sectionIds[0]; // default to first

    for (var i = 0; i < sectionIds.length; i++) {
      var sec = document.getElementById(sectionIds[i]);
      if (!sec) continue;
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      // Consider a section "in view" when the viewport has scrolled
      // past 30 % of the way into it.
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

  // Throttle scroll handler for performance
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

  // Run once on load
  updateSideNavActive();

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL FOR ANCHOR LINKS
     On mobile, also closes the side-nav overlay.
     ---------------------------------------------------------- */
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  var sideNav = document.getElementById('sideNav');
  var hamburger = document.getElementById('hamburger');

  allAnchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });

      // Close mobile nav if open
      closeMobileNav();
    });
  });

  /* ----------------------------------------------------------
     6. MOBILE HAMBURGER MENU
     Toggles 'open' on #sideNav and 'active' on the hamburger.
     ---------------------------------------------------------- */
  function closeMobileNav() {
    if (sideNav) sideNav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('active');
  }

  function openMobileNav() {
    if (sideNav) sideNav.classList.add('open');
    if (hamburger) hamburger.classList.add('active');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = sideNav && sideNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!sideNav || !sideNav.classList.contains('open')) return;
    // If the click is outside the nav and outside the hamburger, close
    if (!sideNav.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
      closeMobileNav();
    }
  });

  /* ----------------------------------------------------------
     7. LIGHTBOX FOR CERTIFICATES
     Opens on click / Enter, closes on backdrop / X / Escape.
     ---------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var certThumbs = document.querySelectorAll('.cert-thumb');

  /** Open the lightbox with the given image source. */
  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.setAttribute('src', src);
    lightbox.style.display = 'flex';
    document.body.classList.add('lightbox-open');
  }

  /** Close the lightbox. */
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.classList.remove('lightbox-open');
    if (lightboxImg) lightboxImg.setAttribute('src', '');
  }

  certThumbs.forEach(function (thumb) {
    // Click handler
    thumb.addEventListener('click', function () {
      var img = this.querySelector('img');
      if (img) openLightbox(img.src);
    });

    // Keyboard accessibility (Enter key — elements with tabindex=0)
    thumb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        var img = this.querySelector('img');
        if (img) openLightbox(img.src);
      }
    });
  });

  // Close via X button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function () {
      closeLightbox();
    });
  }

  // Close via backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      // Only close when clicking the backdrop itself, not the image
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close via Escape key
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && lightbox && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  /* ----------------------------------------------------------
     8. COUNTER ANIMATION
     Animates data-counter elements from 0 → target over 1.5 s
     using an easeOutExpo curve.
     ---------------------------------------------------------- */
  var COUNTER_DURATION = 1500; // ms

  /** EaseOutExpo easing function. */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /** Format a number with commas (e.g. 1,234,567). */
  function formatWithCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /** Animate a single counter element. */
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
     9. CGPA RING ANIMATION
     Animates the SVG circle's stroke-dashoffset when it enters
     the viewport. r = 44 → C ≈ 276.46.
     CGPA = 9.02 / 10 → 90.2 % fill.
     ---------------------------------------------------------- */
  var cgpaFill = document.querySelector('.cgpa-fill');

  if (cgpaFill) {
    var RADIUS = 44;
    var CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 276.46
    var CGPA_FRACTION = 9.02 / 10;            // 0.902
    var targetOffset = CIRCUMFERENCE * (1 - CGPA_FRACTION);

    // Set initial state
    cgpaFill.style.strokeDasharray = CIRCUMFERENCE;
    cgpaFill.style.strokeDashoffset = CIRCUMFERENCE;

    if ('IntersectionObserver' in window) {
      var cgpaObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              // Allow CSS transition to handle the animation
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
     10. FEATURED PROJECT CARDS
     .project-card elements are already <a> tags — no extra
     click handling required.
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     11. TOOLTIP FOR SIDE NAV
     Handled entirely via CSS (::after pseudo-element using the
     data-tooltip attribute). No JavaScript needed.
     ---------------------------------------------------------- */

}); /* end DOMContentLoaded */
