
const Parser = require('rss-parser');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeout: 10000,
});

const FEEDS = {
    FBI: 'https://www.fbi.gov/feeds/national-press-releases/rss.xml',
    NSA: 'https://news.google.com/rss/search?q=site:nsa.gov&hl=en-US&gl=US&ceid=US:en',
    DHS: 'http://feeds.feedburner.com/dhs/zOAi',
    CISA: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    CIA: 'https://news.google.com/rss/search?q=site:cia.gov&hl=en-US&gl=US&ceid=US:en',
    ODNI: 'https://news.google.com/rss/search?q=site:dni.gov&hl=en-US&gl=US&ceid=US:en',
    STATE: 'https://www.state.gov/rss-feed/department-press-briefings/feed/',
    DOD: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10',
    DOJ: 'https://news.google.com/rss/search?q=site:justice.gov/news&hl=en-US&gl=US&ceid=US:en',
    WHITE_HOUSE: 'https://news.google.com/rss/search?q=site:whitehouse.gov&hl=en-US&gl=US&ceid=US:en',
    USDT: 'https://news.google.com/rss/search?q=site:home.treasury.gov/news/press-releases&hl=en-US&gl=US&ceid=US:en'
};

async function checkFeeds() {
    console.log("Checking feeds...");
    for (const [name, url] of Object.entries(FEEDS)) {
        try {
            console.log(`Fetching ${name}...`);
            const feed = await parser.parseURL(url + `?t=${Date.now()}`);
            console.log(`✅ ${name}: Found ${feed.items.length} items.`);
            if (feed.items.length > 0) {
                console.log(`   Latest: "${feed.items[0].title}" (${feed.items[0].pubDate})`);
            }
        } catch (e) {
            console.error(`❌ ${name}: Failed - ${e.message}`);
        }
    }
}

checkFeeds();
