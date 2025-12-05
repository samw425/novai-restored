const Parser = require('rss-parser');
const parser = new Parser();

// Updated Keywords from src/app/api/feed/anti-trust/route.ts
const ANTITRUST_KEYWORDS = [
    'antitrust', 'monopoly', 'doj', 'ftc', 'lina khan', 'vestager',
    'breakup', 'regulation', 'lawsuit', 'investigation', 'compliance',
    'dma', 'dsa', 'gdpr', 'competition market authority', 'cma',
    'google trial', 'apple app store', 'meta lawsuit', 'amazon antitrust',
    'regulator', 'probe', 'eu commission', 'ban', 'fine', 'court', 'legal',
    'policy', 'enforcement', 'congress', 'senate', 'executive order',
    'sovereignty', 'national security', 'export control', 'chips act'
];

// Updated Feeds from src/config/rss-feeds.ts
const TEST_FEEDS = [
    { name: 'NYT Tech', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml' },
    { name: 'Guardian Tech', url: 'https://www.theguardian.com/uk/technology/rss' },
    { name: 'WSJ Tech', url: 'https://feeds.a.dj.com/rss/RSSWSJD.xml' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
    { name: 'Stratechery', url: 'https://stratechery.com/feed/' },
    { name: '404 Media', url: 'https://www.404media.co/rss/' }
];

async function verifyFeeds() {
    console.log('🔍 Starting Anti-Trust Feed Verification (Round 2)...\n');
    let totalMatches = 0;

    for (const feedSource of TEST_FEEDS) {
        try {
            console.log(`Checking ${feedSource.name}...`);
            const feed = await parser.parseURL(feedSource.url);

            const matches = feed.items.filter(item => {
                const text = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
                return ANTITRUST_KEYWORDS.some(keyword => text.includes(keyword));
            });

            if (matches.length > 0) {
                console.log(`✅ Found ${matches.length} matches in ${feedSource.name}`);
                matches.slice(0, 3).forEach(m => console.log(`   - ${m.title}`)); // Show top 3
                totalMatches += matches.length;
            } else {
                console.log(`⚠️  No antitrust matches found in recent items.`);
            }
        } catch (e) {
            console.error(`❌ Failed to fetch ${feedSource.name}: ${e.message}`);
        }
        console.log('---');
    }

    console.log(`\n📊 Verification Complete. Total Matches: ${totalMatches}`);
    if (totalMatches === 0) {
        console.log('❌ CRITICAL: Still no data found.');
    } else {
        console.log('✅ SYSTEM STATUS: OPERATIONAL');
    }
}

verifyFeeds();
