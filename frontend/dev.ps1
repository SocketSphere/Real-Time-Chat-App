# dev.ps1
$ports = @(5173, 5174)

foreach ($port in $ports) {
    $procId = (netstat -ano | findstr ":$port" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1)
    if ($procId) {
        Write-Host "Killing process $procId on port $port..."
        taskkill /PID $procId /F | Out-Null
    }
}

npm run dev
