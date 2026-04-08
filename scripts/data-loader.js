/**
 * Data Loader: Fetches and renders experience and projects from JSON files
 * This allows easy content management without touching HTML/component files
 */

(function () {
  window.DataLoader = window.DataLoader || {};
  var loadedSections = {
    experience: false,
    projects: false,
    skills: false
  };

  function loadJson(path) {
    return fetch(path)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load: " + path);
        }
        return response.json();
      })
      .catch(function () {
        // Fallback for local file contexts where fetch can fail.
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", path, true);

          xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 0) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (error) {
                reject(error);
              }
            } else {
              reject(new Error("XHR failed: " + path));
            }
          };

          xhr.onerror = function () {
            reject(new Error("XHR network error: " + path));
          };

          xhr.send();
        });
      });
  }

  function canLoadExperience() {
    return !!(
      document.getElementById("experience-list") &&
      document.getElementById("experience-item-template")
    );
  }

  function canLoadProjects() {
    return !!(
      document.getElementById("projects-list") &&
      document.getElementById("project-item-template")
    );
  }

  function canLoadSkills() {
    return !!(
      document.getElementById("skills-list") &&
      document.getElementById("skill-group-template")
    );
  }

  function loadReadySections() {
    if (!loadedSections.experience && canLoadExperience()) {
      loadedSections.experience = true;
      loadExperience();
    }

    if (!loadedSections.projects && canLoadProjects()) {
      loadedSections.projects = true;
      loadProjects();
    }

    if (!loadedSections.skills && canLoadSkills()) {
      loadedSections.skills = true;
      loadSkills();
    }
  }

  function waitForTemplatesAndLoad() {
    if (loadedSections.experience && loadedSections.projects && loadedSections.skills) {
      return;
    }

    loadReadySections();

    window.setTimeout(waitForTemplatesAndLoad, 60);
  }

  // Load and render experience items
  function loadExperience() {
    return loadJson("data/experience.json")
      .then(function (experiences) {
        renderExperience(experiences);
      })
      .catch(function (error) {
        console.error("Error loading experience:", error);
      });
  }

  // Load and render project items
  function loadProjects() {
    return loadJson("data/projects.json")
      .then(function (projects) {
        renderProjects(projects);
      })
      .catch(function (error) {
        console.error("Error loading projects:", error);
      });
  }

  // Load and render skills groups
  function loadSkills() {
    return loadJson("data/skills.json")
      .then(function (skills) {
        renderSkills(skills);
      })
      .catch(function (error) {
        console.error("Error loading skills:", error);
      });
  }

  function renderExperience(experiences) {
    var container = document.getElementById("experience-list");
    if (!container) return;

    var template = document.getElementById("experience-item-template");
    if (!template) return;

    container.innerHTML = ""; // Clear existing content

    experiences.forEach(function (exp) {
      var clone = template.content.cloneNode(true);

      // Set company logo
      var logoImg = clone.querySelector(".company-logo-img");
      logoImg.src = exp.logo;
      logoImg.alt = exp.company + " logo";

      // Set title
      clone.querySelector(".experience-title").textContent =
        exp.company + " - " + exp.position;

      // Set duration and location
      clone.querySelector(".experience-duration").textContent = exp.duration;
      clone.querySelector(".experience-location").textContent = exp.location;

      // Set accomplishments
      var bulletsList = clone.querySelector(".experience-bullets");
      bulletsList.innerHTML = "";
      exp.accomplishments.forEach(function (accomplishment) {
        var li = document.createElement("li");
        li.textContent = accomplishment;
        bulletsList.appendChild(li);
      });

      // Set skills tags
      var tagsContainer = clone.querySelector(".tags");
      tagsContainer.innerHTML = "";
      exp.skills.forEach(function (skill) {
        var tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = skill;
        tagsContainer.appendChild(tag);
      });

      container.appendChild(clone);
    });
  }

  function renderProjects(projects) {
    var container = document.getElementById("projects-list");
    if (!container) return;

    var template = document.getElementById("project-item-template");
    if (!template) return;

    container.innerHTML = ""; // Clear existing content

    projects.forEach(function (project) {
      var clone = template.content.cloneNode(true);

      // Set link
      var link = clone.querySelector(".project-link");
      link.href = "pages/projects.html?project=" + project.id;
      link.setAttribute("aria-label", "View " + project.title + " details");

      // Set icon
      var icon = clone.querySelector(".project-icon");
      if (project.iconImage) {
        var iconImage = document.createElement("img");
        iconImage.src = project.iconImage;
        iconImage.alt = project.title + " icon";
        iconImage.className = "project-icon-image";
        icon.innerHTML = "";
        icon.appendChild(iconImage);
      } else if (project.icon && project.icon.indexOf("&#") === 0) {
        icon.innerHTML = project.icon;
      } else {
        icon.textContent = project.icon || "*";
      }

      // Set title
      clone.querySelector(".project-title").textContent = project.title;

      // Set summary
      clone.querySelector(".project-summary").textContent = project.summary;

      // Set year and category
      clone.querySelector(".project-year").textContent =
        project.year + " - " + project.category;

      // Set skills tags
      var tagsContainer = clone.querySelector(".tags");
      tagsContainer.innerHTML = "";
      project.skills.forEach(function (skill) {
        var tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = skill;
        tagsContainer.appendChild(tag);
      });

      container.appendChild(clone);
    });
  }

  function renderSkills(skillGroups) {
    var container = document.getElementById("skills-list");
    if (!container) return;

    var template = document.getElementById("skill-group-template");
    if (!template) return;

    container.innerHTML = "";

    skillGroups.forEach(function (group) {
      var clone = template.content.cloneNode(true);
      clone.querySelector(".skill-group-title").textContent = group.group;

      var tagsContainer = clone.querySelector(".skill-tags");
      tagsContainer.innerHTML = "";

      (group.skills || []).forEach(function (skill) {
        var pill = document.createElement("span");
        pill.className = "skill-pill";

        var label = document.createElement("span");
        label.textContent = skill;

        pill.appendChild(label);
        tagsContainer.appendChild(pill);
      });

      container.appendChild(clone);
    });
  }

  // Initialize data loading when components are loaded
  function init() {
    window.addEventListener("components:loaded", function () {
      loadReadySections();
    });

    // Also bootstrap independently in case the event fired before this listener was attached.
    waitForTemplatesAndLoad();
  }

  // Expose public methods
  DataLoader.loadExperience = loadExperience;
  DataLoader.loadProjects = loadProjects;
  DataLoader.loadSkills = loadSkills;
  DataLoader.renderExperience = renderExperience;
  DataLoader.renderProjects = renderProjects;
  DataLoader.renderSkills = renderSkills;

  // Initialize if DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
