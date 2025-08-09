# Test backend health script
Write-Host "Testing backend health on port 8080..."

# Wait for backend to start
Start-Sleep -Seconds 5

# Test if port is open
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✅ Port 8080 is open!"
        
        # Test health endpoint
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET -TimeoutSec 10
            Write-Host "✅ Health endpoint responded with status: $($response.StatusCode)"
            Write-Host "Response content: $($response.Content)"
        }
        catch {
            Write-Host "❌ Health endpoint error: $($_.Exception.Message)"
        }
    } else {
        Write-Host "❌ Port 8080 is not open"
    }
}
catch {
    Write-Host "❌ Port test error: $($_.Exception.Message)"
}
