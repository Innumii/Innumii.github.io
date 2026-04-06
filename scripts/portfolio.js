(function () {
  function initThemeToggle() {
    var toggle = document.getElementById("themeToggle");
    var label = document.getElementById("toggle-label");
    var root = document.documentElement;

    if (!toggle || !label) {
      return;
    }

    function applyTheme(dark) {
      if (dark) {
        root.setAttribute("data-theme", "dark");
        label.textContent = "Night mode";
        toggle.checked = true;
      } else {
        root.removeAttribute("data-theme");
        label.textContent = "Day mode";
        toggle.checked = false;
      }
    }

    applyTheme(localStorage.getItem("theme") === "dark");

    toggle.addEventListener("change", function () {
      var isDark = toggle.checked;
      applyTheme(isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
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
        if (!startTime) {
          startTime = timestamp;
        }

        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var value = Math.floor(progress * target);
        counter.textContent = String(value) + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(updateCount);
        }
      }

      counter.textContent = "0" + suffix;
      window.requestAnimationFrame(updateCount);
    });
  }

  function initReveals() {
    var revealElements = document.querySelectorAll(".reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initPage() {
    initThemeToggle();
    initCounters();
    initReveals();
  }

  window.addEventListener("components:loaded", initPage);
})();
