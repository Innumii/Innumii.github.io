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
    return getScriptBaseUrl("project-detail.js", "../scripts/");
  })();

  function resolveDataPath(fileName) {
    return new URL("../data/" + fileName, scriptBaseUrl).href;
  }

  function getProjectKey() {
    var params = new URLSearchParams(window.location.search);
    return params.get("project");
  }

  function toAssetPath(path) {
    if (!path) return "";
    return path.indexOf("assets/") === 0 ? "../" + path : path;
  }

  function createTag(tag) {
    var el = document.createElement("span");
    el.className = "tag";
    el.textContent = tag;
    return el;
  }

  function renderProject(project) {
    var root = document.getElementById("projectRoot");

    if (!root) {
      return;
    }

    if (!project) {
      root.innerHTML =
        '<article class="card empty-state"><h1 class="title">Project not found</h1><p>Select a project from the portfolio home page.</p></article>';
      return;
    }

    var bulletItems = (project.achievements || [])
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");

    var coverSource = toAssetPath(project.image);
    var iconSource = toAssetPath(project.iconImage);
    var coverHtml = "";

    if (coverSource) {
      coverHtml =
        '<img class="project-cover-large" src="' +
        coverSource +
        '" alt="' +
        project.title +
        ' preview" />';
    } else if (iconSource) {
      coverHtml =
        '<div class="project-icon-large" aria-label="' +
        project.title +
        ' icon"><img src="' +
        iconSource +
        '" alt="' +
        project.title +
        ' icon" /></div>';
    }

    var timeframe = project.timeframe || project.year || "";
    var metaText = timeframe;
    if (project.category) {
      metaText += (metaText ? " - " : "") + project.category;
    }

    root.innerHTML =
      '<article class="card">' +
      coverHtml +
      '<h1 class="title">' + project.title + "</h1>" +
      '<p class="meta">' + metaText + "</p>" +
      '<p class="description">' + project.details + "</p>" +
      '<h2 class="sub-title">Highlights</h2>' +
      '<ul class="bullets">' + bulletItems + "</ul>" +
      '<h2 class="sub-title">Technologies</h2>' +
      '<div class="tags" id="projectTags"></div>' +
      "</article>";

    var tagsRoot = document.getElementById("projectTags");
    (project.skills || []).forEach(function (tag) {
      tagsRoot.appendChild(createTag(tag));
    });
  }

  var key = getProjectKey();

  fetch(resolveDataPath("projects.json"))
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load project data");
      }
      return response.json();
    })
    .then(function (projects) {
      var selected = null;

      if (key) {
        selected = projects.find(function (project) {
          return project.id === key;
        });
      }

      renderProject(selected);
    })
    .catch(function () {
      renderProject(null);
    });
})();
