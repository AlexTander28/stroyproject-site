$ErrorActionPreference = 'Stop'
$taskRepoRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $taskRepoRoot
try {
    if ((git branch --show-current) -ne 'main') { throw 'Publish only from main.' }
    if (git status --porcelain) { throw 'Commit or preserve local changes before publishing.' }
    node scripts/check-site.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Site checks failed.' }
    git fetch origin main
    if ($LASTEXITCODE -ne 0) { throw 'Fetch failed.' }
    $taskLocalCommit = git rev-parse HEAD
    $taskRemoteCommit = git rev-parse origin/main
    if ($taskLocalCommit -ne $taskRemoteCommit) { throw 'Local main must match origin/main before publication.' }
    $taskPagesCommit = git subtree split --prefix=site main
    if ($LASTEXITCODE -ne 0) { throw 'Artifact split failed.' }
    git push origin "${taskPagesCommit}:refs/heads/gh-pages"
    if ($LASTEXITCODE -ne 0) { throw 'Publication push failed. Never force-push to work around divergence.' }
    Write-Output "Pages artifact commit: $taskPagesCommit"
    Write-Output 'Wait for Pages build, then verify the live URL and version.json before creating a release.'
} finally { Pop-Location }
