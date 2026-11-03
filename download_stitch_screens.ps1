[CmdletBinding()]
param(
    [string]$ApiKey = $env:STITCH_API_KEY,
    [string]$ProjectId = "17679700770147313446",
    [string]$OutputDir = ""
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = "c:\Users\Muk-Pc1\Documents\E" }
if (-not $OutputDir) { $OutputDir = Join-Path $scriptDir "stitch_screens" }

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# 1. Try reading API key from mcp_config.json if not passed
if (-not $ApiKey) {
    $mcpConfigFile = "C:\Users\Muk-Pc1\.gemini\config\mcp_config.json"
    if (Test-Path $mcpConfigFile) {
        try {
            $json = [System.IO.File]::ReadAllText($mcpConfigFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
            if ($json.mcpServers.StitchMCP.args) {
                for ($i = 0; $i -lt $json.mcpServers.StitchMCP.args.Count; $i++) {
                    if ($json.mcpServers.StitchMCP.args[$i] -eq "--header") {
                        $hdr = $json.mcpServers.StitchMCP.args[$i+1]
                        if ($hdr -match "X-Goog-Api-Key:\s*(.+)") {
                            $extracted = $Matches[1].Trim()
                            if ($extracted -and $extracted -ne "YOUR_KEY" -and $extracted.Length -gt 5) {
                                $ApiKey = $extracted
                            }
                        }
                    }
                }
            }
        } catch {}
    }
}

# 2. Load catalog (all 19 screens)
$catalogPath = Join-Path $scriptDir "screens_catalog.json"
$screens = @()
if (Test-Path $catalogPath) {
    $screens = [System.IO.File]::ReadAllText($catalogPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
} else {
    Write-Error "Catalog file screens_catalog.json not found."
    exit 1
}

# 3. Inform user if API Key is not set
if (-not $ApiKey) {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host " [Notice] Stitch API Key is required to download live screens" -ForegroundColor Yellow
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host " To obtain your Stitch API Key:" -ForegroundColor Cyan
    Write-Host " 1. Open: https://stitch.withgoogle.com"
    Write-Host " 2. Go to: Settings / API Keys"
    Write-Host " 3. Copy or generate your API key"
    Write-Host ""
    Write-Host " Run with your key when ready:" -ForegroundColor Cyan
    Write-Host " .\download_stitch_screens.ps1 -ApiKey 'AIzaSy...'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host " Generating interactive portal for all $($screens.Count) screens..." -ForegroundColor Green
}

$mcpEndpoint = "https://stitch.googleapis.com/mcp"
$headers = @{
    "Content-Type" = "application/json"
    "X-Goog-Api-Key" = $ApiKey
}

function Invoke-StitchTool([string]$toolName, [hashtable]$arguments) {
    $payload = @{
        jsonrpc = "2.0"
        id = [guid]::NewGuid().ToString()
        method = "tools/call"
        params = @{
            name = $toolName
            arguments = $arguments
        }
    } | ConvertTo-Json -Depth 10

    try {
        $resp = Invoke-RestMethod -Uri $mcpEndpoint -Method Post -Body $payload -Headers $headers
        return $resp
    } catch {
        $ex = $_.Exception
        if ($ex.Response) {
            $stream = $ex.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $body = $reader.ReadToEnd()
            throw "HTTP $($ex.Response.StatusCode.value__): $body"
        }
        throw $_
    }
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Processing Math Genius Screens (Google Stitch)" -ForegroundColor Cyan
Write-Host " Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host " Target Directory: $OutputDir" -ForegroundColor Cyan
Write-Host " Total Screens: $($screens.Count)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$results = @()
$screenIndex = 0

foreach ($item in $screens) {
    $screenIndex++
    $batchNum = if ($screenIndex -le 10) { 1 } else { 2 }

    $res = [PSCustomObject]@{
        Index = $screenIndex
        Batch = $batchNum
        Id = $item.id
        SafeName = $item.safeName
        Title = $item.title
        Category = $item.category
        HtmlDownloaded = $false
        ImageDownloaded = $false
        Error = $null
    }

    $htmlFilePath = Join-Path $OutputDir "$($item.safeName).html"
    $imgPath = Join-Path $OutputDir "$($item.safeName).png"

    if (Test-Path $htmlFilePath) { $res.HtmlDownloaded = $true }
    if (Test-Path $imgPath) { $res.ImageDownloaded = $true }

    if ($ApiKey) {
        Write-Host "`n>> [$screenIndex/$($screens.Count)] Fetching [$($item.safeName)]..." -ForegroundColor Yellow
        $screenName = "projects/$ProjectId/screens/$($item.id)"

        try {
            $screenResp = Invoke-StitchTool -toolName "get_screen" -arguments @{ name = $screenName }

            if ($screenResp.result.isError) {
                $errText = $screenResp.result.content | ConvertTo-Json -Depth 5
                Write-Error "Error getting screen $($item.id): $errText"
                $res.Error = $errText
                $results += $res
                continue
            }

            $content = $screenResp.result.content
            $screenData = $null
            foreach ($c in $content) {
                if ($c.type -eq "text" -and $c.text) {
                    try { $screenData = $c.text | ConvertFrom-Json } catch {}
                }
            }
            if (-not $screenData) { $screenData = $screenResp.result }

            # Save metadata
            $metaPath = Join-Path $OutputDir "$($item.safeName)_meta.json"
            $screenResp | ConvertTo-Json -Depth 10 | Set-Content -Path $metaPath -Encoding UTF8

            # 1. Download HTML Code
            $htmlFileName = $null
            if ($screenData.htmlCode.name) { $htmlFileName = $screenData.htmlCode.name }
            elseif ($screenData.html_code.name) { $htmlFileName = $screenData.html_code.name }

            if ($htmlFileName) {
                try {
                    $htmlResp = Invoke-StitchTool -toolName "download_file" -arguments @{ name = $htmlFileName }
                    $htmlContent = $null
                    if ($htmlResp.result.html) { $htmlContent = $htmlResp.result.html }
                    elseif ($htmlResp.result.content) {
                        foreach ($c in $htmlResp.result.content) {
                            if ($c.text) {
                                try {
                                    $pj = $c.text | ConvertFrom-Json
                                    if ($pj.html) { $htmlContent = $pj.html } else { $htmlContent = $c.text }
                                } catch { $htmlContent = $c.text }
                            }
                        }
                    }
                    if ($htmlContent) {
                        [System.IO.File]::WriteAllText($htmlFilePath, $htmlContent, [System.Text.Encoding]::UTF8)
                        Write-Host "     [OK] HTML Code Saved" -ForegroundColor Green
                        $res.HtmlDownloaded = $true
                    }
                } catch {
                    Write-Warning "download_file HTML failed: $_"
                }
            }

            if (-not $res.HtmlDownloaded) {
                $htmlUrl = $null
                if ($screenData.htmlCode.downloadUrl) { $htmlUrl = $screenData.htmlCode.downloadUrl }
                elseif ($screenData.html_code.download_url) { $htmlUrl = $screenData.html_code.download_url }

                if ($htmlUrl) {
                    curl.exe -s -L -H "X-Goog-Api-Key: $ApiKey" "$htmlUrl" -o "$htmlFilePath"
                    if (Test-Path $htmlFilePath) {
                        Write-Host "     [OK] HTML Downloaded via curl" -ForegroundColor Green
                        $res.HtmlDownloaded = $true
                    }
                }
            }

            # 2. Download Screenshot Image
            $imgFileName = $null
            if ($screenData.screenshot.name) { $imgFileName = $screenData.screenshot.name }
            elseif ($screenData.screenshot_name) { $imgFileName = $screenData.screenshot_name }

            if ($imgFileName) {
                try {
                    $imgResp = Invoke-StitchTool -toolName "download_file" -arguments @{ name = $imgFileName }
                    $imgBase64 = $null
                    if ($imgResp.result.image) { $imgBase64 = $imgResp.result.image }
                    elseif ($imgResp.result.content) {
                        foreach ($c in $imgResp.result.content) {
                            if ($c.type -eq "image" -and $c.data) { $imgBase64 = $c.data }
                            elseif ($c.type -eq "text" -and $c.text) {
                                try {
                                    $pj = $c.text | ConvertFrom-Json
                                    if ($pj.image) { $imgBase64 = $pj.image }
                                } catch {}
                            }
                        }
                    }
                    if ($imgBase64) {
                        $imgBytes = [System.Convert]::FromBase64String($imgBase64)
                        [System.IO.File]::WriteAllBytes($imgPath, $imgBytes)
                        Write-Host "     [OK] Screenshot Saved" -ForegroundColor Green
                        $res.ImageDownloaded = $true
                    }
                } catch {
                    Write-Warning "download_file Image failed: $_"
                }
            }

            if (-not $res.ImageDownloaded) {
                $imgUrl = $null
                if ($screenData.screenshot.downloadUrl) { $imgUrl = $screenData.screenshot.downloadUrl }
                elseif ($screenData.screenshot_download_url) { $imgUrl = $screenData.screenshot_download_url }

                if ($imgUrl) {
                    curl.exe -s -L -H "X-Goog-Api-Key: $ApiKey" "$imgUrl" -o "$imgPath"
                    if (Test-Path $imgPath) {
                        Write-Host "     [OK] Screenshot Downloaded via curl" -ForegroundColor Green
                        $res.ImageDownloaded = $true
                    }
                }
            }

        } catch {
            Write-Error "Failed to process $($item.safeName): $_"
            $res.Error = "$_"
        }
    }

    $results += $res
}

# Update mcp_config.json if valid API key was used
if ($ApiKey) {
    $mcpConfigFile = "C:\Users\Muk-Pc1\.gemini\config\mcp_config.json"
    try {
        $mcpContent = @'
{
  "mcpServers": {
    "StitchMCP": {
      "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://stitch.googleapis.com/mcp",
        "--header",
        "X-Goog-Api-Key: "
      ],
      "env": {}
    }
  }
}
'@
        $mcpContent = $mcpContent.Replace('X-Goog-Api-Key: ', "X-Goog-Api-Key: $ApiKey")
        [System.IO.File]::WriteAllText($mcpConfigFile, $mcpContent, [System.Text.Encoding]::UTF8)
        Write-Host "`n[i] Updated mcp_config.json with API Key." -ForegroundColor DarkCyan
    } catch {}
}

# Generate Gallery from Templates
$tplPath = Join-Path $scriptDir "gallery_template.html"
$cardTplPath = Join-Path $scriptDir "card_template.html"

if ((Test-Path $tplPath) -and (Test-Path $cardTplPath)) {
    $tpl = [System.IO.File]::ReadAllText($tplPath, [System.Text.Encoding]::UTF8)
    $rawCardTpl = [System.IO.File]::ReadAllText($cardTplPath, [System.Text.Encoding]::UTF8)
    
    # Split card template and button templates
    $parts = $rawCardTpl -split "<!-- BTN_TEMPLATES_START"
    $cardTpl = $parts[0].Trim()
    $btnPart = if ($parts.Count -gt 1) { $parts[1] } else { "" }

    function Get-TplSnippet([string]$snippetKey) {
        $regex = "(?m)^" + [regex]::Escape($snippetKey) + ":(.*)$"
        if ($btnPart -match $regex) {
            return $Matches[1].Trim()
        }
        return ""
    }

    $tHtmlReady = Get-TplSnippet "HTML_READY"
    $tHtmlPending = Get-TplSnippet "HTML_PENDING"
    $tPngReady = Get-TplSnippet "PNG_READY"
    $tPngPending = Get-TplSnippet "PNG_PENDING"
    $tImgPlaceholder = Get-TplSnippet "IMG_PLACEHOLDER"

    $cards = New-Object System.Text.StringBuilder
    foreach ($r in $results) {
        $imgTag = if ($r.ImageDownloaded) {
            "<img src='" + $r.SafeName + ".png' alt='" + $r.SafeName + "'>"
        } else {
            $tImgPlaceholder
        }

        $htmlBtn = if ($r.HtmlDownloaded) {
            $tHtmlReady.Replace("{{SAFE_NAME}}", $r.SafeName)
        } else {
            $tHtmlPending.Replace("{{ID}}", $r.Id).Replace("{{SAFE_NAME}}", $r.SafeName)
        }

        $pngBtn = if ($r.ImageDownloaded) {
            $tPngReady.Replace("{{SAFE_NAME}}", $r.SafeName)
        } else {
            $tPngPending.Replace("{{SAFE_NAME}}", $r.SafeName).Replace("{{ID}}", $r.Id)
        }

        $cardHtml = $cardTpl.Replace("{{CATEGORY}}", $r.Category).Replace("{{TITLE}}", $r.Title).Replace("{{ID}}", $r.Id).Replace("{{SAFE_NAME}}", $r.SafeName).Replace("{{BATCH}}", $r.Batch.ToString()).Replace("{{INDEX}}", $r.Index.ToString()).Replace("{{IMG_TAG}}", $imgTag).Replace("{{HTML_BTN}}", $htmlBtn).Replace("{{PNG_BTN}}", $pngBtn)

        [void]$cards.AppendLine($cardHtml)
    }

    $finalHtml = $tpl.Replace("{{PROJECT_ID}}", $ProjectId).Replace("{{SCREEN_COUNT}}", $results.Count.ToString()).Replace("{{CARDS_HTML}}", $cards.ToString())
    $indexPath = Join-Path $OutputDir "index.html"
    if (Test-Path $indexPath) {
        $existing = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
        if ($existing -match "phase-section-header") {
            $backupPath = Join-Path $OutputDir "index.backup.html"
            Copy-Item $indexPath -Destination $backupPath -Force
            Write-Host "`n[i] Preserving customized index.html (5 journey phases). Saved generated version to index_generated.html" -ForegroundColor Yellow
            $indexPath = Join-Path $OutputDir "index_generated.html"
        }
    }
    [System.IO.File]::WriteAllText($indexPath, $finalHtml, [System.Text.Encoding]::UTF8)
    Write-Host "`n[OK] Interactive gallery created at: $indexPath" -ForegroundColor Green
}

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host " Status of Math Genius Screens (19 Screens)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
$results | Format-Table -Property Index, Batch, Category, SafeName, HtmlDownloaded, ImageDownloaded -AutoSize
