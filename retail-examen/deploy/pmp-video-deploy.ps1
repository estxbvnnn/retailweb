param(
  [string]$Url = "https://7pgdn5q476.execute-api.us-east-1.amazonaws.com/pmp-video-deploy",
  [string]$ApiKey = $env:API_GATEWAY_KEY,
  [int]$Retries = 3,
  [int]$TimeoutSec = 60
)

$headers = @{}
if ($ApiKey) { $headers["x-api-key"] = $ApiKey }

$attempt = 0
do {
  try {
    Write-Host "Llamando $Url (intento $($attempt + 1))..."
    $response = Invoke-RestMethod -Method Post -Uri $Url -Headers $headers -TimeoutSec $TimeoutSec
    Write-Host "OK"
    $response | ConvertTo-Json -Depth 8
    exit 0
  } catch {
    Write-Warning "Error: $($_.Exception.Message)"
    $attempt++
    if ($attempt -lt $Retries) { Start-Sleep -Seconds (5 * $attempt) }
  }
} while ($attempt -lt $Retries)

Write-Error "Fallo tras $Retries intentos."
exit 1
