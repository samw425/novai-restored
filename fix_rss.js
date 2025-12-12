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

        // Check for browser build import
        if (content.includes('rss-parser/dist/rss-parser.min.js') && !content.includes('@ts-nocheck')) {
            const newContent = '// @ts-nocheck\n' + content;
            fs.writeFileSync(filePath, newContent);
            console.log(`Added @ts-nocheck: ${filePath}`);
        }
    }
});
