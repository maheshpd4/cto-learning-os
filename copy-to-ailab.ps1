# ============================================================
# CTO Learning OS -- Copy to AI_LAB + Software Check + Git Init
# ============================================================
# HOW TO RUN:
#   1. Open PowerShell (Win+X -> Terminal)
#   2. cd "C:\Users\mahesh\Documents\Claude\Projects\CTO Learning OS"
#   3. Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   4. .\copy-to-ailab.ps1
# ============================================================

Write-Host ""
Write-Host "CTO Learning OS -- Moving to AI_LAB" -ForegroundColor Cyan
Write-Host "======================================"
Write-Host ""

$source = "C:\Users\mahesh\Documents\Claude\Projects\CTO Learning OS"
$dest   = "C:\AI_LAB\projects\cto-learning-os"

# ----------------------------------------------------------
# Step 1: Copy all files
# ----------------------------------------------------------
Write-Host "Step 1: Copying files to $dest" -ForegroundColor Yellow

if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Write-Host "   Created directory: $dest"
}

# /E = all subdirs, /XD = exclude these dirs, /NFL /NDL = quieter output
robocopy $source $dest /E /XD node_modules .next /NFL /NDL /NJH /NJS

if ($LASTEXITCODE -le 7) {
    Write-Host "   [OK] Files copied successfully!" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] robocopy failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
Write-Host ""

# ----------------------------------------------------------
# Step 2: Software check (uses Get-Command, no try/catch needed)
# ----------------------------------------------------------
Write-Host "Step 2: Checking required software" -ForegroundColor Yellow

$tools = @("node", "npm", "npx", "git", "docker")
$allGood = $true

foreach ($tool in $tools) {
    $found = Get-Command $tool -ErrorAction SilentlyContinue
    if ($found) {
        $version = & $tool --version 2>&1
        Write-Host "   [OK]      $tool : $version" -ForegroundColor Green
    } else {
        Write-Host "   [MISSING] $tool : not found -- install before running the app" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
if ($allGood) {
    Write-Host "   All required tools are installed." -ForegroundColor Green
} else {
    Write-Host "   Some tools are missing. Install them before running npm install." -ForegroundColor Yellow
}
Write-Host ""

# ----------------------------------------------------------
# Step 3: Git init + first commit
# ----------------------------------------------------------
Write-Host "Step 3: Initialising Git in $dest" -ForegroundColor Yellow

Set-Location $dest

if (Test-Path ".git") {
    Write-Host "   Git already initialised -- skipping." -ForegroundColor DarkGray
} else {
    git init
    git add .
    git commit -m "feat: initial commit -- CTO Learning OS MVP 1"
    Write-Host "   [OK] Git repo created with first commit!" -ForegroundColor Green
}

Write-Host ""

# ----------------------------------------------------------
# Summary
# ----------------------------------------------------------
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "[DONE] Project is ready at: $dest" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps to run the app:"
Write-Host "  cd `"$dest`""
Write-Host "  copy .env.example .env.local"
Write-Host "  # Edit .env.local and set GEMINI_API_KEY"
Write-Host "  docker compose up db -d"
Write-Host "  npm install"
Write-Host "  npx prisma migrate dev --name init"
Write-Host "  npx prisma db seed"
Write-Host "  npm run dev"
Write-Host "  # Then open http://localhost:3000"
Write-Host ""
Write-Host "To push to GitHub once tested:"
Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/cto-learning-os.git"
Write-Host "  git branch -M main"
Write-Host "  git push -u origin main"
Write-Host ""
Write-Host "NOTE: .env.local is in .gitignore -- your API keys will NOT be pushed." -ForegroundColor Cyan
Write-Host ""
