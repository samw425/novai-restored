
// ----------------------------------------------------------------------------
// KEYWORD DICTIONARIES
// ----------------------------------------------------------------------------

export const ANTI_TRUST_KEYWORDS = {
    STRONG: [
        'antitrust', 'monopoly', 'monopolistic', 'cartel', 'collusion',
        'ftc', 'lina khan', 'jonathan kanter', 'vestager', 'doj lawsuit',
        'breakup', 'divestiture', 'sherman act', 'clayton act',
        'dma', 'digital markets act', 'dsa', 'digital services act',
        'gatekeeper', 'self-preferencing', 'sideloading', 'app store tax',
        'google trial', 'us v google', 'ftc v amazon', 'ftc v meta',
        'cma', 'competition and markets authority', 'ec commission',
        'regulatory crackdown', 'market power', 'anti-competitive'
    ],
    WEAK: [
        'lawsuit', 'sued', 'investigation', 'probe',
        'regulation', 'regulator', 'ban', 'fine',
        'enforcement', 'congress', 'senate hearing', 'subpoena',
        'acquisition', 'merger', 'blocked', 'injunction',
        'federal trade commission', 'department of justice'
    ],
    MAJOR: [
        'us v google', 'google trial', 'ad tech trial',
        'ftc v amazon', 'amazon monopoly',
        'ftc v meta', 'instagram breakup', 'whatsapp breakup',
        'doj v apple', 'apple monopoly', 'smartphone monopoly',
        'microsoft activision', 'eu dma', 'gatekeeper designation',
        'nvidia subpoena', 'doj nvidia'
    ],
    COMPANIES: [
        'google', 'alphabet', 'apple', 'meta', 'facebook', 'amazon', 'microsoft',
        'nvidia', 'openai', 'tiktok', 'bytedance', 'qualcomm', 'broadcom'
    ]
};

export const BUILT_WORLD_KEYWORDS = {
    COMMERCIAL: ['data center', 'datacenter', 'hyperscale', 'server', 'grid', 'power', 'energy', 'infrastructure', 'commercial', 'office', 'industrial', 'logistics', 'warehouse', 'nvidia', 'gpu'],
    RESIDENTIAL: ['residential', 'home', 'housing', 'apartment', 'smart city', 'smart home', 'proptech', 'living', 'urban', 'tenant', 'rent', 'mortgage']
};

export const FUTURE_OF_CODE_KEYWORDS = {
    LIVE: [
        'layoff', 'job cut', 'hiring freeze', 'unemployment',
        'ai coding', 'autonomous agent', 'devin', 'copilot', 'chatgpt',
        'replace engineers', 'end of coding', 'software engineer', 'developer',
        'automation', 'generative ai', 'llm', 'coding assistant',
        'future of work', 'tech jobs', 'salary', 'market correction',
        'transformer model', 'gpt-4', 'claude', 'gemini', 'llama',
        'prompt engineering', 'no-code', 'low-code', 'ai displacement'
    ],
    RESEARCH: [
        'paper', 'study', 'arxiv', 'research', 'university', 'professor',
        'thesis', 'experiment', 'benchmark', 'evaluation', 'novel approach',
        'state of the art', 'sota', 'methodology', 'algorithm', 'neural network',
        'architecture', 'transformer', 'attention mechanism', 'reasoning',
        'code generation', 'program synthesis', 'formal verification',
        'large language model', 'generative pre-trained transformer'
    ],
    CASES: [
        'layoff', 'cut', 'restructuring', 'fired', 'replaced', 'downsizing',
        'reduction in force', 'rif', 'severance', 'hiring pause', 'job loss',
        'automation impact', 'efficiency', 'cost cutting', 'shareholder',
        'stock price', 'earnings call'
    ]
};

// ----------------------------------------------------------------------------
// LOGIC HELPERS
// ----------------------------------------------------------------------------

export function cleanText(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&[a-z]+;/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);
}

export function isRelevantToAI(title: string, summary: string, category: string): boolean {
    const text = (title + ' ' + summary).toLowerCase();

    // 1. HARD BLOCKS
    const hardKeywords = ['anime', 'manga', 'k-pop', 'concert', 'festival', 'fashion', 'sports', 'soccer', 'football', 'recipe', 'cooking', 'travel', 'tourism'];
    if (hardKeywords.some(k => text.includes(k))) return false;

    // 2. STRONG SIGNALS
    const strongSignals = [
        'ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt', 'chatgpt', 'openai', 'anthropic', 'deepmind', 'nvidia', 'gpu',
        'robot', 'robotics', 'autonomous', 'drone', 'neural', 'transformer', 'generative', 'diffusion', 'copilot', 'gemini', 'claude', 'llama',
        'semiconductor', 'quantum', 'biotech', 'data center'
    ];

    if (strongSignals.some(s => text.includes(s))) return true;

    // 3. CATEGORY OVERRIDES
    if (['robotics', 'research', 'tools', 'ai', 'semiconductors', 'quantum', 'biotech'].includes(category)) return true;

    return false;
}

export const getJaccardSimilarity = (str1: string, str2: string) => {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
};
