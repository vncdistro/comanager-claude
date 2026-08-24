/* ============================================================================
   Comanager — component behaviors (vanilla, no dependencies)

   Progressive enhancement: every component renders and is usable without JS.
   This script only adds motion and interactivity. It is fully declarative —
   you wire behavior in HTML with data-* attributes, never by editing this file.

   Behaviors:
     .reveal               → fades/slides in when scrolled into view
     [data-carousel]       → rotating quote carousel (auto-advance + dots)
     [data-open-waitlist]  → opens the #waitlist modal (any button/link)
     .modal-scrim          → close on backdrop click / Esc; email validation
   ============================================================================ */
(function () {
  'use strict';
  var ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  /* ---- Reveal on scroll ------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Quote carousel --------------------------------------------------- */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (stage) {
      var cards = Array.prototype.slice.call(stage.querySelectorAll('.q-card'));
      var n = cards.length;
      if (n < 2) return;
      var dotsWrap = stage.parentElement.querySelector('[data-dots]');
      var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('[data-on]')) : [];
      var active = 0, paused = false, timer = null;
      var interval = parseInt(stage.getAttribute('data-interval'), 10) || 4800;

      function place() {
        cards.forEach(function (card, i) {
          var rel = ((i - active) % n + n) % n; // 0 center, 1 right, n-1 left
          var x = 0, rot = 0, scale = 1, op = 1, z = 5, blur = 0, pe = 'auto';
          if (rel === 1) { x = 300; rot = 6; scale = 0.88; op = 0.66; z = 3; blur = 1; }
          else if (rel === n - 1) { x = -300; rot = -6; scale = 0.88; op = 0.66; z = 3; blur = 1; }
          else if (rel !== 0) {
            // Only the two immediate neighbours peek; every other card waits
            // hidden off to the side it will slide in from. Without this, all
            // non-adjacent cards pile at one position and their text overlaps.
            var fromRight = rel <= n / 2;
            x = fromRight ? 360 : -360; rot = fromRight ? 8 : -8;
            scale = 0.8; op = 0; z = 0; blur = 2; pe = 'none';
          }
          card.style.transform = 'translate(-50%,-50%) translateX(' + x + 'px) rotate(' + rot + 'deg) scale(' + scale + ')';
          card.style.opacity = op;
          card.style.zIndex = z;
          card.style.filter = blur ? 'blur(' + blur + 'px)' : 'none';
          card.style.pointerEvents = pe;
        });
        dots.forEach(function (d, i) { d.setAttribute('data-on', i === active ? '1' : '0'); });
      }
      function go(i) { active = ((i % n) + n) % n; place(); }
      function start() { stop(); if (!paused) timer = setInterval(function () { go(active + 1); }, interval); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }

      cards.forEach(function (card, i) { card.addEventListener('click', function () { go(i); start(); }); });
      dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });
      stage.addEventListener('mouseenter', function () { paused = true; stop(); });
      stage.addEventListener('mouseleave', function () { paused = false; start(); });

      place();
      start();
    });
  }

  /* ---- Waitlist modal --------------------------------------------------- */
  function initModal() {
    var modal = document.getElementById('waitlist');
    if (!modal) return;
    var form = modal.querySelector('form');
    var formView = modal.querySelector('[data-modal-form]');
    var okView = modal.querySelector('[data-modal-ok]');
    var input = modal.querySelector('input[type="email"]');
    var errMsg = modal.querySelector('.err-msg');
    var okEmail = modal.querySelector('[data-ok-email]');
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function open() {
      modal.hidden = false;
      if (input) { input.value = ''; input.classList.remove('err'); }
      if (errMsg) errMsg.hidden = true;
      if (formView) formView.hidden = false;
      if (okView) okView.hidden = true;
      if (input) setTimeout(function () { input.focus(); }, 30);
    }
    function close() { modal.hidden = true; }

    document.querySelectorAll('[data-open-waitlist]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    modal.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); close(); });
    });
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = (input && input.value || '').trim();
        if (!EMAIL.test(val)) {
          if (input) input.classList.add('err');
          if (errMsg) errMsg.hidden = false;
          return;
        }
        if (okEmail) okEmail.textContent = val;
        if (formView) formView.hidden = true;
        if (okView) okView.hidden = false;
      });
      if (input) input.addEventListener('input', function () {
        input.classList.remove('err');
        if (errMsg) errMsg.hidden = true;
      });
    }
  }

  ready(function () { initReveal(); initCarousels(); initModal(); });
})();
