/**
 * View Transitions API and Scroll Progress
 * Provides smooth page transitions and scroll progress indicator
 */

(function() {
  'use strict';

  // Scroll Progress Indicator
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // View Transitions API (Progressive Enhancement)
  function initViewTransitions() {
    if (!('startViewTransition' in document)) return;

    document.addEventListener('click', async (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      // Skip external links, new tabs, and non-HTTP links
      if (link.target === '_blank') return;
      if (!link.href) return;
      if (!link.href.startsWith(location.origin)) return;
      if (link.href.includes('#') && link.href.split('#')[0] === location.href.split('#')[0]) return;

      e.preventDefault();

      try {
        await document.startViewTransition(async () => {
          const response = await fetch(link.href);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Update page content
          document.title = doc.title;
          const main = document.querySelector('main');
          const newMain = doc.querySelector('main');
          if (main && newMain) {
            main.innerHTML = newMain.innerHTML;
          }

          // Update URL
          history.pushState({}, '', link.href);

          // Re-initialize scroll reveal and canvas observers
          if (typeof initScrollReveal === 'function') {
            initScrollReveal();
          }
          if (typeof reinitCanvasObservers === 'function') {
            reinitCanvasObservers();
          }

          // Scroll to top on page change
          window.scrollTo(0, 0);
        }).finished;
      } catch (error) {
        // Fallback to normal navigation on error
        location.href = link.href;
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', async () => {
      try {
        await document.startViewTransition(async () => {
          const response = await fetch(location.href);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          document.title = doc.title;
          const main = document.querySelector('main');
          const newMain = doc.querySelector('main');
          if (main && newMain) {
            main.innerHTML = newMain.innerHTML;
          }

          // Re-initialize after back/forward navigation
          if (typeof initScrollReveal === 'function') {
            initScrollReveal();
          }
          if (typeof reinitCanvasObservers === 'function') {
            reinitCanvasObservers();
          }

          window.scrollTo(0, 0);
        }).finished;
      } catch (error) {
        location.reload();
      }
    });
  }

  // Enhanced Scroll Reveal with stagger
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal:not(.active)');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger delay based on index
          setTimeout(() => {
            entry.target.classList.add('active');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initViewTransitions();
    initScrollReveal();
  });

  // Expose for re-initialization after transitions
  window.initScrollReveal = initScrollReveal;
})();
