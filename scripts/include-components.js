(function () {
  function getScriptBaseUrl(scriptFileName, defaultRelativePath) {
    var currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
      return new URL("./", currentScript.src).href;
    }

    var scriptEl = document.querySelector('script[src*="' + scriptFileName + '"]');
    if (scriptEl && scriptEl.src) {
      return new URL("./", scriptEl.src).href;
    }

    return new URL(defaultRelativePath, window.location.href).href;
  }

  var scriptBaseUrl = (function () {
    return getScriptBaseUrl("include-components.js", "scripts/");
  })();

  function resolvePath(relativePath) {
    return new URL(relativePath, scriptBaseUrl).href;
  }

  function loadTextWithXhr(path) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, true);

      xhr.onload = function () {
        // status 0 is possible on local file contexts.
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.responseText);
        } else {
          reject(new Error("XHR failed for component: " + path));
        }
      };

      xhr.onerror = function () {
        reject(new Error("XHR network error for component: " + path));
      };

      xhr.send();
    });
  }

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
    var path = resolvePath("../components/" + name + ".component.html");

    return fetch(path)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Component not found: " + name);
        }
        return response.text();
      })
      .then(function (html) {
        slot.innerHTML = html;
      })
      .catch(function () {
        return loadTextWithXhr(path)
          .then(function (html) {
            slot.innerHTML = html;
          })
          .catch(function (error) {
            console.warn(error.message);

            slot.innerHTML =
              '<div class="container"><p class="section-subtitle">Failed to load component: ' +
              name +
              "</p></div>";
          });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAllComponents);
  } else {
    loadAllComponents();
  }
})();