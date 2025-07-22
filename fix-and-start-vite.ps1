# Desired port
$preferredPort = 5175

# Check if port 5175 is currently in use
$existingConnection = Get-NetTCPConnection -LocalPort $preferredPort -State Listen -ErrorAction SilentlyContinue

if ($existingConnection) {
    $pid = $existingConnection.OwningProcess
    Write-Host "🛑 Port $preferredPort is in use by PID $pid. Terminating it..."
    Stop-Process -Id $pid -Force
    Start-Sleep -Seconds 1
} else {
    Write-Host "✅ Port $preferredPort is already free."
}

# Start Vite dev server on preferred port
Write-Host "🚀 Launching Vite on http://localhost:$preferredPort"
Start-Process powershell -ArgumentList "npm run dev"
