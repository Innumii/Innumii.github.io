(function () {
  var revealObserver = null;

  function safeGetTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  function safeSetTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function showAllRevealItems() {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  function initThemeToggle() {
    var toggle = document.getElementById("themeToggle");
    var root = document.documentElement;

    if (!toggle) return;

    function applyTheme(dark) {
      if (dark) {
        root.setAttribute("data-theme", "dark");
        toggle.checked = true;
      } else {
        root.removeAttribute("data-theme");
        toggle.checked = false;
      }
    }

    applyTheme(safeGetTheme() === "dark");

    if (toggle.dataset.themeBound === "true") {
      return;
    }

    toggle.addEventListener("change", function () {
      var isDark = toggle.checked;
      applyTheme(isDark);
      safeSetTheme(isDark ? "dark" : "light");
    });

    toggle.dataset.themeBound = "true";
  }

  function initCounters() {
    var counters = document.querySelectorAll('.counter:not([data-counted="true"])');

    counters.forEach(function (counter) {
      counter.dataset.counted = "true";

      var target = Number(counter.getAttribute("data-target")) || 0;
      var suffix = counter.getAttribute("data-suffix") || "";
      var duration = 1300;
      var startTime;

      function updateCount(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        counter.textContent = Math.floor(progress * target) + suffix;
        if (progress < 1) window.requestAnimationFrame(updateCount);
      }

      counter.textContent = "0" + suffix;
      window.requestAnimationFrame(updateCount);
    });
  }

  function initReveals() {
    var revealItems = document.querySelectorAll('.reveal:not([data-reveal-bound="true"])');

    if (revealItems.length === 0) {
      return;
    }

    if (!window.IntersectionObserver) {
      showAllRevealItems();
      return;
    }

    document.documentElement.classList.add("reveal-ready");

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
      );
    }

    revealItems.forEach(function (el) {
      el.dataset.revealBound = "true";
      revealObserver.observe(el);
    });
  }

  function runInitializers() {
    initThemeToggle();
    initCounters();
    initReveals();
  }

  function init() {
    try {
      runInitializers();
    } catch (error) {
      console.error("Portfolio initialization failed:", error);
      showAllRevealItems();
    }

    window.addEventListener("components:loaded", function () {
      try {
        runInitializers();
      } catch (error) {
        console.error("Post-component initialization failed:", error);
        showAllRevealItems();
      }
    });

    window.addEventListener("content:rendered", function () {
      try {
        runInitializers();
      } catch (error) {
        console.error("Post-render initialization failed:", error);
        showAllRevealItems();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();