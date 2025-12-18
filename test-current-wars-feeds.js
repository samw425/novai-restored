
const Parser = require('rss-parser');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeout: 10000,
});

const FEEDS = [
    { name: 'Jerusalem Post', url: 'https://www.jpost.com/rss/rssfeedsheadlines.aspx' },
    { name: 'Times of Israel', url: 'https://www.timesofisrael.com/feed/' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
    { name: 'Kyiv Independent', url: 'https://kyivindependent.com/feed/' },
    { name: 'BBC Europe', url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml' },
];

async function checkFeeds() {
    console.log("Checking Current Wars feeds...");
    for (const feedSource of FEEDS) {
        try {
            console.log(`Fetching ${feedSource.name} (${feedSource.url})...`);
            const feed = await parser.parseURL(feedSource.url);
            console.log(`✅ ${feedSource.name}: Found ${feed.items.length} items.`);
            if (feed.items.length > 0) {
                console.log(`   Latest: "${feed.items[0].title}"`);
            }
        } catch (e) {
            console.error(`❌ ${feedSource.name}: Failed - ${e.message}`);
        }
    }
}

checkFeeds();
