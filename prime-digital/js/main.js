/* ================================================================
   PRIME DIGITAL — main.js
   Handles:
     1. Header scroll state
     2. Mobile navigation toggle
     3. Smooth scroll for anchor links
     4. Active nav link highlighting on scroll
     5. Scroll-reveal animations (IntersectionObserver)
     6. Contact form validation & submission feedback
     7. Footer year auto-update
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ——————————————————————————————————————————
     1. HEADER — add .scrolled class on scroll
  —————————————————————————————————————————— */
  const header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ——————————————————————————————————————————
     2. MOBILE NAVIGATION TOGGLE
  —————————————————————————————————————————— */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });


  /* ——————————————————————————————————————————
     3. SMOOTH SCROLLING for anchor links
        (fallback for browsers that don't support
         CSS scroll-behavior on all elements)
  —————————————————————————————————————————— */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ——————————————————————————————————————————
     4. ACTIVE NAV LINK HIGHLIGHTING
        Uses IntersectionObserver to track which
        section is currently in view
  —————————————————————————————————————————— */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px', // trigger when section is roughly in centre
    threshold: 0
  });

  sections.forEach(section => sectionObserver.observe(section));


  /* ——————————————————————————————————————————
     5. SCROLL-REVEAL ANIMATIONS
        Fades + slides up elements marked .reveal
        as they enter the viewport
  —————————————————————————————————————————— */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // Stagger child cards/steps within grids for a cascade effect
  const staggerParents = document.querySelectorAll(
    '.services__grid, .why__grid, .pricing__grid, .process__steps'
  );

  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });


  /* ——————————————————————————————————————————
     6. CONTACT FORM — validation & feedback
  —————————————————————————————————————————— */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('form-submit');
  const feedback   = document.getElementById('form-feedback');

  if (form) {

    // Helper: show field error
    function showError(fieldId, message) {
      const input = document.getElementById(fieldId);
      const error = document.getElementById(`${fieldId}-error`);
      if (input)  input.classList.add('error');
      if (error)  error.textContent = message;
    }

    // Helper: clear field error
    function clearError(fieldId) {
      const input = document.getElementById(fieldId);
      const error = document.getElementById(`${fieldId}-error`);
      if (input)  input.classList.remove('error');
      if (error)  error.textContent = '';
    }

    // Clear errors on input
    ['name', 'email', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => clearError(id));
      }
    });

    // Validate the form; returns true if valid
    function validate() {
      let valid = true;

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name) {
        showError('name', 'Please enter your name.');
        valid = false;
      }

      if (!email) {
        showError('email', 'Please enter your email address.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
      }

      if (!message) {
        showError('message', 'Please tell us about your project.');
        valid = false;
      } else if (message.length < 20) {
        showError('message', 'Please provide a little more detail (at least 20 characters).');
        valid = false;
      }

      return valid;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.className = 'form-feedback'; // reset state

      if (!validate()) return;

      // Show loading state
      const btnText    = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled      = true;
      btnText.style.display   = 'none';
      btnLoading.style.display = 'inline';

      // ——————————————————————————————————————
      // IMPORTANT: Replace this section with
      // your real form submission endpoint.
      // Options:
      //   - Formspree  (https://formspree.io)
      //   - EmailJS    (https://emailjs.com)
      //   - Your own backend API
      // ——————————————————————————————————————

      try {
        // Simulate async send (2s delay)
        // Replace with: await fetch('YOUR_ENDPOINT', { method: 'POST', ... })
        await new Promise(resolve => setTimeout(resolve, 1800));

        // SUCCESS
        form.reset();
        feedback.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.';
        feedback.classList.add('success');
        feedback.style.display = 'block';

      } catch (err) {
        // ERROR
        feedback.textContent = 'Something went wrong. Please try emailing us directly.';
        feedback.classList.add('error');
        feedback.style.display = 'block';

      } finally {
        // Restore button
        submitBtn.disabled       = false;
        btnText.style.display    = 'inline';
        btnLoading.style.display = 'none';

        // Scroll feedback into view
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }


  /* ——————————————————————————————————————————
     7. FOOTER — auto-update copyright year
  —————————————————————————————————————————— */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
