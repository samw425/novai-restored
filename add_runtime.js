const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDir = path.join(__dirname, 'src/app/api');

walkDir(targetDir, (filePath) => {
    if (filePath.endsWith('route.ts') || filePath.endsWith('route.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to match existing runtime export: export const runtime = '...'
        const runtimeRegex = /export\s+const\s+runtime\s*=\s*['"](.*?)['"];?/g;

        if (runtimeRegex.test(content)) {
            // It exists. Check if it is already edge.
            content = content.replace(runtimeRegex, "export const runtime = 'edge';");
            // If it was duplicated by my previous run (e.g. at top AND bottom), 
            // the replace might only hit one or all depending on flag.

            // Actually, if I prepended it, now I have TWO.
            // One at the top (mine) and one somewhere else (original nodejs).
            // Example from log:
            // 4 | export const runtime = 'edge';
            // ...
            // 6 | export const runtime = 'nodejs';

            // I need to REMOVE all of them and Insert ONE 'edge'.

            // Let's strip ALL runtime exports first.
            let newContent = content.replace(runtimeRegex, '');

            // Now cleanup double newlines if meaningful
            // newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');

            // Now prepend 'edge' clean.
            // But wait, if I remove it, I might break formatting or context.
            // Replacing usages is safer if I can merge them.

            // Aggressive approach: Remove all `export const runtime = ...;` lines.
            // Then prepend `export const runtime = 'edge';`

            // Reset regex
            const lines = content.split('\n');
            const filteredLines = lines.filter(line => !line.match(/export\s+const\s+runtime\s*=\s*/));

            // Now inject edge at top (after imports logic from before, or just top).
            // Reuse injection logic.

            let lastImportIndex = -1;
            for (let i = 0; i < filteredLines.length; i++) {
                if (filteredLines[i].trim().startsWith('import ') || filteredLines[i].trim().startsWith('type ')) {
                    lastImportIndex = i;
                }
            }

            const injection = "export const runtime = 'edge';";

            if (lastImportIndex !== -1) {
                filteredLines.splice(lastImportIndex + 1, 0, injection);
            } else {
                filteredLines.unshift(injection);
            }

            fs.writeFileSync(filePath, filteredLines.join('\n'));
            console.log(`Fixed: ${filePath}`);

        } else {
            // Doesn't exist. Prepend. (This handles files I missed or clean files)
            // ... Logic same as before ... 
            // But wait, if I ran the previous script, ALL files have at least one 'edge' now.
            // So they ALL match the regex.

            // So this block is mostly for new files.
            // Copied logic:
            const lines = content.split('\n');
            let lastImportIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('type ')) {
                    lastImportIndex = i;
                }
            }
            const injection = "export const runtime = 'edge';";
            if (lastImportIndex !== -1) {
                lines.splice(lastImportIndex + 1, 0, injection);
            } else {
                lines.unshift(injection);
            }
            fs.writeFileSync(filePath, lines.join('\n'));
            console.log(`Injected: ${filePath}`);
        }
    }
});
