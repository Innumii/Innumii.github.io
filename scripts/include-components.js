(function () {
  // Enhanced component loader that supports both .html files and JSON data
  function loadAllComponents() {
    var slots = document.querySelectorAll("[data-include]");
    var loadPromises = [];

    slots.forEach(function (slot) {
      var name = slot.getAttribute("data-include");
      var promise = loadComponent(name, slot);
      loadPromises.push(promise);
    });

    Promise.all(loadPromises).then(function () {
      window.dispatchEvent(new Event("components:loaded"));
    });
  }

  function loadComponent(name, slot) {
    return fetch("components/" + name + ".component.html")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Component not found: " + name);
        }
        return response.text();
      })
      .then(function (html) {
        slot.innerHTML = html;
      })
      .catch(function (error) {
        console.warn(error.message);
        // Try fallback to old JS-based components
        var registry = window.PortfolioComponents || {};
        var markup = registry[name];
        if (typeof markup === "string") {
          slot.innerHTML = markup;
          return;
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAllComponents);
  } else {
    loadAllComponents();
  }
})();