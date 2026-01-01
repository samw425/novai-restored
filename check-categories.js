const fs = require('fs');
const data = JSON.parse(fs.readFileSync('stelar/web/public/rankings.json', 'utf8'));

const artistsToCheck = ['Kelly Clarkson', 'Drake', 'Taylor Swift', 'Kendrick Lamar'];

artistsToCheck.forEach(name => {
    console.log(`\nChecking categories for: ${name}`);
    Object.keys(data.rankings).forEach(category => {
        const found = data.rankings[category].find(a => a.name === name);
        if (found) {
            console.log(`- Found in [${category}]: Genre=${found.genre}, Status=${found.status}`);
        }
    });
});
