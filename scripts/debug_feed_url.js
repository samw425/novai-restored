const Parser = require('rss-parser');
const parser = new Parser();

const URLS = [
    'https://news.mit.edu/rss/topic/robotics',
    'http://export.arxiv.org/rss/cs.RO'
];

async function testFeeds() {
    for (const url of URLS) {
        console.log(`\nTesting: ${url}`);
        try {
            const feed = await parser.parseURL(url);
            console.log(`✅ Success! Found ${feed.items.length} items.`);
            console.log(`   Title: ${feed.title}`);
        } catch (e) {
            console.error(`❌ Failed: ${e.message}`);
        }
    }
}

testFeeds();
