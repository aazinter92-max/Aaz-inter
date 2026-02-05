
const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules') {
        filelist = walkSync(filepath, filelist);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        filelist.push(filepath);
      }
    }
  });
  return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // FIX 1: Imports in middle of file
  // Find all 'import { api } ...'
  const importRegex = /^\s*import\s+\{\s*api\s*\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm;
  let importsFound = [];
  let match;
  
  // Store all api imports found
  while ((match = importRegex.exec(content)) !== null) {
      importsFound.push(match[0]);
  }
  
  if (importsFound.length > 0) {
      // Remove all found imports
      content = content.replace(importRegex, '');
      
      // Determine correct import path
      const relDir = path.relative(path.dirname(file), path.join(srcDir, 'config', 'api'));
      let importPath = relDir.replace(/\\/g, '/');
      if (!importPath.startsWith('.')) importPath = './' + importPath;
      
      // Add valid import at the top
      // Find the last import ... 
      const lastImportMatch = content.match(/import\s+.*from\s+['"][^'"]+['"];?/g);
      if (lastImportMatch) {
          const lastImport = lastImportMatch[lastImportMatch.length - 1];
          const lastImportIdx = content.lastIndexOf(lastImport);
          // Insert after the last import
          const insertPos = lastImportIdx + lastImport.length;
          content = content.slice(0, insertPos) + `\nimport { api } from '${importPath}';` + content.slice(insertPos);
      } else {
          // No imports? add to top
          content = `import { api } from '${importPath}';\n` + content;
      }
  }


  // FIX 2: Broken fetch calls: fetch(api('url') missing paren
  // Look for: fetch(api("string") OR fetch(api('string')  
  // where it is immediately followed by a semicolon or newline or variable assignment without closing paren
  
  // Regex: fetch\(api\((['"`][^'"`]+['"`])\)(?!\))
  // Wait, the previous error was: fetch(api("url");  <-- missing paren for fetch
  // So we look for: fetch(api("url") [no closing paren for fetch]
  
  // Pattern: fetch(api(ARGS) NOT_FOLLOWED_BY_PAREN
  // But regex lookahead is tricky. 
  // Let's look for: fetch(api(str)  or fetch(api(str, opts)
  
  // My previous bad script made: fetch(api('url')
  // We want: fetch(api('url'))
  
  // Replace: fetch(api('url'); -> fetch(api('url'));
  content = content.replace(/fetch\(api\((['"`][^'"`]+['"`])\)\s*;/g, "fetch(api($1));");
  
  // Replace: fetch(api('url').then -> fetch(api('url')).then
  content = content.replace(/fetch\(api\((['"`][^'"`]+['"`])\)\./g, "fetch(api($1)).");
  
  // Replace: await fetch(api('url')\n -> await fetch(api('url'))\n
  // This is hard.
  
  // Let's assume most are `fetch(api('url'),` which was fixed.
  // The remaining are likely `fetch(api('url');` or `fetch(api('url')` at end of line.
  
  // Fix cases where fetch ends directly with api call
  // Look for `fetch(api(SINGLE_ARG)` where it's NOT followed by `)` or `,`
  // Actually, simpler: find `fetch(api(X)` and replace with `fetch(api(X))` if it looks incomplete?
  
  // Let's inspect specific patterns seen in errors.
  // "fetch(api('/api/categories');"
  content = content.replace(/fetch\(api\((['"`][^'"`]+['"`])\s*$/gm, "fetch(api($1))");
  content = content.replace(/fetch\(api\((['"`][^'"`]+['"`])\s*;/gm, "fetch(api($1));");
  content = content.replace(/fetch\(api\((['"`][^'"`]+['"`])\s*\)/gm, "fetch(api($1))"); // prevent double paren if already existing? No, effectively non-op if match
  
  // Correct simple missing paren at end of statement
  // fetch(api("url")   -> fetch(api("url"))
  // We look for fetch(api("...")) (2 parens at end)
  // If we find fetch(api("...")[^)] we fix it.
  
  content = content.replace(/fetch\(api\((['"`][^'"`]+['"`])\)(?![),])/g, "fetch(api($1))");

  if (content !== originalContent) {
    console.log(`Fixing ${file}`);
    fs.writeFileSync(file, content);
  }
});
