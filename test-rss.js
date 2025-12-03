const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
});

const feeds = [
    { name: 'CIA', url: 'https://www.cia.gov/stories/feed' },
    { name: 'FBI', url: 'https://www.fbi.gov/feeds/national-press-releases' },
    { name: 'DOD', url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.aspx?ContentType=1&Site=945&max=10' },
    { name: 'State', url: 'https://www.state.gov/rss-feed/press-releases/feed/' },
    { name: 'Treasury', url: 'https://home.treasury.gov/rss/press-releases' },
    { name: 'NSA', url: 'https://www.nsa.gov/rss/news/' },
    { name: 'DHS', url: 'https://www.dhs.gov/news/releases/press-releases/rss' }
];

async function test() {
    for (const feed of feeds) {
        try {
            console.log(`Fetching ${feed.name} (${feed.url})...`);
            const res = await parser.parseURL(feed.url);
            console.log(`✅ ${feed.name}: Success (${res.items.length} items)`);
        } catch (err) {
            console.log(`❌ ${feed.name}: Failed - ${err.message}`);
        }
    }
}

test();
