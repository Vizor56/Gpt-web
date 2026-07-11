param
(
    [string]$Server = "localhost"
)

$ErrorActionPreference = "Stop"
$scriptPath = Join-Path $PSScriptRoot "database\Yaroslav_Tutor_Online_School.sql"
$siteUpdatesPath = Join-Path $PSScriptRoot "database\apply-site-updates.sql"
$homeworkLibraryPath = Join-Path $PSScriptRoot "database\apply-homework-library.sql"

if (-not (Test-Path $scriptPath))
{
    throw "SQL script not found: $scriptPath"
}

Write-Host "Installing database on SQL Server: $Server"
Write-Host "Script: $scriptPath"

sqlcmd -S $Server -E -C -b -f 65001 -i $scriptPath

if (Test-Path $siteUpdatesPath)
{
    Write-Host "Applying site updates: $siteUpdatesPath"
    sqlcmd -S $Server -E -C -b -f 65001 -i $siteUpdatesPath
}

if (Test-Path $homeworkLibraryPath)
{
    Write-Host "Applying homework/library updates: $homeworkLibraryPath"
    sqlcmd -S $Server -E -C -b -f 65001 -i $homeworkLibraryPath
}

Write-Host "Done. If your server name differs, run:"
Write-Host ".\install-database.ps1 -Server ""YOUR_SERVER_NAME"""
