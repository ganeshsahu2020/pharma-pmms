# ?? Kill all node processes
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \.Id -Force }

# ?? Clean node_modules & lock files
Write-Host "?? Cleaning project..."
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# ?? Reinstall dependencies
Write-Host "?? Installing dependencies..."
npm install

# ? Ensure @tailwindcss/postcss is installed
Write-Host "? Checking Tailwind PostCSS setup..."
npm install -D @tailwindcss/postcss@latest

# ?? Fix postcss.config.js
 = ".\postcss.config.js"
if (Test-Path ) {
  Set-Content -Path  -Value @'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
'@
  Write-Host "? postcss.config.js updated"
} else {
  Write-Host "?? postcss.config.js not found"
}

# ??? Rebuild the project
Write-Host "??? Building project..."
npm run build
