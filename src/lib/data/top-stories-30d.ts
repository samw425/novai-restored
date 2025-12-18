import { Article } from '@/types';

// Curated list of top stories from the last 30 days (Nov-Dec 2024)
export const TOP_STORIES_30D: Article[] = [
    // GLOBAL / ALL
    {
        id: 'top-1',
        title: 'OpenAI Launches o1 Full Model with Deep Reasoning',
        summary: 'The o1 model uses chain-of-thought reasoning to tackle complex problems, scoring significantly higher on math and coding benchmarks than GPT-4.',
        source: 'OpenAI',
        url: 'https://openai.com/o1',
        publishedAt: '2024-12-05T10:00:00Z',
        category: 'ai',
        importanceScore: 100,
        topicSlug: 'o1-release'
    },
    {
        id: 'top-2',
        title: 'Google Gemini 2.0 Released with Agentic Capabilities',
        summary: 'Google DeepMind unveils Gemini 2.0 with native multimodal input/output and Project Astra for real-time AI assistance.',
        source: 'Google DeepMind',
        url: 'https://deepmind.google/technologies/gemini/',
        publishedAt: '2024-12-11T14:30:00Z',
        category: 'ai',
        importanceScore: 98,
        topicSlug: 'gemini-2-release'
    },
    {
        id: 'top-3',
        title: 'EU AI Act Implementation Begins: High-Risk Systems in Focus',
        summary: 'Brussels starts enforcement of the world\'s first comprehensive AI law. Companies racing to comply with transparency requirements.',
        source: 'Reuters',
        url: 'https://reuters.com/technology/artificial-intelligence/',
        publishedAt: '2024-12-01T09:15:00Z',
        category: 'policy',
        importanceScore: 90,
        topicSlug: 'eu-ai-act-implementation'
    },
    {
        id: 'top-4',
        title: 'NVIDIA Blackwell B200 GPUs Begin Shipping to Hyperscalers',
        summary: 'Jensen Huang confirms mass production of next-gen AI chips. Microsoft, Google, and Meta among first customers.',
        source: 'NVIDIA',
        url: 'https://nvidianews.nvidia.com/',
        publishedAt: '2024-11-28T16:45:00Z',
        category: 'market',
        importanceScore: 95,
        topicSlug: 'blackwell-shipping'
    },
    {
        id: 'top-5',
        title: 'Anthropic Claude 3.5 Sonnet Leads Coding Benchmarks',
        summary: 'Claude 3.5 Sonnet outperforms GPT-4 and Gemini on SWE-bench and HumanEval, becoming the go-to model for developers.',
        source: 'Anthropic',
        url: 'https://anthropic.com/claude',
        publishedAt: '2024-11-10T11:20:00Z',
        category: 'code',
        importanceScore: 88,
        topicSlug: 'claude-sonnet-benchmarks'
    },
    // ROBOTICS SPECIFIC
    {
        id: 'top-rob-1',
        title: 'Figure AI Raises $675M at $2.6B Valuation',
        summary: 'Backed by Bezos, Nvidia, and OpenAI, the humanoid robotics startup accelerates development of general-purpose robots.',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        publishedAt: '2024-11-25T13:00:00Z',
        category: 'robotics',
        importanceScore: 85,
        topicSlug: 'figure-ai-funding'
    },
    // MARKET SPECIFIC
    {
        id: 'top-mkt-1',
        title: 'Meta Llama 3.3 70B Matches 405B Performance',
        summary: 'Meta releases efficient open-weight model that delivers frontier performance at a fraction of the compute cost.',
        source: 'Meta AI',
        url: 'https://ai.meta.com/llama/',
        publishedAt: '2024-12-06T08:00:00Z',
        category: 'ai',
        importanceScore: 92,
        topicSlug: 'llama-3-3-release'
    }
];

export const getTopStories = (category: string = 'all') => {
    if (category === 'all' || category === 'All') {
        return TOP_STORIES_30D.sort((a, b) => b.importanceScore - a.importanceScore);
    }
    return TOP_STORIES_30D.filter(s => s.category === category.toLowerCase()).sort((a, b) => b.importanceScore - a.importanceScore);
};
