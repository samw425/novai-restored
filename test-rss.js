const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
});

async function test() {
    try {
        console.log('Fetching CIA feed...');
        const feed = await parser.parseURL('https://www.cia.gov/stories/feed');
        console.log(`Success! Found ${feed.items.length} items.`);
        console.log('First item:', feed.items[0].title);
        fs.writeFileSync('rss-test-output.txt', JSON.stringify(feed.items[0], null, 2));
    } catch (err) {
        console.error('Error fetching feed:', err);
        fs.writeFileSync('rss-test-output.txt', `Error: ${err.message}`);
    }
}

test();
