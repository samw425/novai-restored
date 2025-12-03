const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
});

const feeds = [
    { name: 'CIA (Google)', url: 'https://news.google.com/rss/search?q=site:cia.gov&hl=en-US&gl=US&ceid=US:en' },
    { name: 'FBI (Google)', url: 'https://news.google.com/rss/search?q=site:fbi.gov&hl=en-US&gl=US&ceid=US:en' },
    { name: 'DOD (Google)', url: 'https://news.google.com/rss/search?q=site:defense.gov&hl=en-US&gl=US&ceid=US:en' },
    { name: 'State (Official)', url: 'https://www.state.gov/rss-feed/press-releases/feed/' },
    { name: 'Treasury (Google)', url: 'https://news.google.com/rss/search?q=site:home.treasury.gov&hl=en-US&gl=US&ceid=US:en' },
    { name: 'NSA (Google)', url: 'https://news.google.com/rss/search?q=site:nsa.gov&hl=en-US&gl=US&ceid=US:en' },
    { name: 'DHS (Google)', url: 'https://news.google.com/rss/search?q=site:dhs.gov&hl=en-US&gl=US&ceid=US:en' }
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
