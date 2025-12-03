export type FeedCategory = 'research' | 'tools' | 'policy' | 'market' | 'robotics' | 'ai' | 'security' | 'us-intel' | 'current-wars';

export interface FeedSource {
    id: string;
    name: string;
    url: string;
    category: FeedCategory;
    priority: number; // 1-10, higher = more important
    region?: 'US' | 'Europe' | 'Asia' | 'Global';
}

export const RSS_FEEDS: FeedSource[] = [
    // ========== RESEARCH LABS & AI ORGS (Priority 10) ==========
    { id: 'openai', name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', category: 'research', priority: 10, region: 'US' },
    { id: 'google-ai', name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', category: 'research', priority: 10, region: 'US' },
    { id: 'deepmind', name: 'DeepMind Blog', url: 'https://deepmind.google/blog/rss.xml', category: 'research', priority: 10, region: 'Europe' },
    { id: 'anthropic', name: 'Anthropic', url: 'https://www.anthropic.com/index/rss.xml', category: 'research', priority: 10, region: 'US' },
    { id: 'meta-ai', name: 'Meta AI', url: 'https://ai.facebook.com/blog/rss/', category: 'research', priority: 10, region: 'US' },
    { id: 'microsoft-research', name: 'Microsoft Research', url: 'https://www.microsoft.com/en-us/research/feed/', category: 'research', priority: 10, region: 'US' },
    { id: 'aws-ml', name: 'AWS Machine Learning', url: 'https://aws.amazon.com/blogs/machine-learning/feed/', category: 'research', priority: 9, region: 'US' },
    { id: 'nvidia-blog', name: 'NVIDIA AI', url: 'https://blogs.nvidia.com/feed/', category: 'research', priority: 9, region: 'US' },
    { id: 'baair', name: 'Berkeley AI Research', url: 'https://bair.berkeley.edu/blog/feed.xml', category: 'research', priority: 9, region: 'US' },
    { id: 'stanford-hai', name: 'Stanford HAI', url: 'https://hai.stanford.edu/news/feed', category: 'research', priority: 9, region: 'US' },
    { id: 'mit-csail', name: 'MIT CSAIL', url: 'https://www.csail.mit.edu/news/rss', category: 'research', priority: 9, region: 'US' },

    // ========== MARKET & BUSINESS INTELLIGENCE (Priority 9-10) ==========
    { id: 'techcrunch-ai', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'market', priority: 10, region: 'US' },
    { id: 'venturebeat-ai', name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'market', priority: 10, region: 'US' },
    { id: 'reuters-tech', name: 'Reuters Technology', url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', category: 'market', priority: 9, region: 'Global' },
    { id: 'bloomberg-tech', name: 'Bloomberg Tech', url: 'https://www.bloomberg.com/technology.rss', category: 'market', priority: 9, region: 'Global' },
    { id: 'cnbc-tech', name: 'CNBC Technology', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', category: 'market', priority: 8, region: 'US' },
    { id: 'seeking-alpha-tech', name: 'Seeking Alpha Tech', url: 'https://seekingalpha.com/feed.xml', category: 'market', priority: 8, region: 'US' },
    { id: 'investors-business-daily', name: 'Investors Business Daily', url: 'https://www.investors.com/feed/', category: 'market', priority: 8, region: 'US' },
    { id: 'wsj-tech', name: 'WSJ Technology', url: 'https://feeds.a.dj.com/rss/RSSWSJD.xml', category: 'market', priority: 9, region: 'US' },
    { id: 'ft-tech', name: 'Financial Times Tech', url: 'https://www.ft.com/technology?format=rss', category: 'market', priority: 9, region: 'Europe' },
    { id: 'economist-science', name: 'The Economist Sci/Tech', url: 'https://www.economist.com/science-and-technology/rss.xml', category: 'market', priority: 8, region: 'Global' },
    { id: 'business-insider-tech', name: 'Business Insider Tech', url: 'https://feeds.businessinsider.com/type/news/category/tech', category: 'market', priority: 7, region: 'US' },
    { id: 'forbes-tech', name: 'Forbes Tech', url: 'https://www.forbes.com/technology/feed/', category: 'market', priority: 8, region: 'US' },

    // ========== SECURITY & CYBER THREATS (Priority 10) ==========
    { id: 'the-hacker-news', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews?format=xml', category: 'security', priority: 10, region: 'Global' },
    { id: 'krebs-security', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', category: 'security', priority: 10, region: 'US' },
    { id: 'bleeping-computer', name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'security', priority: 9, region: 'US' },
    { id: 'dark-reading', name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', category: 'security', priority: 9, region: 'US' },
    { id: 'schneier', name: 'Schneier on Security', url: 'https://www.schneier.com/blog/atom.xml', category: 'security', priority: 9, region: 'US' },
    { id: 'threatpost', name: 'Threatpost', url: 'https://threatpost.com/feed/', category: 'security', priority: 8, region: 'US' },
    { id: 'cisa-alerts', name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml', category: 'security', priority: 10, region: 'US' },
    { id: 'ncsc-uk', name: 'NCSC UK', url: 'https://www.ncsc.gov.uk/feed/rss', category: 'security', priority: 9, region: 'Europe' },
    { id: 'security-week', name: 'SecurityWeek', url: 'https://feeds.feedburner.com/SecurityWeek', category: 'security', priority: 8, region: 'US' },
    { id: 'graham-cluley', name: 'Graham Cluley', url: 'https://grahamcluley.com/feed/', category: 'security', priority: 8, region: 'Europe' },

    // ========== ENGINEERING, TOOLS & CODE (Priority 8) ==========
    { id: 'github-blog', name: 'GitHub Blog', url: 'https://github.blog/feed/', category: 'tools', priority: 9, region: 'US' },
    { id: 'huggingface', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: 'tools', priority: 10, region: 'Global' },
    { id: 'langchain', name: 'LangChain', url: 'https://blog.langchain.dev/rss/', category: 'tools', priority: 9, region: 'US' },
    { id: 'pytorch', name: 'PyTorch', url: 'https://pytorch.org/blog/feed.xml', category: 'tools', priority: 8, region: 'US' },
    { id: 'tensorflow', name: 'TensorFlow', url: 'https://blog.tensorflow.org/feeds/posts/default', category: 'tools', priority: 8, region: 'US' },
    { id: 'dev-to', name: 'Dev.to', url: 'https://dev.to/feed', category: 'tools', priority: 7, region: 'Global' },
    { id: 'hashnode', name: 'Hashnode Featured', url: 'https://hashnode.com/n/featured/rss', category: 'tools', priority: 7, region: 'Global' },
    { id: 'hackernoon', name: 'HackerNoon', url: 'https://hackernoon.com/feed', category: 'tools', priority: 7, region: 'Global' },
    { id: 'infoq', name: 'InfoQ', url: 'https://feed.infoq.com/', category: 'tools', priority: 8, region: 'US' },
    { id: 'stackoverflow-blog', name: 'Stack Overflow', url: 'https://stackoverflow.blog/feed/', category: 'tools', priority: 7, region: 'US' },

    // ========== ROBOTICS & HARDWARE (Priority 8) ==========
    { id: 'robot-report', name: 'The Robot Report', url: 'https://www.therobotreport.com/feed/', category: 'robotics', priority: 9, region: 'US' },
    { id: 'ieee-robotics', name: 'IEEE Robotics', url: 'https://spectrum.ieee.org/feeds/topic/robotics.rss', category: 'robotics', priority: 9, region: 'Global' },
    { id: 'robotics-business', name: 'Robotics Business', url: 'https://www.roboticsbusinessreview.com/feed/', category: 'robotics', priority: 8, region: 'US' },
    { id: 'boston-dynamics', name: 'Boston Dynamics', url: 'https://bostondynamics.com/feed/', category: 'robotics', priority: 9, region: 'US' },

    // ========== AI NEWS & ANALYSIS (Priority 8) ==========
    { id: 'wired-ai', name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'ai', priority: 8, region: 'US' },
    { id: 'verge-ai', name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'ai', priority: 8, region: 'US' },
    { id: 'ars-technica-ai', name: 'Ars Technica AI', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: 'ai', priority: 8, region: 'US' },
    { id: 'mit-tech-review', name: 'MIT Tech Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'ai', priority: 9, region: 'US' },
    { id: 'last-week-in-ai', name: 'Last Week in AI', url: 'https://lastweekin.ai/feed', category: 'ai', priority: 8, region: 'Global' },
    { id: 'ben-evans', name: 'Ben Evans', url: 'https://www.ben-evans.com/benedictevans?format=rss', category: 'ai', priority: 8, region: 'Europe' },
    { id: 'stratechery', name: 'Stratechery', url: 'https://stratechery.com/feed/', category: 'market', priority: 9, region: 'US' },

    // ========== US INTELLIGENCE AGENCIES (Priority 10) ==========
    { id: 'cia-news', name: 'CIA News', url: 'https://news.google.com/rss/search?q=site:cia.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'fbi-news', name: 'FBI News', url: 'https://news.google.com/rss/search?q=site:fbi.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'dod-news', name: 'Dept of Defense', url: 'https://news.google.com/rss/search?q=site:defense.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'state-dept', name: 'State Department', url: 'https://www.state.gov/rss-feed/press-releases/feed/', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'treasury-news', name: 'Treasury Dept', url: 'https://news.google.com/rss/search?q=site:home.treasury.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'nsa-news', name: 'NSA News', url: 'https://news.google.com/rss/search?q=site:nsa.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'dhs-news', name: 'DHS News', url: 'https://news.google.com/rss/search?q=site:dhs.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'white-house-news', name: 'White House', url: 'https://news.google.com/rss/search?q=site:whitehouse.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },

    // ========== CURRENT WARS (Priority 10) ==========
    // Israel / Gaza
    { id: 'jpost-war', name: 'Jerusalem Post', url: 'https://www.jpost.com/rss/rssfeedsheadlines.aspx', category: 'current-wars', priority: 10, region: 'Global' },
    { id: 'times-israel', name: 'Times of Israel', url: 'https://www.timesofisrael.com/feed/', category: 'current-wars', priority: 10, region: 'Global' },
    { id: 'aljazeera-war', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'current-wars', priority: 10, region: 'Global' },

    // Russia / Ukraine
    { id: 'kyiv-independent', name: 'Kyiv Independent', url: 'https://kyivindependent.com/feed/', category: 'current-wars', priority: 10, region: 'Europe' },
    { id: 'bbc-europe', name: 'BBC Europe', url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', category: 'current-wars', priority: 10, region: 'Europe' },
];

// Helper functions
export const getCategoryFeeds = (category: string): FeedSource[] => {
    if (category === 'All') return RSS_FEEDS;
    return RSS_FEEDS.filter(feed => feed.category === category);
};

export const getTopPriorityFeeds = (limit = 20): FeedSource[] => {
    return RSS_FEEDS.sort((a, b) => b.priority - a.priority).slice(0, limit);
};

export const getFeedsByRegion = (region: string): FeedSource[] => {
    return RSS_FEEDS.filter(feed => feed.region === region);
};

export const getAllFeeds = (): FeedSource[] => RSS_FEEDS;
