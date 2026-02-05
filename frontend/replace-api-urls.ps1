# Script to replace localhost URLs with API_URL import
$sourceDir = "c:\Users\HP\Desktop\AAZ\frontend\src"

# Get all JS and JSX files
$files = Get-ChildItem -Path $sourceDir -Include *.js,*.jsx -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Check if file contains localhost:5000
    if ($content -match 'localhost:5000') {
        Write-Host "Processing: $($file.Name)"
        
        # Add import if not present and file has localhost references
        if ($content -notmatch "import.*API_URL.*from.*config/api") {
            # Find the last import statement
            if ($content -match '(?s)(import.*?;)(\r?\n)') {
                $lastImport = $matches[1]
                $newline = $matches[2]
                
                # Add our import after the last import
                $importStatement = "import { getApiEndpoint } from '../config/api.js';"
                
                # Calculate relative path
                $relativePath = $file.DirectoryName.Replace($sourceDir, '').Replace('\', '/').Trim('/')
                $depth = ($relativePath -split '/').Count
                if ($depth -eq 0) { $depth = 1 }
                $relativeImport = '../' * $depth + 'config/api.js'
                
                $importStatement = "import { getApiEndpoint } from '$relativeImport';"
                
                $content = $content -replace '(?s)(import.*?;)(\r?\n)(?!import)', "`$1`$2$importStatement`$2"
                $modified = $true
            }
        }
        
        # Replace fetch URLs
        $content = $content -replace "fetch\(\s*[`'\"]http://localhost:5000(/[^`'\"]*)[`'\"]", "fetch(getApiEndpoint('`$1')"
        $content = $content -replace "fetch\(\s*`http://localhost:5000(/[^`]*)`", "fetch(getApiEndpoint('`$1')"
        
        # Replace io() socket URLs
        $content = $content -replace "io\(\s*[`'\"]http://localhost:5000[`'\"]", "io(window.location.origin"
        
        # Replace image src URLs (keep these as template literals)
        $content = $content -replace "[`'\"]http://localhost:5000(\$\{[^}]+\})[`'\"]", "getApiEndpoint('`$1')"
        $content = $content -replace "http://localhost:5000(\$\{[^}]+\})", "getApiEndpoint('`$1')"
        
        if ($modified -or ($content -ne (Get-Content $file.FullName -Raw))) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  ✓ Updated $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`nDone! Please review the changes." -ForegroundColor Cyan
