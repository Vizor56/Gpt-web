$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$port = 8765
$url = "http://127.0.0.1:$port/"
$healthUrl = "${url}api/health"
$serverPath = Join-Path $PSScriptRoot "server.ps1"
$outPath = Join-Path $PSScriptRoot "server.out.log"
$errPath = Join-Path $PSScriptRoot "server.err.log"

function Test-SiteReady {
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
        return ($response.StatusCode -eq 200)
    }
    catch {
        return $false
    }
}

if (-not (Test-SiteReady)) {
    Start-Process -FilePath powershell.exe `
        -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$serverPath`" -Root `"$PSScriptRoot`" -Port $port" `
        -WorkingDirectory $PSScriptRoot `
        -RedirectStandardOutput $outPath `
        -RedirectStandardError $errPath `
        -WindowStyle Hidden

    for ($i = 0; $i -lt 30; $i++) {
        if (Test-SiteReady) {
            break
        }

        Start-Sleep -Milliseconds 500
    }
}

Start-Process $url
