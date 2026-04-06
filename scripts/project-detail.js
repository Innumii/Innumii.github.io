(function () {
  var projectData = {
    "speed-card-game": {
      title: "Speed Card Game",
      timeframe: "Jan 2026 - May 2026",
      context: "Real-time multiplayer platform",
      image: "../assets/project-speed-card-game.png",
      description:
        "Architected and shipped a fully online 1v1 real-time card game with sub-second response times and deterministic multiplayer synchronization.",
      bullets: [
        "Built scalable backend microservices in Go for card management and authentication.",
        "Developed the authoritative game server in C++ for low-latency move validation and game state synchronization.",
        "Provisioned and managed cloud infrastructure with Terraform for repeatable deployments.",
        "Implemented a GitHub Actions CI/CD pipeline to automate build and test checks on every push."
      ],
      tags: ["Go", "C++", "Terraform", "GitHub Actions", "Real-Time Systems"]
    },
    telemetry: {
      title: "Telemetry (UBS)",
      timeframe: "Jan 2025 - May 2025",
      context: "Observability and incident response",
      image: "../assets/project-telemetry.png",
      description:
        "Designed and implemented a telemetry and alerting platform to consolidate operational signals and speed up incident response.",
      bullets: [
        "Implemented a fire-and-forget notification system with RabbitMQ for email and Telegram alerts.",
        "Built a React frontend with an interactive world map and Grafana dashboards for real-time visibility.",
        "Integrated telemetry data from multiple businesses into a centralized dashboard.",
        "Deployed on AWS and added LSTM-based anomaly detection for proactive alerting."
      ],
      tags: ["RabbitMQ", "Grafana", "AWS", "Python", "LSTM"]
    },
    "cheaty-fetch": {
      title: "Cheaty Fetch",
      timeframe: "Jan 2025 - May 2025",
      context: "Web scraping and full-stack",
      image: "",
      description:
        "A full-stack price aggregator for trading card markets in Singapore, enabling real-time cross-retailer comparison with a performant caching layer.",
      bullets: [
        "Engineered a Python/Selenium web scraper to aggregate real-time trading card prices across multiple Singapore retailers.",
        "Built a caching layer to reduce lookup latency while preserving data freshness.",
        "Created a React frontend with filtering and search for rapid cross-retailer comparison.",
        "Containerized services using Docker for reliable local and deployment environments."
      ],
      tags: ["Python", "Selenium", "Web Scraping", "Caching", "React", "Docker"]
    },
    "urban-farm": {
      title: "Urban Farm",
      timeframe: "Jan 2024 - May 2024",
      context: "Android game development",
      image: "",
      description:
        "A fully functional Android game built with a custom multithreaded architecture, concurrent game systems, and robust local persistence.",
      bullets: [
        "Developed concurrent game systems with a custom multithreaded architecture.",
        "Implemented responsive state updates while isolating gameplay subsystems.",
        "Designed local persistence for game progress and player data.",
        "Optimized serialization/deserialization for complex in-game object state."
      ],
      tags: ["Kotlin", "Java", "Android SDK", "SQLite", "Multithreading"]
    }
  };

  function getProjectKey() {
    var params = new URLSearchParams(window.location.search);
    return params.get("project");
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

    var bulletItems = project.bullets
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");

    var coverHtml = project.image
      ? '<img class="project-cover-large" src="' + project.image + '" alt="' + project.title + ' preview" />'
      : "";

    root.innerHTML =
      '<article class="card">' +
      coverHtml +
      '<h1 class="title">' + project.title + "</h1>" +
      '<p class="meta">' + project.timeframe + " - " + project.context + "</p>" +
      '<p class="description">' + project.description + "</p>" +
      '<h2 class="sub-title">Highlights</h2>' +
      '<ul class="bullets">' + bulletItems + "</ul>" +
      '<h2 class="sub-title">Technologies</h2>' +
      '<div class="tags" id="projectTags"></div>' +
      "</article>";

    var tagsRoot = document.getElementById("projectTags");
    project.tags.forEach(function (tag) {
      tagsRoot.appendChild(createTag(tag));
    });
  }

  var key = getProjectKey();
  renderProject(key ? projectData[key] : null);
})();
