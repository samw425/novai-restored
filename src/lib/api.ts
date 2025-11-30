import { Article, MarketTicker, RiskEvent, Tool, Trend, Signal, DailyBriefing } from '../types';

/**
 * Fetch articles from live multi-source RSS aggregator
 */
export const fetchArticles = async (limit = 20, category = 'All'): Promise<Article[]> => {
    try {
        const response = await fetch(
            `/api/feed/live?category=${encodeURIComponent(category)}&limit=${limit}`,
            { cache: 'no-store' }
        );

        if (!response.ok) throw new Error('Failed to fetch feed');

        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return fallbackArticles;
    }
};

// Fallback data for offline/error states
const fallbackArticles: Article[] = [
    {
        id: 'fallback-1',
        source: 'System',
        title: 'Loading Latest Intelligence...',
        summary: 'Connecting to global intelligence network. Please wait.',
        publishedAt: new Date().toISOString(),
        category: 'general',
        topicSlug: 'system',
        importanceScore: 0,
        url: '#',
        relatedLinks: []
    }
];

export const fetchMarketData = async (): Promise<MarketTicker[]> => {
    return [
        { symbol: 'NVDA', price: 924.50, changePercent: 2.4, data: [{ time: '9', value: 900 }, { time: '12', value: 924 }] },
        { symbol: 'MSFT', price: 415.20, changePercent: 0.8, data: [{ time: '9', value: 410 }, { time: '12', value: 415 }] },
        { symbol: 'GOOGL', price: 173.10, changePercent: -0.5, data: [{ time: '9', value: 175 }, { time: '12', value: 173 }] },
        { symbol: 'META', price: 490.22, changePercent: 1.2, data: [{ time: '9', value: 485 }, { time: '12', value: 490 }] },
    ];
};

export const fetchTools = async (): Promise<Tool[]> => {
    return [
        { id: 't1', name: 'Cursor', tagline: 'The AI Code Editor', description: 'Built on VS Code, Cursor understands your entire codebase.', category: 'DevTool', pricing: 'Freemium', isToolOfTheDay: true },
        { id: 't2', name: 'Perplexity', tagline: 'Where knowledge begins', description: 'AI-powered search engine that provides direct answers with citations.', category: 'Search', pricing: 'Freemium' },
        { id: 't3', name: 'Midjourney', tagline: 'Text to Image', description: 'Generative AI program that creates images from natural language descriptions.', category: 'Creative', pricing: 'Paid' },
        { id: 't4', name: 'LangChain', tagline: 'Building applications with LLMs', description: 'Framework for developing applications powered by language models.', category: 'DevTool', pricing: 'Free' },
        { id: 't5', name: 'Suno', tagline: 'Make a song', description: 'Generative audio platform allowing users to create music with text.', category: 'Creative', pricing: 'Freemium' },
        { id: 't6', name: 'Groq', tagline: 'Fast AI Inference', description: 'LPU Inference Engine that delivers instant speed for LLMs.', category: 'Hardware', pricing: 'Paid' },
    ];
};

export const fetchRisks = async (): Promise<RiskEvent[]> => {
    return [
        { id: 'r1', title: 'Deepfake CEO Scam in Hong Kong', severity: 'High', summary: 'Multinational firm loses $25M after employee joins video call with deepfake CFO.', date: '2 hrs ago' },
        { id: 'r2', title: 'Model Collapse Evidence', severity: 'Medium', summary: 'New paper suggests training on synthetic data degrades model quality faster than expected.', date: '5 hrs ago' },
        { id: 'r3', title: 'GDPR Investigation into xAI', severity: 'Low', summary: 'European regulators query data processing practices regarding EU citizens.', date: '1 day ago' },
    ];
};

export const fetchDailyBriefing = async (): Promise<DailyBriefing> => {
    const articles = await fetchArticles(3, 'All');
    return {
        id: 'db-1',
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        headline: "Global AI Landscape: Latest Developments",
        summary: "Real-time aggregation from the world's leading AI research labs, tech publications, and policy institutions.",
        statOfTheDay: { value: "$1.2T", label: "Projected 2025 AI Infra Spend" },
        marketSentiment: 'Neutral',
        topStories: articles
    };
};

export const fetchSignals = async (): Promise<Signal[]> => {
    return [
        { id: 's1', title: 'Reasoning Models are Commoditizing', description: 'Open-weights models are matching proprietary reasoning benchmarks faster than expected, compressing margins for API providers.', impact: 'High', horizon: '6 Months', confidenceScore: 88, sourceCount: 12 },
        { id: 's2', title: 'Agentic Workflows > Bigger Models', description: 'Enterprise value capture is shifting from foundation model providers to companies building reliable agentic orchestration layers.', impact: 'Medium', horizon: '1-2 Years', confidenceScore: 74, sourceCount: 8 },
        { id: 's3', title: 'Regulatory Fragmentation', description: 'EU, US, and China AI safety standards are diverging, creating a "Splinternet" for AI deployment and compliance.', impact: 'High', horizon: '5+ Years', confidenceScore: 92, sourceCount: 15 },
    ];
};

export const fetchTrends = async (): Promise<Trend[]> => {
    return [
        { id: 'tr1', name: 'Mixture of Experts', growth: 145, description: 'Architecture choice dominating new open source releases.', data: [{ day: 'M', value: 10 }, { day: 'T', value: 20 }, { day: 'W', value: 15 }, { day: 'T', value: 40 }, { day: 'F', value: 60 }, { day: 'S', value: 80 }, { day: 'S', value: 100 }] },
        { id: 'tr2', name: 'Q-Star / Reasoning', growth: 88, description: 'Speculation around OpenAI\'s next breakthrough.', data: [{ day: 'M', value: 40 }, { day: 'T', value: 42 }, { day: 'W', value: 45 }, { day: 'T', value: 50 }, { day: 'F', value: 65 }, { day: 'S', value: 60 }, { day: 'S', value: 70 }] },
        { id: 'tr3', name: 'On-Device AI', growth: 54, description: 'Apple and Samsung pushing local inference.', data: [{ day: 'M', value: 50 }, { day: 'T', value: 50 }, { day: 'W', value: 52 }, { day: 'T', value: 55 }, { day: 'F', value: 60 }, { day: 'S', value: 62 }, { day: 'S', value: 65 }] },
    ];
};

export const checkNewArticles = async (lastId: string): Promise<number> => {
    return 0;
};
