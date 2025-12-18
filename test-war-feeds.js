
const Parser = require('rss-parser');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeout: 10000,
});

const WAR_FEEDS = {
    Ukraine: 'https://news.google.com/rss/search?q=Ukraine+War&hl=en-US&gl=US&ceid=US:en',
    Gaza: 'https://news.google.com/rss/search?q=Gaza+Conflict&hl=en-US&gl=US&ceid=US:en',
    ISW: 'https://www.understandingwar.org/feeds.xml',
    DefenseGov: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10',
};

async function checkFeeds() {
    console.log("Checking War Room feeds...");
    for (const [name, url] of Object.entries(WAR_FEEDS)) {
        try {
            console.log(`Fetching ${name} (${url})...`);
            const feed = await parser.parseURL(url); // Remove + time because Google RSS might not like query params appended
            console.log(`✅ ${name}: Found ${feed.items.length} items.`);
            if (feed.items.length > 0) {
                console.log(`   Latest: "${feed.items[0].title}"`);
            }
        } catch (e) {
            console.error(`❌ ${name}: Failed - ${e.message}`);
        }
    }
}

checkFeeds();
