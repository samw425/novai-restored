
import Parser from 'rss-parser';

const parser = new Parser();

const FEEDS = [
    'https://news.google.com/rss/search?q=US+Civil+Unrest+Protests&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=US+Border+Security+Crisis&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=FBI+Breaking+News&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=Sudan+Conflict&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=South+China+Sea+Tension&hl=en-US&gl=US&ceid=US:en'
];

async function checkFeeds() {
    console.log('Checking feeds...');
    for (const url of FEEDS) {
        try {
            const feed = await parser.parseURL(url);
            console.log(`\n--- Feed: ${url} ---`);
            console.log(`Items found: ${feed.items.length}`);
            feed.items.slice(0, 3).forEach(item => {
                console.log(`- [${item.pubDate}] ${item.title}`);
            });
        } catch (e) {
            console.error(`Failed to fetch ${url}:`, e.message);
        }
    }
}

checkFeeds();
