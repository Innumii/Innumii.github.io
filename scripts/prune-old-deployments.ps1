param(
  [string]$Repo = "",
  [int]$KeepRuns = 20,
  [int]$KeepArtifacts = 20,
  [int]$KeepDeployments = 15,
  [switch]$SkipRuns,
  [switch]$SkipArtifacts,
  [switch]$SkipDeployments,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Info {
  param([string]$Message)
  Write-Host "[prune] $Message"
}

function Resolve-Repo {
  if ($Repo -and $Repo.Trim()) {
    return $Repo.Trim()
  }

  $originUrl = git remote get-url origin 2>$null
  if (-not $originUrl) {
    throw "Could not resolve repo automatically. Provide -Repo owner/name."
  }

  if ($originUrl -match "github\.com[:/](.+?)(\.git)?$") {
    return $matches[1]
  }

  throw "Origin remote is not a GitHub URL. Provide -Repo owner/name."
}

function Invoke-GhApiJson {
  param(
    [string]$Path,
    [ValidateSet("GET", "POST", "DELETE")]
    [string]$Method = "GET",
    [string[]]$Fields = @()
  )

  $args = @("api", "-X", $Method, $Path)
  foreach ($field in $Fields) {
    $args += @("-f", $field)
  }

  $raw = & gh @args
  if (-not $raw) {
    return $null
  }

  return $raw | ConvertFrom-Json
}

function Get-AllRuns {
  param([string]$RepoName)

  $all = @()
  $page = 1
  while ($true) {
    $response = Invoke-GhApiJson -Path "/repos/$RepoName/actions/runs?per_page=100&page=$page"
    $runs = @($response.workflow_runs)
    if ($runs.Count -eq 0) {
      break
    }

    $all += $runs
    $page += 1
  }

  return $all
}

function Get-AllArtifacts {
  param([string]$RepoName)

  $all = @()
  $page = 1
  while ($true) {
    $response = Invoke-GhApiJson -Path "/repos/$RepoName/actions/artifacts?per_page=100&page=$page"
    $artifacts = @($response.artifacts)
    if ($artifacts.Count -eq 0) {
      break
    }

    $all += $artifacts
    $page += 1
  }

  return $all
}

function Get-AllDeployments {
  param([string]$RepoName)

  $all = @()
  $page = 1
  while ($true) {
    $deployments = Invoke-GhApiJson -Path "/repos/$RepoName/deployments?per_page=100&page=$page"
    $items = @($deployments)
    if ($items.Count -eq 0) {
      break
    }

    $all += $items
    $page += 1
  }

  return $all
}

function Remove-Runs {
  param([string]$RepoName)

  $runs = Get-AllRuns -RepoName $RepoName |
    Where-Object { $_.status -eq "completed" } |
    Sort-Object created_at -Descending

  if ($runs.Count -le $KeepRuns) {
    Write-Info "Workflow runs: nothing to prune ($($runs.Count) <= keep $KeepRuns)."
    return
  }

  $toDelete = @($runs | Select-Object -Skip $KeepRuns)
  Write-Info "Workflow runs: deleting $($toDelete.Count), keeping newest $KeepRuns."

  foreach ($run in $toDelete) {
    $summary = "#${0} {1} ({2})" -f $run.run_number, $run.name, $run.created_at
    if ($DryRun) {
      Write-Info "DryRun: would delete run $summary"
      continue
    }

    & gh api -X DELETE "/repos/$RepoName/actions/runs/$($run.id)" | Out-Null
    Write-Info "Deleted run $summary"
  }
}

function Remove-Artifacts {
  param([string]$RepoName)

  $artifacts = Get-AllArtifacts -RepoName $RepoName |
    Where-Object { -not $_.expired } |
    Sort-Object created_at -Descending

  if ($artifacts.Count -le $KeepArtifacts) {
    Write-Info "Artifacts: nothing to prune ($($artifacts.Count) <= keep $KeepArtifacts)."
    return
  }

  $toDelete = @($artifacts | Select-Object -Skip $KeepArtifacts)
  Write-Info "Artifacts: deleting $($toDelete.Count), keeping newest $KeepArtifacts."

  foreach ($artifact in $toDelete) {
    $summary = "{0} ({1})" -f $artifact.name, $artifact.created_at
    if ($DryRun) {
      Write-Info "DryRun: would delete artifact $summary"
      continue
    }

    & gh api -X DELETE "/repos/$RepoName/actions/artifacts/$($artifact.id)" | Out-Null
    Write-Info "Deleted artifact $summary"
  }
}

function Remove-Deployments {
  param([string]$RepoName)

  $deployments = Get-AllDeployments -RepoName $RepoName |
    Sort-Object created_at -Descending

  if ($deployments.Count -le $KeepDeployments) {
    Write-Info "Deployments: nothing to prune ($($deployments.Count) <= keep $KeepDeployments)."
    return
  }

  $toDelete = @($deployments | Select-Object -Skip $KeepDeployments)
  Write-Info "Deployments: deleting $($toDelete.Count), keeping newest $KeepDeployments."

  foreach ($deployment in $toDelete) {
    $summary = "id=$($deployment.id) ref=$($deployment.ref) env=$($deployment.environment) created=$($deployment.created_at)"
    if ($DryRun) {
      Write-Info "DryRun: would deactivate+delete deployment $summary"
      continue
    }

    # A deployment must be inactive before deletion.
    & gh api -X POST "/repos/$RepoName/deployments/$($deployment.id)/statuses" -f state=inactive | Out-Null
    & gh api -X DELETE "/repos/$RepoName/deployments/$($deployment.id)" | Out-Null
    Write-Info "Deleted deployment $summary"
  }
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) is required. Install from https://cli.github.com/"
}

$repoName = Resolve-Repo
Write-Info "Target repo: $repoName"
Write-Info "Config: KeepRuns=$KeepRuns KeepArtifacts=$KeepArtifacts KeepDeployments=$KeepDeployments DryRun=$($DryRun.IsPresent)"

if (-not $SkipRuns) {
  Remove-Runs -RepoName $repoName
}

if (-not $SkipArtifacts) {
  Remove-Artifacts -RepoName $repoName
}

if (-not $SkipDeployments) {
  Remove-Deployments -RepoName $repoName
}

Write-Info "Done."
