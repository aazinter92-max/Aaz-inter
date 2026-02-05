# Comprehensive API URL replacement script
$sourceDir = Join-Path (Get-Location) "src"
$files = Get-ChildItem -Path $sourceDir -Include *.js,*.jsx -Recurse -File

Write-Host "Starting API URL replacement..." -ForegroundColor Cyan
$updatedCount = 0

foreach ($file in $files) {
    if ($file.Name -eq "api.js") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace all fetch calls with localhost:5000
    $content = $content -replace "fetch\(\s*'http://localhost:5000(/[^']+)'\s*\)", "fetch(api('`$1'))"
    $content = $content -replace 'fetch\(\s*"http://localhost:5000(/[^"]+)"\s*\)', 'fetch(api("$1"))'
    $content = $content -replace 'fetch\(\s*`http://localhost:5000(/[^`]+)`\s*\)', 'fetch(api(`$1))'
    
    # Replace io() socket connections
    $content = $content -replace "io\(\s*'http://localhost:5000'\s*,", "io(window.location.origin,"
    $content = $content -replace 'io\(\s*"http://localhost:5000"\s*,', 'io(window.location.origin,'
    
    # Replace image src URLs (keep as is for now, will be handled by backend)
    # $content = $content -replace 'http://localhost:5000/', '/'
    
    # Add import if api() is used but not imported
    if (($content -match '\bapi\(') -and ($content -notmatch "import.*\{[^}]*\bapi\b[^}]*\}.*from.*['\`"].*config/api")) {
        # Calculate relative path
        $relPath = $file.DirectoryName.Replace($sourceDir, '').Replace('\', '/').Trim('/')
        if ($relPath) {
            $depth = ($relPath -split '/').Length
            $importPath = ('../' * $depth) + 'config/api'
        } else {
            $importPath = './config/api'
        }
        
        # Add import after last import
        if ($content -match '(?s)(^import[^;]+;)') {
            # Find all imports
            $imports = [regex]::Matches($content, '^import[^;]+;', [System.Text.RegularExpressions.RegexOptions]::Multiline)
            if ($imports.Count -gt 0) {
                $lastImport = $imports[$imports.Count - 1]
                $insertPos = $lastImport.Index + $lastImport.Length
                $content = $content.Insert($insertPos, "`r`nimport { api } from '$importPath';")
            }
        }
    }
    
    # Save if changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $updatedCount++
    }
}

Write-Host "`nCompleted! Updated $updatedCount files." -ForegroundColor Cyan
