export type FeedCategory = 'research' | 'tools' | 'policy' | 'market' | 'robotics' | 'ai' | 'security' | 'us-intel' | 'current-wars' | 'built-world' | 'antitrust';

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
    { id: 'nature-mi', name: 'Nature Machine Intelligence', url: 'https://www.nature.com/natmachintell.rss', category: 'research', priority: 10, region: 'Global' },
    { id: 'arxiv-ai', name: 'arXiv AI', url: 'http://export.arxiv.org/rss/cs.AI', category: 'research', priority: 10, region: 'Global' },

    // ========== MARKET & BUSINESS INTELLIGENCE (Priority 9-10) ==========
    { id: 'techcrunch-ai', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'market', priority: 10, region: 'US' },
    { id: 'venturebeat-ai', name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'market', priority: 10, region: 'US' },
    { id: 'nyt-tech', name: 'NYT Technology', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', category: 'market', priority: 9, region: 'US' },
    { id: 'guardian-tech', name: 'The Guardian Tech', url: 'https://www.theguardian.com/uk/technology/rss', category: 'market', priority: 9, region: 'Europe' },
    { id: 'cnbc-tech', name: 'CNBC Technology', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', category: 'market', priority: 8, region: 'US' },
    { id: 'seeking-alpha-tech', name: 'Seeking Alpha Tech', url: 'https://seekingalpha.com/feed.xml', category: 'market', priority: 8, region: 'US' },
    { id: 'investors-business-daily', name: 'Investors Business Daily', url: 'https://www.investors.com/feed/', category: 'market', priority: 8, region: 'US' },
    // REMOVED: WSJ, FT, Economist - paywalled
    // FREE ALTERNATIVES:
    { id: 'reuters-tech', name: 'Reuters Tech', url: 'https://www.reutersagency.com/feed/?best-topics=tech\u0026post_type=best', category: 'market', priority: 9, region: 'Global' },
    { id: 'ap-tech', name: 'AP Technology', url: 'https://rsshub.app/apnews/topics/technology', category: 'market', priority: 9, region: 'US' },
    { id: 'bbc-tech', name: 'BBC Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'market', priority: 9, region: 'Europe' },
    { id: 'engadget', name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'market', priority: 8, region: 'US' },
    { id: 'zdnet', name: 'ZDNet', url: 'https://www.zdnet.com/news/rss.xml', category: 'market', priority: 8, region: 'US' },
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
    { id: 'techcrunch-robotics', name: 'TechCrunch Robotics', url: 'https://techcrunch.com/category/robotics/feed/', category: 'robotics', priority: 10, region: 'US' },
    { id: 'mit-robotics', name: 'MIT News - Robotics', url: 'https://news.mit.edu/rss/topic/robotics', category: 'robotics', priority: 10, region: 'Global' },
    { id: 'arxiv-ro', name: 'arXiv Robotics', url: 'http://export.arxiv.org/rss/cs.RO', category: 'robotics', priority: 10, region: 'Global' },
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
    // REMOVED: Stratechery - subscription only

    // ========== US INTELLIGENCE AGENCIES (Priority 10) ==========
    { id: 'cia-news', name: 'CIA News', url: 'https://news.google.com/rss/search?q=site:cia.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'fbi-news', name: 'FBI News', url: 'https://news.google.com/rss/search?q=site:fbi.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'dod-news', name: 'Dept of Defense', url: 'https://news.google.com/rss/search?q=site:defense.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'state-dept', name: 'State Department', url: 'https://www.state.gov/rss-feed/press-releases/feed/', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'treasury-news', name: 'Treasury Dept', url: 'https://news.google.com/rss/search?q=site:home.treasury.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'nsa-news', name: 'NSA News', url: 'https://news.google.com/rss/search?q=site:nsa.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'dhs-news', name: 'DHS News', url: 'https://news.google.com/rss/search?q=site:dhs.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'white-house-news', name: 'White House', url: 'https://news.google.com/rss/search?q=site:whitehouse.gov&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'dni-news', name: 'ODNI News', url: 'https://news.google.com/rss/search?q=ODNI&hl=en-US&gl=US&ceid=US:en', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'doj-news', name: 'DOJ News', url: 'https://www.justice.gov/news/rss', category: 'us-intel', priority: 10, region: 'US' },

    // ========== CURRENT WARS (Priority 10) ==========
    // Israel / Gaza - WAR-SPECIFIC FEEDS (Google News filtered for war keywords)
    { id: 'gaza-war-1', name: 'Gaza War News', url: 'https://news.google.com/rss/search?q=Gaza+War+IDF+Hamas&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 10, region: 'Global' },
    { id: 'gaza-war-2', name: 'Israel Hamas War', url: 'https://news.google.com/rss/search?q=Israel+Hamas+War+military&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 10, region: 'Global' },
    { id: 'gaza-war-3', name: 'Gaza Strikes', url: 'https://news.google.com/rss/search?q=Gaza+airstrike+OR+bombing+OR+offensive&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 10, region: 'Global' },

    // Russia / Ukraine - WAR-SPECIFIC FEEDS
    { id: 'ukraine-war-1', name: 'Ukraine War News', url: 'https://news.google.com/rss/search?q=Ukraine+War+Russia+military&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 10, region: 'Europe' },
    { id: 'ukraine-war-2', name: 'Ukraine Front Lines', url: 'https://news.google.com/rss/search?q=Ukraine+frontline+Kyiv+offensive&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 10, region: 'Europe' },
    { id: 'ukraine-war-3', name: 'Russia Ukraine Strikes', url: 'https://news.google.com/rss/search?q=Russia+Ukraine+drone+strike+OR+missile&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 10, region: 'Europe' },

    // Backup sources (still war-focused)
    { id: 'middle-east-war', name: 'Middle East Conflict', url: 'https://news.google.com/rss/search?q=Middle+East+War+conflict+military&hl=en-US&gl=US&ceid=US:en', category: 'current-wars', priority: 9, region: 'Global' },

    // ========== DEFENSE & STRATEGIC STUDIES (Priority 10) ==========
    { id: 'defense-news', name: 'Defense News', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'war-on-rocks', name: 'War on the Rocks', url: 'https://warontherocks.com/feed/', category: 'us-intel', priority: 10, region: 'US' },
    { id: 'breaking-defense', name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'defense-one', name: 'Defense One', url: 'https://www.defenseone.com/rss/all/', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'isw-updates', name: 'Institute for Study of War', url: 'https://www.understandingwar.org/feeds.xml', category: 'us-intel', priority: 10, region: 'Global' },
    { id: 'csis', name: 'CSIS', url: 'https://www.csis.org/rss/analysis', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'rand-corp', name: 'RAND Corporation', url: 'https://www.rand.org/news/rss.xml', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'usni-news', name: 'US Naval Institute', url: 'https://news.usni.org/feed', category: 'us-intel', priority: 9, region: 'US' },
    { id: 'army-times', name: 'Army Times', url: 'https://www.armytimes.com/arc/outboundfeeds/rss/', category: 'us-intel', priority: 8, region: 'US' },
    { id: 'air-force-times', name: 'Air Force Times', url: 'https://www.airforcetimes.com/arc/outboundfeeds/rss/', category: 'us-intel', priority: 8, region: 'US' },

    // ========== GLOBAL INTELLIGENCE & GEOPOLITICS (Priority 10) ==========
    { id: 'foreign-policy', name: 'Foreign Policy', url: 'https://foreignpolicy.com/feed/', category: 'us-intel', priority: 10, region: 'Global' },
    // REMOVED: Foreign Affairs - paywall
    { id: 'the-diplomat', name: 'The Diplomat', url: 'https://thediplomat.com/feed/', category: 'us-intel', priority: 9, region: 'Asia' },
    { id: 'scmp-tech', name: 'South China Morning Post', url: 'https://www.scmp.com/rss/318421/feed', category: 'market', priority: 9, region: 'Asia' },
    // FREE ASIA ALTERNATIVES (replacing Nikkei Asia):
    { id: 'japan-times', name: 'Japan Times', url: 'https://www.japantimes.co.jp/feed/', category: 'market', priority: 8, region: 'Asia' },
    { id: 'channel-news-asia', name: 'Channel News Asia', url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml\u0026category=6511', category: 'market', priority: 8, region: 'Asia' },
    { id: 'al-jazeera-english', name: 'Al Jazeera English', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'market', priority: 9, region: 'Global' },
    { id: 'dw-news', name: 'Deutsche Welle', url: 'https://rss.dw.com/xml/rss-en-all', category: 'market', priority: 8, region: 'Europe' },
    { id: 'france24', name: 'France 24', url: 'https://www.france24.com/en/rss', category: 'market', priority: 8, region: 'Europe' },

    // ========== ADVANCED TECH & CYBER (Priority 9) ==========
    { id: 'cyberscoop', name: 'CyberScoop', url: 'https://www.cyberscoop.com/feed/', category: 'security', priority: 9, region: 'US' },
    { id: 'recorded-future', name: 'The Record', url: 'https://therecord.media/feed', category: 'security', priority: 9, region: 'Global' },
    { id: 'unit42', name: 'Palo Alto Unit 42', url: 'https://unit42.paloaltonetworks.com/feed/', category: 'security', priority: 9, region: 'US' },
    { id: 'mandiant', name: 'Mandiant Threat Intel', url: 'https://www.mandiant.com/resources/blog/rss.xml', category: 'security', priority: 9, region: 'US' },
    { id: 'sifted-eu', name: 'Sifted EU', url: 'https://sifted.eu/feed', category: 'market', priority: 8, region: 'Europe' },
    { id: 'tech-in-asia', name: 'Tech in Asia', url: 'https://www.techinasia.com/feed', category: 'market', priority: 8, region: 'Asia' },
    { id: 'rest-of-world', name: 'Rest of World', url: 'https://restofworld.org/feed/', category: 'market', priority: 9, region: 'Global' },

    // ========== NEW SOURCES (Broadening Scope) ==========
    { id: 'semafor-tech', name: 'Semafor Tech', url: 'https://www.semafor.com/feed/technology', category: 'market', priority: 9, region: 'US' },
    // REMOVED: The Information - hard paywall
    { id: 'axios-tech', name: 'Axios Tech', url: 'https://api.axios.com/feed/technology', category: 'market', priority: 8, region: 'US' },
    { id: 'qz-tech', name: 'Quartz Tech', url: 'https://qz.com/emails/quartz-obsession/feed', category: 'market', priority: 8, region: 'Global' },
    { id: 'ieee-spectrum', name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org/feeds/feed.rss', category: 'tools', priority: 9, region: 'Global' },
    { id: 'hackaday', name: 'Hackaday', url: 'https://hackaday.com/blog/feed/', category: 'tools', priority: 8, region: 'Global' },
    { id: 'anandtech', name: 'AnandTech', url: 'https://www.anandtech.com/rss/', category: 'tools', priority: 8, region: 'US' },
    { id: 'tomshardware', name: 'Toms Hardware', url: 'https://www.tomshardware.com/feeds/all', category: 'tools', priority: 7, region: 'US' },
    { id: '9to5mac', name: '9to5Mac', url: 'https://9to5mac.com/feed/', category: 'market', priority: 7, region: 'US' },
    { id: 'macrumors', name: 'MacRumors', url: 'https://www.macrumors.com/macrumors.xml', category: 'market', priority: 7, region: 'US' },
    // REMOVED: Stratechery Daily - subscription only
    { id: 'platformer', name: 'Platformer', url: 'https://www.platformer.news/feed', category: 'market', priority: 9, region: 'US' },
    { id: '404-media', name: '404 Media', url: 'https://www.404media.co/rss/', category: 'market', priority: 9, region: 'US' },

    // ========== THE BUILT WORLD (AI Infrastructure) ==========
    // Commercial / Compute
    { id: 'data-center-dynamics', name: 'Data Center Dynamics', url: 'https://www.datacenterdynamics.com/en/rss/', category: 'built-world', priority: 10, region: 'Global' },
    { id: 'data-center-knowledge', name: 'Data Center Knowledge', url: 'https://www.datacenterknowledge.com/rss.xml', category: 'built-world', priority: 9, region: 'US' },
    { id: 'commercial-observer-tech', name: 'Commercial Observer', url: 'https://commercialobserver.com/feed/', category: 'built-world', priority: 8, region: 'US' },

    // Residential / PropTech / Smart Cities
    { id: 'smart-cities-world', name: 'Smart Cities World', url: 'https://www.smartcitiesworld.net/rss/news', category: 'built-world', priority: 9, region: 'Global' },
    { id: 'propmodo', name: 'Propmodo', url: 'https://www.propmodo.com/feed/', category: 'built-world', priority: 8, region: 'US' },
    { id: 'place-tech', name: 'PlaceTech', url: 'https://placetech.net/feed/', category: 'built-world', priority: 8, region: 'Europe' },

    // ========== AI POLICY & GOVERNANCE (Priority 10) ==========
    { id: 'tech-policy-press', name: 'Tech Policy Press', url: 'https://techpolicy.press/rss/', category: 'policy', priority: 10, region: 'Global' },
    { id: 'brookings-ai', name: 'Brookings AI', url: 'https://www.brookings.edu/topic/artificial-intelligence/feed/', category: 'policy', priority: 10, region: 'US' },
    { id: 'cset-georgetown', name: 'CSET Georgetown', url: 'https://cset.georgetown.edu/feed/', category: 'policy', priority: 10, region: 'US' },
    { id: 'ada-lovelace', name: 'Ada Lovelace Inst', url: 'https://www.adalovelaceinstitute.org/feed/', category: 'policy', priority: 9, region: 'Europe' },
    { id: 'oecd-ai', name: 'OECD.AI Policy', url: 'https://oecd.ai/en/rss', category: 'policy', priority: 9, region: 'Global' },
    { id: 'stanford-cyber', name: 'Stanford Cyber', url: 'https://cyber.fsi.stanford.edu/news/rss', category: 'policy', priority: 9, region: 'US' },
    { id: 'lawfare', name: 'Lawfare', url: 'https://www.lawfaremedia.org/feeds/rss', category: 'policy', priority: 9, region: 'US' },
    { id: 'ai-now', name: 'AI Now Institute', url: 'https://ainowinstitute.org/feed', category: 'policy', priority: 9, region: 'US' },

    // ========== ANTITRUST & COURT DOCKETS (Priority 10) ==========
    // Official Government Sources
    { id: 'doj-antitrust', name: 'DOJ Antitrust Division', url: 'https://www.justice.gov/atr/press-releases/feed', category: 'antitrust', priority: 10, region: 'US' },
    { id: 'ftc-competition', name: 'FTC Competition', url: 'https://www.ftc.gov/news-events/news/press-releases/feed', category: 'antitrust', priority: 10, region: 'US' },
    { id: 'ftc-cases', name: 'FTC Cases & Proceedings', url: 'https://www.ftc.gov/legal-library/browse/cases-proceedings/feed', category: 'antitrust', priority: 10, region: 'US' },
    { id: 'eu-competition', name: 'EU Competition Policy', url: 'https://ec.europa.eu/competition/rss.cfm', category: 'antitrust', priority: 10, region: 'Europe' },

    // Court Document Tracking
    { id: 'courtlistener-recap', name: 'RECAP Court Docs', url: 'https://www.courtlistener.com/feed/search/?q=antitrust&type=r', category: 'antitrust', priority: 10, region: 'US' },
    { id: 'google-antitrust-feed', name: 'Google Antitrust News', url: 'https://news.google.com/rss/search?q=google+antitrust+DOJ&hl=en-US&gl=US&ceid=US:en', category: 'antitrust', priority: 9, region: 'US' },
    { id: 'apple-antitrust-feed', name: 'Apple Antitrust News', url: 'https://news.google.com/rss/search?q=apple+antitrust+DOJ&hl=en-US&gl=US&ceid=US:en', category: 'antitrust', priority: 9, region: 'US' },
    { id: 'amazon-ftc-feed', name: 'Amazon FTC News', url: 'https://news.google.com/rss/search?q=amazon+FTC+antitrust&hl=en-US&gl=US&ceid=US:en', category: 'antitrust', priority: 9, region: 'US' },
    { id: 'meta-ftc-feed', name: 'Meta FTC News', url: 'https://news.google.com/rss/search?q=meta+facebook+FTC+antitrust&hl=en-US&gl=US&ceid=US:en', category: 'antitrust', priority: 9, region: 'US' },

    // Legal Analysis
    { id: 'competition-policy-intl', name: 'Competition Policy Intl', url: 'https://www.competitionpolicyinternational.com/feed/', category: 'antitrust', priority: 8, region: 'Global' },
    { id: 'mlexwatch', name: 'MLex Antitrust', url: 'https://mlexwatch.com/feed/', category: 'antitrust', priority: 8, region: 'Global' },

    // ========== ADDITIONAL FREE SOURCES (High Quality) ==========
    // Major Tech News (All Free)
    { id: 'cnet', name: 'CNET', url: 'https://www.cnet.com/rss/news/', category: 'market', priority: 8, region: 'US' },
    { id: 'pcmag', name: 'PCMag', url: 'https://www.pcmag.com/rss', category: 'tools', priority: 7, region: 'US' },
    { id: 'mashable', name: 'Mashable', url: 'https://mashable.com/feeds/rss/all', category: 'market', priority: 7, region: 'US' },
    { id: 'gizmodo', name: 'Gizmodo', url: 'https://gizmodo.com/rss', category: 'market', priority: 7, region: 'US' },
    { id: 'lifehacker', name: 'Lifehacker', url: 'https://lifehacker.com/rss', category: 'tools', priority: 6, region: 'US' },

    // AI-Specific (All Free)
    { id: 'marktechpost', name: 'MarkTechPost AI', url: 'https://www.marktechpost.com/feed/', category: 'ai', priority: 8, region: 'Global' },
    { id: 'synced-ai', name: 'Synced AI', url: 'https://syncedreview.com/feed/', category: 'ai', priority: 8, region: 'Global' },
    { id: 'ai-business', name: 'AI Business', url: 'https://aibusiness.com/rss.xml', category: 'ai', priority: 8, region: 'Global' },
    { id: 'towards-ai', name: 'Towards AI', url: 'https://pub.towardsai.net/feed', category: 'ai', priority: 7, region: 'Global' },

    // Security Additional (All Free)
    { id: 'sans-isc', name: 'SANS ISC', url: 'https://isc.sans.edu/rssfeed.xml', category: 'security', priority: 9, region: 'Global' },
    { id: 'talos-intel', name: 'Cisco Talos', url: 'https://blog.talosintelligence.com/feeds/posts/default', category: 'security', priority: 9, region: 'US' },
    { id: 'sophos-naked', name: 'Sophos Naked Security', url: 'https://nakedsecurity.sophos.com/feed/', category: 'security', priority: 8, region: 'Global' },

    // Global/International News (All Free)
    { id: 'npr-tech', name: 'NPR Technology', url: 'https://feeds.npr.org/1019/rss.xml', category: 'market', priority: 8, region: 'US' },
    { id: 'abc-tech', name: 'ABC News Tech', url: 'https://abcnews.go.com/abcnews/technologyheadlines', category: 'market', priority: 7, region: 'US' },
    { id: 'cbc-tech', name: 'CBC Technology', url: 'https://www.cbc.ca/cmlink/rss-technology', category: 'market', priority: 7, region: 'Global' },
    { id: 'sky-tech', name: 'Sky News Tech', url: 'https://feeds.skynews.com/feeds/rss/technology.xml', category: 'market', priority: 7, region: 'Europe' },

    // Startup/VC News (All Free)
    { id: 'crunchbase', name: 'Crunchbase News', url: 'https://news.crunchbase.com/feed/', category: 'market', priority: 8, region: 'US' },
    { id: 'eu-startups', name: 'EU Startups', url: 'https://www.eu-startups.com/feed/', category: 'market', priority: 7, region: 'Europe' },

    // Research & Academic (All Free)
    { id: 'acm-news', name: 'ACM TechNews', url: 'https://technews.acm.org/feed/', category: 'research', priority: 8, region: 'Global' },
    { id: 'science-daily-ai', name: 'ScienceDaily AI', url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml', category: 'research', priority: 8, region: 'Global' },
    { id: 'phys-org-tech', name: 'Phys.org Tech', url: 'https://phys.org/rss-feed/technology-news/', category: 'research', priority: 7, region: 'Global' },

    // ========== MORE INTERNATIONAL SOURCES (Diversity) ==========
    // Asia-Pacific (All Free)
    { id: 'abc-au-tech', name: 'ABC Australia Tech', url: 'https://www.abc.net.au/news/feed/51120/rss.xml', category: 'market', priority: 7, region: 'Asia' },
    { id: 'korea-herald-tech', name: 'Korea Herald Tech', url: 'http://www.koreaherald.com/common/rss_xml.php?ct=102', category: 'market', priority: 7, region: 'Asia' },
    { id: 'india-times-tech', name: 'Times of India Tech', url: 'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms', category: 'market', priority: 7, region: 'Asia' },
    { id: 'nzherald-tech', name: 'NZ Herald Tech', url: 'https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/technology/', category: 'market', priority: 6, region: 'Asia' },

    // More Europe (All Free)
    { id: 'euronews-tech', name: 'Euronews Tech', url: 'https://www.euronews.com/rss?level=vertical&name=next', category: 'market', priority: 8, region: 'Europe' },
    { id: 'politico-eu-tech', name: 'Politico EU Tech', url: 'https://www.politico.eu/feed/', category: 'policy', priority: 8, region: 'Europe' },
    { id: 'techeu', name: 'Tech.eu', url: 'https://tech.eu/feed/', category: 'market', priority: 8, region: 'Europe' },
    { id: 'the-next-web', name: 'The Next Web', url: 'https://thenextweb.com/feed/', category: 'market', priority: 8, region: 'Europe' },

    // More AI Sources (All Free)
    { id: 'the-decoder', name: 'The Decoder AI', url: 'https://the-decoder.com/feed/', category: 'ai', priority: 8, region: 'Global' },
    { id: 'import-ai', name: 'Import AI Newsletter', url: 'https://importai.substack.com/feed', category: 'ai', priority: 8, region: 'US' },
    { id: 'deeplearning-ai', name: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/blog/feed/', category: 'ai', priority: 8, region: 'US' },
    { id: 'aiweekly', name: 'AI Weekly', url: 'https://aiweekly.co/feed/', category: 'ai', priority: 7, region: 'Global' },

    // More Robotics (All Free)
    { id: 'robohub', name: 'Robohub', url: 'https://robohub.org/feed/', category: 'robotics', priority: 8, region: 'Global' },
    { id: 'robotics247', name: 'Robotics 24/7', url: 'https://www.robotics247.com/rss/rss.xml', category: 'robotics', priority: 7, region: 'US' },
    { id: 'automate-org', name: 'Automate.org', url: 'https://www.automate.org/rss/news', category: 'robotics', priority: 7, region: 'US' },

    // Middle East & Africa (All Free)
    { id: 'arabnews-tech', name: 'Arab News Tech', url: 'https://www.arabnews.com/taxonomy/term/469/feed', category: 'market', priority: 6, region: 'Global' },
    { id: 'itnewsafrica', name: 'IT News Africa', url: 'https://www.itnewsafrica.com/feed/', category: 'market', priority: 6, region: 'Global' },
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
