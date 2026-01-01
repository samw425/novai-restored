const fs = require('fs');
const path = 'stelar/web/public/rankings.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Corrections to apply
const corrections = [
    { name: 'Kelly Clarkson', newGenre: 'Pop', addTo: ['pop', 'major'], removeFrom: ['hip_hop', 'indie', 'r_and_b', 'rap'] }
];

corrections.forEach(correction => {
    console.log(`Applying fix for: ${correction.name}`);

    // 1. Fix in Global list
    const globalArtist = data.rankings.global.find(a => a.name === correction.name);
    if (globalArtist) {
        globalArtist.genre = correction.newGenre;
        console.log(`- Updated Global genre to ${correction.newGenre}`);
    }

    // 2. Fix in existing categories (update genre generally)
    Object.keys(data.rankings).forEach(cat => {
        const artist = data.rankings[cat].find(a => a.name === correction.name);
        if (artist) {
            artist.genre = correction.newGenre;
            // correction.removeFrom handling
            if (correction.removeFrom.includes(cat)) {
                data.rankings[cat] = data.rankings[cat].filter(a => a.name !== correction.name);
                console.log(`- Removed from [${cat}]`);
            }
        }
    });

    // 3. Add to new categories if not present
    if (globalArtist) { // Need the artist object to add
        correction.addTo.forEach(cat => {
            if (!data.rankings[cat]) data.rankings[cat] = [];
            const exists = data.rankings[cat].find(a => a.name === correction.name);
            if (!exists) {
                // Clone and add
                data.rankings[cat].push({ ...globalArtist });
                // Sort by rank to maintain order
                data.rankings[cat].sort((a, b) => a.rank - b.rank);
                console.log(`- Added to [${cat}]`);
            }
        });
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('rankings.json patched successfully.');
