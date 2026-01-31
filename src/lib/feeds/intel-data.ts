export const US_INTEL_TECH_KEYWORDS = [
    'ai', 'artificial intelligence', 'cyber', 'digital', 'quantum', 'crypto',
    'hack', 'surveillance', 'algorithm', 'data', 'network', 'cloud',
    'chip', 'semiconductor', 'biometric', 'autonomous', 'drone', 'space',
    'technology', 'software', 'malware', 'ransomware', 'infrastructure',
    'computing', 'robotics', 'automation', 'virtual', 'internet', 'web',
    'telecom', '5g', '6g', 'satellite', 'missile', 'hypersonic', 'nuclear',
    'biological', 'chemical', 'weapon', 'defense', 'security', 'intelligence',
    'espionage', 'threat', 'attack', 'breach', 'vulnerability', 'exploit',
    'investigation', 'federal', 'arrest', 'indictment', 'fraud', 'criminal',
    'antitrust', 'monopoly', 'competition', 'merger', 'acquisition', 'divestiture'
];

export const US_INTEL_FEEDS = {
    FBI: 'https://news.google.com/rss/search?q=site:fbi.gov&hl=en-US&gl=US&ceid=US:en',
    NSA: 'https://news.google.com/rss/search?q=site:nsa.gov&hl=en-US&gl=US&ceid=US:en',
    DHS: 'https://news.google.com/rss/search?q=site:dhs.gov&hl=en-US&gl=US&ceid=US:en',
    CISA: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    CIA: 'https://news.google.com/rss/search?q=site:cia.gov&hl=en-US&gl=US&ceid=US:en',
    ODNI: 'https://news.google.com/rss/search?q=site:dni.gov&hl=en-US&gl=US&ceid=US:en',
    STATE: 'https://www.state.gov/rss-feed/department-press-briefings/feed/',
    DOD: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=10',
    DOJ: 'https://news.google.com/rss/search?q=site:justice.gov&hl=en-US&gl=US&ceid=US:en',
    WHITE_HOUSE: 'https://news.google.com/rss/search?q=site:whitehouse.gov&hl=en-US&gl=US&ceid=US:en',
};

export const US_INTEL_FAILSAFE = [
    {
        title: "DOJ Sues to Block Major Tech Merger Citing AI Monopoly Concerns",
        link: "https://www.justice.gov/atr/news",
        pubDate: "2025-01-28T12:00:00Z",
        contentSnippet: "The Department of Justice Antitrust Division has filed a civil antitrust lawsuit to block the proposed acquisition, citing irreparable harm to competition in the generative AI market.",
        agency: "DOJ",
        source: "Official Feed",
        novai_analysis: "ANTITRUST ACTION: Aggressive enforcement against AI market consolidation."
    },
    {
        title: "NSA Launches AI Security Center to Combat Algorithmic Threats",
        link: "https://www.nsa.gov/Press-Room/Press-Releases-View/Article/3539516/nsa-announces-new-artificial-intelligence-security-center/",
        pubDate: "2025-01-28T10:00:00Z",
        contentSnippet: "The National Security Agency is consolidating its AI expertise to protect US national security systems from adversarial AI targeting.",
        agency: "NSA",
        source: "Official Feed",
        novai_analysis: "CRITICAL: Formalization of AI defense doctrine."
    }
];

export function generateHistoricalItems(count: number, agencyFilter: string) {
    const items = [];
    const agencies = agencyFilter === 'ALL' ? ['CIA', 'FBI', 'NSA', 'DHS', 'ODNI', 'DEFENSE'] : [agencyFilter];

    for (let i = 0; i < count; i++) {
        const agency = agencies[Math.floor(Math.random() * agencies.length)];
        items.push({
            title: `[ARCHIVE] Declassified Intelligence Report #${Math.floor(Math.random() * 10000)}`,
            link: '#',
            pubDate: new Date(Date.now() - (1000000000 + i * 100000000)).toISOString(),
            contentSnippet: "Historical intelligence data retrieved from agency archives.",
            agency: agency,
            source: "Archive",
            novai_analysis: "HISTORICAL RECORD: Retained for pattern analysis."
        });
    }
    return items;
}
