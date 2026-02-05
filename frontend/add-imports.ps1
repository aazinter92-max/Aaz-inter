$sourceDir = "c:\Users\HP\Desktop\AAZ\frontend\src"
$files = Get-ChildItem -Path $sourceDir -Include *.js,*.jsx -Recurse

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if file is the api.js config itself
    if ($file.Name -eq "api.js") { continue }
    
    # Check if file uses api() function but doesn't import it
    if (($content -match '\bapi\(') -and ($content -notmatch "import.*\bapi\b.*from.*config/api")) {
        Write-Host "Adding import to: $($file.FullName.Replace($sourceDir, ''))"
        
        # Calculate relative path to config/api.js
        $relativePath = $file.DirectoryName.Replace($sourceDir, '').Replace('\', '/').Trim('/')
        if ($relativePath) {
            $depth = ($relativePath -split '/').Length
        } else {
            $depth = 0
        }
        
        $importPath = if ($depth -eq 0) { './config/api' } else { ('../' * $depth) + 'config/api' }
        
        # Add import after the last import statement
        if ($content -match '(?s)(import[^;]+;)(\r?\n)(?!import)') {
            $content = $content -replace '(?s)(import[^;]+;)(\r?\n)(?!import)', "`$1`$2import { api } from '$importPath';`$2"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $count++
        }
    }
}

Write-Host "`nAdded imports to $count files" -ForegroundColor Green
