
const Parser = require('rss-parser');

const FEEDS = {
    FBI: 'https://www.fbi.gov/feeds/national-press-releases/rss.xml', // Keeping verified direct feed
    NSA: 'https://news.google.com/rss/search?q=site:nsa.gov&hl=en-US&gl=US&ceid=US:en', // Switched to site-specific news
    DHS: 'http://feeds.feedburner.com/dhs/zOAi', // Legacy but usually works
    CISA: 'https://www.cisa.gov/cybersecurity-advisories/all.xml', // Verified
    CIA: 'https://news.google.com/rss/search?q=site:cia.gov&hl=en-US&gl=US&ceid=US:en', // Switched to site-specific news
    ODNI: 'https://news.google.com/rss/search?q=site:dni.gov&hl=en-US&gl=US&ceid=US:en', // Switched to site-specific news
    STATE: 'https://www.state.gov/rss-feed/department-press-briefings/feed/', // Updated verified URL
    DOD: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10', // Verified
    DOJ: 'https://www.justice.gov/news/rss', // Updated verified URL
    WHITE_HOUSE: 'https://news.google.com/rss/search?q=site:whitehouse.gov/briefing-room&hl=en-US&gl=US&ceid=US:en', // Switched to briefing room site search
};

const parser = new Parser({
    timeout: 10000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
});

async function testFeeds() {
    console.log("Testing Updated Feeds...");
    for (const [agency, url] of Object.entries(FEEDS)) {
        try {
            console.log(`Fetching ${agency}...`);
            const feed = await parser.parseURL(url);
            console.log(`✅ ${agency}: Found ${feed.items.length} items`);
            if (feed.items.length > 0) {
                console.log(`   Sample: ${feed.items[0].title}`);
            }
        } catch (error) {
            console.log(`❌ ${agency}: Failed - ${error.message}`);
        }
    }
}

testFeeds();
