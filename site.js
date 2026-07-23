/* Studio site — tiny progressive-enhancement script.
   No dependencies. Handles: theme toggle (persisted), mobile nav,
   sticky-nav shadow, and scroll-reveal. Everything degrades gracefully
   if JS is off (content is fully visible, links work). */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- Theme: restore saved preference (else follow OS) ---- */
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {}

  function toggleTheme() {
    var current = root.getAttribute("data-theme");
    if (!current) {
      current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* theme buttons */
    var themeBtns = document.querySelectorAll("[data-theme-toggle]");
    themeBtns.forEach(function (b) { b.addEventListener("click", toggleTheme); });

    /* mobile nav */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.getElementById("nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* sticky-nav border on scroll */
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* scroll reveal — hide only once we know JS + observer are available, so a
       failed/blocked script can never leave the page invisible. */
    var reveals = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && "IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.remove("reveal-init");
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach(function (el) { el.classList.add("reveal-init"); io.observe(el); });
      /* safety net: force-reveal anything still hidden shortly after load */
      window.addEventListener("load", function () {
        setTimeout(function () {
          document.querySelectorAll(".reveal.reveal-init").forEach(function (el) {
            el.classList.remove("reveal-init"); el.classList.add("in");
          });
        }, 2500);
      });
    }

    /* current year */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
