export type FeedCategory = 'research' | 'tools' | 'policy' | 'market' | 'robotics' | 'ai' | 'security';

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
    { id: 'deepmind', name: 'DeepMind Blog', url: 'https://www.deepmind.com/blog/rss.xml', category: 'research', priority: 10, region: 'Europe' },
    { id: 'anthropic', name: 'Anthropic', url: 'https://www.anthropic.com/index/rss.xml', category: 'research', priority: 10, region: 'US' },
    { id: 'meta-ai', name: 'Meta AI', url: 'https://ai.facebook.com/blog/rss/', category: 'research', priority: 10, region: 'US' },
    { id: 'microsoft-research', name: 'Microsoft Research', url: 'https://www.microsoft.com/en-us/research/feed/', category: 'research', priority: 10, region: 'US' },

    // ========== MAJOR TECH PUBLICATIONS (Priority 9) ==========
    { id: 'techcrunch-ai', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'market', priority: 9, region: 'US' },
    { id: 'mit-tech-review', name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'research', priority: 9, region: 'US' },
    { id: 'wired-ai', name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'ai', priority: 9, region: 'US' },
    { id: 'venturebeat-ai', name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'market', priority: 9, region: 'US' },
    { id: 'ars-technica', name: 'Ars Technica AI', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: 'ai', priority: 9, region: 'US' },
    { id: 'verge-ai', name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'ai', priority: 9, region: 'US' },

    // ========== ROBOTICS (Priority 8) ==========
    // ========== ROBOTICS (Priority 8) ==========
    { id: 'robot-report', name: 'The Robot Report', url: 'https://www.therobotreport.com/feed/', category: 'robotics', priority: 8, region: 'US' },
    { id: 'ieee-robotics', name: 'IEEE Spectrum Robotics', url: 'https://spectrum.ieee.org/feeds/topic/robotics.rss', category: 'robotics', priority: 8, region: 'Global' },
    { id: 'robotics-biz', name: 'Robotics Business Review', url: 'https://www.roboticsbusinessreview.com/feed/', category: 'robotics', priority: 8, region: 'US' },
    { id: 'robotics-trends', name: 'Robotics Trends', url: 'https://www.roboticstrends.com/feed/', category: 'robotics', priority: 7, region: 'US' },
    { id: 'techcrunch-robotics', name: 'TechCrunch Robotics', url: 'https://techcrunch.com/category/robotics/feed/', category: 'robotics', priority: 9, region: 'US' },
    { id: 'wired-robotics', name: 'Wired Robotics', url: 'https://www.wired.com/feed/tag/robotics/latest/rss', category: 'robotics', priority: 8, region: 'US' },
    { id: 'engadget-robotics', name: 'Engadget Robotics', url: 'https://www.engadget.com/tag/robotics/rss.xml', category: 'robotics', priority: 7, region: 'US' },

    // ========== POLICY & SAFETY (Priority 8-9) ==========
    { id: 'ai-now', name: 'AI Now Institute', url: 'https://ainowinstitute.org/feed', category: 'policy', priority: 8, region: 'US' },
    { id: 'partnership-ai', name: 'Partnership on AI', url: 'https://www.partnershiponai.org/feed/', category: 'policy', priority: 8, region: 'Global' },
    { id: 'center-ai-safety', name: 'Center for AI Safety', url: 'https://www.safe.ai/blog-rss', category: 'policy', priority: 8, region: 'US' },
    { id: 'future-of-life', name: 'Future of Life Institute', url: 'https://futureoflife.org/feed/', category: 'policy', priority: 7, region: 'US' },

    // ========== BUSINESS & MARKET (Priority 7-8) ==========
    { id: 'axios-ai', name: 'Axios AI', url: 'https://www.axios.com/feeds/artificial-intelligence.rss', category: 'market', priority: 8, region: 'US' },
    { id: 'bloomberg-tech', name: 'Bloomberg Technology', url: 'https://www.bloomberg.com/technology.rss', category: 'market', priority: 8, region: 'Global' },
    { id: 'reuters-tech', name: 'Reuters Technology', url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', category: 'market', priority: 7, region: 'Global' },
    { id: 'crunchbase-news', name: 'Crunchbase News', url: 'https://news.crunchbase.com/feed/', category: 'market', priority: 7, region: 'US' },

    // ========== DEVELOPER TOOLS & FRAMEWORKS (Priority 7-8) ==========
    { id: 'huggingface', name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml', category: 'tools', priority: 8, region: 'Global' },
    { id: 'langchain', name: 'LangChain Blog', url: 'https://blog.langchain.dev/rss/', category: 'tools', priority: 8, region: 'US' },
    { id: 'pytorch', name: 'PyTorch Blog', url: 'https://pytorch.org/blog/feed.xml', category: 'tools', priority: 7, region: 'US' },
    { id: 'tensorflow', name: 'TensorFlow Blog', url: 'https://blog.tensorflow.org/feeds/posts/default', category: 'tools', priority: 7, region: 'US' },

    // ========== UNIVERSITIES & ACADEMIC (Priority 7-8) ==========
    { id: 'stanford-hai', name: 'Stanford HAI', url: 'https://hai.stanford.edu/news/feed', category: 'research', priority: 8, region: 'US' },
    { id: 'berkeley-ai', name: 'Berkeley AI Research', url: 'https://bair.berkeley.edu/blog/feed.xml', category: 'research', priority: 8, region: 'US' },
    { id: 'oxford-ai', name: 'Oxford AI', url: 'https://www.oxfordaiethics.ox.ac.uk/feed', category: 'research', priority: 7, region: 'Europe' },
    { id: 'cambridge-ai', name: 'Cambridge AI', url: 'https://www.cst.cam.ac.uk/news/rss', category: 'research', priority: 7, region: 'Europe' },

    // ========== INTERNATIONAL SOURCES ==========
    { id: 'synced-ai', name: 'Synced (China AI)', url: 'https://syncedreview.com/feed/', category: 'ai', priority: 7, region: 'Asia' },
    { id: 'eu-ai-act', name: 'EU AI Act News', url: 'https://www.euaiact.com/feed', category: 'policy', priority: 7, region: 'Europe' },
    { id: 'japan-times-tech', name: 'Japan Times Tech', url: 'https://www.japantimes.co.jp/news/technology/feed/', category: 'ai', priority: 6, region: 'Asia' },

    // ========== ADDITIONAL US TECH MEDIA (Priority 6-7) ==========
    { id: 'zdnet-ai', name: 'ZDNet AI', url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', category: 'ai', priority: 7, region: 'US' },
    { id: 'infoworld', name: 'InfoWorld AI', url: 'https://www.infoworld.com/category/artificial-intelligence/index.rss', category: 'tools', priority: 6, region: 'US' },
    { id: 'thenextweb', name: 'TNW AI', url: 'https://thenextweb.com/neural/feed', category: 'ai', priority: 6, region: 'Europe' },
    { id: 'engadget-ai', name: 'Engadget AI', url: 'https://www.engadget.com/rss.xml', category: 'ai', priority: 6, region: 'US' },
    { id: 'singularity-hub', name: 'Singularity Hub', url: 'https://singularityhub.com/feed/', category: 'ai', priority: 6, region: 'US' },

    // ========== AI ETHICS & RESPONSIBILITY (Priority 6-7) ==========
    { id: 'ai-ethics', name: 'AI Ethics Lab', url: 'https://aiethicslab.com/feed/', category: 'policy', priority: 6, region: 'Global' },
    { id: 'algorithmic-justice', name: 'Algorithmic Justice League', url: 'https://www.ajl.org/feed', category: 'policy', priority: 6, region: 'US' },

    // ========== SPECIALIZED AI TOPICS (Priority 6-7) ==========
    { id: 'nvidia-blog', name: 'NVIDIA AI Blog', url: 'https://blogs.nvidia.com/feed/', category: 'research', priority: 7, region: 'US' },
    { id: 'aws-ml', name: 'AWS Machine Learning Blog', url: 'https://aws.amazon.com/blogs/machine-learning/feed/', category: 'tools', priority: 7, region: 'US' },
    { id: 'azure-ai', name: 'Azure AI Blog', url: 'https://azure.microsoft.com/en-us/blog/topics/ai-machine-learning/feed/', category: 'tools', priority: 7, region: 'US' },
    { id: 'kaggle', name: 'Kaggle Blog', url: 'https://medium.com/feed/kaggle-blog', category: 'tools', priority: 6, region: 'Global' },

    // ========== COMMUNITY & FORUMS (Priority 5-6) ==========
    { id: 'towards-data-science', name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed', category: 'ai', priority: 6, region: 'Global' },
    { id: 'kdnuggets', name: 'KDnuggets', url: 'https://www.kdnuggets.com/feed', category: 'ai', priority: 6, region: 'US' },
    { id: 'machine-learning-mastery', name: 'ML Mastery', url: 'https://machinelearningmastery.com/feed/', category: 'tools', priority: 5, region: 'Global' },

    // ========== NEW ADDITIONS (Targeting 65+) ==========
    { id: 'semafor-tech', name: 'Semafor Tech', url: 'https://www.semafor.com/feed/technology', category: 'market', priority: 8, region: 'Global' },
    { id: 'rest-of-world', name: 'Rest of World', url: 'https://restofworld.org/feed/', category: 'policy', priority: 8, region: 'Global' },
    { id: 'chinai', name: 'ChinAI Newsletter', url: 'https://chinai.substack.com/feed', category: 'policy', priority: 8, region: 'Asia' },
    { id: 'import-ai', name: 'Import AI', url: 'https://jack-clark.net/feed/', category: 'policy', priority: 9, region: 'Global' },
    { id: 'bens-bites', name: 'Ben\'s Bites', url: 'https://bensbites.beehiiv.com/feed', category: 'tools', priority: 8, region: 'Global' },
    { id: 'last-week-in-ai', name: 'Last Week in AI', url: 'https://lastweekin.ai/feed', category: 'ai', priority: 8, region: 'Global' },
    { id: 'gradient-flow', name: 'Gradient Flow', url: 'https://gradientflow.com/feed/', category: 'research', priority: 7, region: 'US' },
    { id: 'unite-ai', name: 'Unite.AI', url: 'https://www.unite.ai/feed/', category: 'ai', priority: 7, region: 'US' },
    { id: 'marktechpost', name: 'MarkTechPost', url: 'https://www.marktechpost.com/feed/', category: 'research', priority: 7, region: 'US' },
    { id: 'analytics-indiamag', name: 'Analytics India Mag', url: 'https://analyticsindiamag.com/feed/', category: 'market', priority: 7, region: 'Asia' },
    { id: 'diginomica-ai', name: 'Diginomica AI', url: 'https://diginomica.com/taxonomy/term/1466/feed', category: 'market', priority: 6, region: 'Europe' },
    { id: 'sifted-ai', name: 'Sifted AI (Europe)', url: 'https://sifted.eu/articles/sector/ai/feed', category: 'market', priority: 8, region: 'Europe' },
    { id: 'tech-eu', name: 'Tech.eu', url: 'https://tech.eu/feed/', category: 'market', priority: 7, region: 'Europe' },
    { id: 'korea-herald-tech', name: 'Korea Herald Tech', url: 'http://www.koreaherald.com/common/rss_xml.php?ct=0202000000', category: 'market', priority: 6, region: 'Asia' },
    { id: 'nikkei-asia-tech', name: 'Nikkei Asia Tech', url: 'https://asia.nikkei.com/rss/feed/nar', category: 'market', priority: 8, region: 'Asia' },
    { id: 'mit-csail', name: 'MIT CSAIL', url: 'https://www.csail.mit.edu/news/rss', category: 'research', priority: 9, region: 'US' },
    { id: 'cmu-robotics', name: 'CMU Robotics', url: 'https://www.ri.cmu.edu/feed/', category: 'robotics', priority: 9, region: 'US' },

    // ========== SECURITY & HACKER NEWS (Priority 10) ==========
    { id: 'the-hacker-news', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews?format=xml', category: 'security', priority: 10, region: 'Global' },
    { id: 'krebs-security', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', category: 'security', priority: 10, region: 'US' },
    { id: 'bleeping-computer', name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'security', priority: 9, region: 'US' },
    { id: 'dark-reading', name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', category: 'security', priority: 8, region: 'US' },
    { id: 'schneier-security', name: 'Schneier on Security', url: 'https://www.schneier.com/blog/atom.xml', category: 'security', priority: 9, region: 'US' },
    { id: 'threatpost', name: 'Threatpost', url: 'https://threatpost.com/feed/', category: 'security', priority: 8, region: 'US' },
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
