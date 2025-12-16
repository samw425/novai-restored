
const Parser = require('rss-parser');

const FEEDS = {
    FBI: 'https://www.fbi.gov/feeds/national-press-releases/rss.xml',
    NSA: 'https://www.nsa.gov/rss/news/',
    DHS: 'http://feeds.feedburner.com/dhs/zOAi',
    CISA: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    CIA: 'https://www.cia.gov/rss/cia-news-and-information.rss',
    ODNI: 'https://www.dni.gov/index.php/newsroom?format=feed&type=rss',
    STATE: 'https://www.state.gov/rss/channels/press.xml',
    DOD: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10',
    DOJ: 'https://www.justice.gov/feeds/opa/justice-news.xml',
    WHITE_HOUSE: 'https://www.whitehouse.gov/feed/',
};

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    },
    timeout: 10000,
});

async function testFeeds() {
    console.log("Testing Feeds...");
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
