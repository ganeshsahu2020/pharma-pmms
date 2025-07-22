# start-dev.ps1
$port = 5175

function Kill-Port {
  Write-Host "Checking if port $port is in use..."
  $existing = netstat -ano | Select-String ":$port\s+.*LISTENING" | ForEach-Object {
    ($_ -split '\s+')[-1]
  } | Select-Object -First 1

  if ($existing) {
    try {
      Write-Host "Port $port in use by PID $existing. Killing it..."
      Stop-Process -Id $existing -Force
      Write-Host "Process $existing killed. Port $port is now free."
    } catch {
      Write-Host "Failed to kill process on port ${port}: $($_.Exception.Message)"
    }
  } else {
    Write-Host "Port $port is already free."
  }
}

# Execute kill and start sequence
Kill-Port
Start-Sleep -Seconds 1

Write-Host "Starting Vite dev server on port $port..."
Start-Process "npm" -ArgumentList "run", "dev" -NoNewWindow

Start-Sleep -Seconds 2
Write-Host "Opening browser at http://localhost:$port ..."
Start-Process "http://localhost:$port"
