# Easy Content Management Guide

Your portfolio now uses a data-driven architecture that separates content from code. This makes it easy to add and update projects and work experience without touching HTML or JavaScript.

## How to Add Work Experience

Edit `data/experience.json` and add a new object to the array:

```json
{
  "id": "unique-id",
  "company": "Company Name",
  "position": "Your Position",
  "logo": "assets/logo-filename.png",
  "duration": "Month Year - Month Year",
  "location": "City/Country",
  "description": "Brief description of the role",
  "accomplishments": [
    "Achievement 1",
    "Achievement 2",
    "Achievement 3"
  ],
  "skills": ["Skill1", "Skill2", "Skill3"]
}
```

Save the file and reload your portfolio. The new experience will appear automatically!

## How to Add Projects

Edit `data/projects.json` and add a new object to the array:

```json
{
  "id": "unique-project-id",
  "title": "Project Name",
  "icon": "A short fallback text or emoji like &#128269;",
  "iconImage": "assets/project-name-icon.png",
  "summary": "One-line summary of the project",
  "timeframe": "Jan 2026 - May 2026",
  "year": "2026",
  "category": "Category name",
  "skills": ["Skill1", "Skill2"],
  "details": "Detailed description for the project page",
  "image": "assets/project-cover.png or empty string if not available yet",
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ]
}
```

The `id` must be unique and will be used in the URL when viewing project details (e.g., `projects.html?project=unique-project-id`).

Save the file and reload. Your new project will appear in the portfolio!

Notes:
- Use iconImage for the small project-card icon (your provided photos work here).
- Keep image empty if the full cover image is not available yet.
- The project detail page will still render nicely with iconImage only.

## How to Manage Skills

Edit data/skills.json and update groups and skills:

```json
[
  {
    "group": "Languages",
    "skills": ["Python", "Java", "Kotlin"]
  },
  {
    "group": "Cloud & DevOps",
    "skills": ["AWS", "Docker", "Terraform"]
  }
]
```

Save the file and reload. The Skills section updates automatically.

## File Structure

```
data/
  ├── experience.json    # All your work experiences
  ├── projects.json      # All your projects
  └── skills.json        # All skill groups
  
components/
  ├── navbar.component.html       # Static components (don't edit)
  ├── hero.component.html
  ├── skills.component.html
  ├── contact.component.html
  ├── footer.component.html
  ├── experience.component.html   # Dynamic - populated from JSON
  └── projects.component.html     # Dynamic - populated from JSON

scripts/
  ├── include-components.js   # Loads HTML components
  ├── data-loader.js         # Loads JSON data and renders
  └── portfolio.js           # App logic
```

## Tips

- **Keep IDs unique**: For projects, the ID is used in URLs. For experience, it's just for reference.
- **Add multiple accomplishments**: List multiple bullet points for each role.
- **Use emoji for project icons**: You can use HTML entity codes like `&#128269;` for the magnifying glass in "Cheaty Fetch".
- **Skill tags**: Keep skill names short and consistent (e.g., "Kotlin" not "kotlin").
- **Asset references**: Make sure asset paths exist in the `assets/` folder before adding them.

## Adding Project Details Page

When you click a project, it links to `pages/projects.html?project=PROJECT_ID`. You can customize the project detail page by editing that file and handling the query parameter to show more info about the selected project.

## Migration Notes

The old `.js` component files are still there for backward compatibility but are no longer used. You can safely delete them if you want to clean up:
- `components/navbar.component.js`
- `components/hero.component.js`
- `components/experience.component.js`
- `components/projects.component.js`
- `components/skills.component.js`
- `components/contact.component.js`
- `components/footer.component.js`
