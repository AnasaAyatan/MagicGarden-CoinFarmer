# Copyright (c) 2026 AnasaAyatan. See LICENSE.
$companionPath = Join-Path $PSScriptRoot 'companion.html'
if (!(Test-Path -LiteralPath $companionPath)) {
    throw 'Keep Launch-Companion.ps1 and companion.html in the same folder.'
}
$companionUri = ([System.Uri](Resolve-Path -LiteralPath $companionPath).Path).AbsoluteUri
$edgeCandidates = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)
$edgePath = $edgeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (!$edgePath) { throw 'Microsoft Edge was not found. Open companion.html in your browser instead.' }
Start-Process -FilePath $edgePath -ArgumentList @("--app=`"$companionUri`"", '--window-size=460,820')
