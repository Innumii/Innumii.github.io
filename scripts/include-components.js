(function () {
  function includeComponent(host) {
    var path = host.getAttribute("data-include");

    if (!path) {
      return Promise.resolve();
    }

    return fetch(path)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load component: " + path);
        }

        return response.text();
      })
      .then(function (html) {
        host.innerHTML = html;
      })
      .catch(function () {
        return null;
      });
  }

  function loadAllComponents() {
    var hosts = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));

    Promise.all(hosts.map(includeComponent)).then(function () {
      window.dispatchEvent(new Event("components:loaded"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAllComponents);
    return;
  }

  loadAllComponents();
})();
