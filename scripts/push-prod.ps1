# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Error ".env.local file not found"
    exit 1
}

# Load environment variables from .env.local
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

# Check if EXPO_TOKEN exists
if (-not $env:EXPO_TOKEN) {
    Write-Error "EXPO_TOKEN not found in .env.local"
    exit 1
}

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Using git version: $gitVersion"
} catch {
    Write-Error "git is not available. Please install git and try again."
    exit 1
}

# get the latest commit message
try {
    $commitMessage = git log -1 --pretty=%B
    if (-not $commitMessage) {
        Write-Error "No commit message found"
        exit 1
    }
} catch {
    Write-Error "Failed to get commit message: $_"
    exit 1
}

# Run the build
try {
    Write-Host "Starting EAS update with commit message: $commitMessage"
    npx -y eas-cli update --channel production -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Error "EAS CLI update failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Failed to run EAS CLI update: $_"
    exit 1
}

# Clean up
Remove-Item Env:\EXPO_TOKEN
Write-Host "Update completed successfully"