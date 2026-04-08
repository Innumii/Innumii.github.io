# Innumii.github.io

## Deployment cleanup

If old GitHub deployment history, workflow runs, and artifacts are piling up, use:

```powershell
./scripts/prune-old-deployments.ps1 -Repo Innumii/Innumii.github.io -KeepRuns 20 -KeepArtifacts 20 -KeepDeployments 15
```

Dry run first:

```powershell
./scripts/prune-old-deployments.ps1 -Repo Innumii/Innumii.github.io -DryRun
```

What was added:

- script: [scripts/prune-old-deployments.ps1](scripts/prune-old-deployments.ps1)
- automation workflow: [.github/workflows/prune-deployments.yml](.github/workflows/prune-deployments.yml)

The workflow runs weekly and can also be triggered manually from GitHub Actions.