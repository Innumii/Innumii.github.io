(function () {
  // Each [data-include="x"] slot is filled from the
  // <script type="text/html" id="tpl-x"> template in the
  // same HTML file. No fetch, no server required.
  function loadAllComponents() {
    var slots = document.querySelectorAll("[data-include]");

    slots.forEach(function (slot) {
      var name = slot.getAttribute("data-include");
      var template = document.getElementById("tpl-" + name);
      if (template) {
        slot.innerHTML = template.innerHTML;
      }
    });

    window.dispatchEvent(new Event("components:loaded"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAllComponents);
  } else {
    loadAllComponents();
  }
})();