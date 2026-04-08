(function () {
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

    toggle.addEventListener("change", function () {
      var isDark = toggle.checked;
      applyTheme(isDark);
      safeSetTheme(isDark ? "dark" : "light");
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll(".counter");

    counters.forEach(function (counter) {
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
    document.documentElement.classList.add("reveal-ready");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  }

  function init() {
    try {
      initThemeToggle();
    } catch (error) {
      console.error("Theme initialization failed:", error);
    }

    try {
      initCounters();
    } catch (error) {
      console.error("Counter initialization failed:", error);
    }

    try {
      initReveals();
    } catch (error) {
      console.error("Reveal initialization failed:", error);
      showAllRevealItems();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();