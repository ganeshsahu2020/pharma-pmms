# Define paths
$projectPath = "C:\Users\rxgibsmt\DigitizerX\digitizerxui"
$buildPath = "$projectPath\build"
$zipPath = "$projectPath\build.zip"

# Step 1: Go to your project directory
Set-Location -Path $projectPath

# Step 2: Run the React build
Write-Host "🔧 Building React project..."
npm run build

# Step 3: Check for _redirects file in /public (optional)
$redirectFile = "$projectPath\public\_redirects"
if (-not (Test-Path $redirectFile)) {
    Write-Host "⚠️ '_redirects' file missing. Creating one..."
    "@/*    /index.html   200" | Out-File -FilePath $redirectFile -Encoding utf8
}

# Step 4: Zip the build folder
if (Test-Path $zipPath) {
    Remove-Item $zipPath
}
Write-Host "📦 Zipping build folder..."
Compress-Archive -Path "$buildPath\*" -DestinationPath $zipPath

# Step 5: Open Netlify deploy page
Write-Host "🌐 Opening Netlify Drop Deploy page..."
Start-Process "https://app.netlify.com/drop"

Write-Host "✅ Done! Drag and drop 'build.zip' into Netlify drop page."
