
const Parser = require('rss-parser');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeout: 8000,
});

const WAR_MAP_FEEDS = [
    'https://news.google.com/rss/search?q=Ukraine+War&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=Gaza+Conflict&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=US+Carrier+Strike+Group+Location&hl=en-US&gl=US&ceid=US:en',
    'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10',
];

async function checkMapFeeds() {
    console.log("Checking War Room MAP feeds (random sample)...");
    let totalItems = 0;

    for (const url of WAR_MAP_FEEDS) {
        try {
            console.log(`Fetching ${url.substring(0, 50)}...`);
            const feed = await parser.parseURL(url);
            console.log(`✅ Success: ${feed.items.length} items`);
            totalItems += feed.items.length;
        } catch (e) {
            console.error(`❌ Failed: ${e.message}`);
        }
    }
    console.log(`\nTotal items retrieved for map: ${totalItems}`);
}

checkMapFeeds();
