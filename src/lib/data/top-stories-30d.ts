import { Article } from '@/types';

// Curated list of top stories from the last 30 days (Nov-Dec 2025)
export const TOP_STORIES_30D: Article[] = [
    // GLOBAL / ALL
    {
        id: 'top-1',
        title: 'OpenAI Releases GPT-5: The Age of Agents Begins',
        summary: 'The long-awaited model demonstrates full autonomous planning capabilities, scoring 92% on the SWE-bench. Experts call it the "first true agentic model."',
        source: 'The Verge',
        url: 'https://theverge.com',
        publishedAt: '2025-11-15T10:00:00Z',
        category: 'ai',
        importanceScore: 100,
        topicSlug: 'gpt-5-release'
    },
    {
        id: 'top-2',
        title: 'Nvidia H200 Chips Sold Out Until 2027',
        summary: 'Jensen Huang confirms unprecedented demand for the new Blackwell architecture, driven largely by sovereign AI initiatives in the Middle East and Europe.',
        source: 'Bloomberg',
        url: 'https://bloomberg.com',
        publishedAt: '2025-11-20T14:30:00Z',
        category: 'market',
        importanceScore: 95,
        topicSlug: 'nvidia-h200-shortage'
    },
    {
        id: 'top-3',
        title: 'EU AI Act Enters Full Force: Foundation Models Face Audit',
        summary: 'Brussels begins the first wave of compliance checks. Meta and Google warn of potential service withdrawals if requirements are deemed "technically impossible."',
        source: 'Reuters',
        url: 'https://reuters.com',
        publishedAt: '2025-12-01T09:15:00Z',
        category: 'policy',
        importanceScore: 90,
        topicSlug: 'eu-ai-act-audit'
    },
    {
        id: 'top-4',
        title: 'Tesla Optimus Gen 3 Deployed in Giga Texas',
        summary: 'Video evidence shows 50+ humanoid robots performing complex assembly tasks without teleoperation. Stock jumps 12% on the news.',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        publishedAt: '2025-11-28T16:45:00Z',
        category: 'robotics',
        importanceScore: 92,
        topicSlug: 'optimus-gen-3'
    },
    {
        id: 'top-5',
        title: 'Anthropic Claude 3.5 Opus "Self-Corrects" Code in Real-Time',
        summary: 'New feature allows the model to run its own code, detect errors, and fix them before showing the user. A massive leap for developer productivity.',
        source: 'Ars Technica',
        url: 'https://arstechnica.com',
        publishedAt: '2025-11-10T11:20:00Z',
        category: 'code',
        importanceScore: 88,
        topicSlug: 'claude-self-correct'
    },
    // ROBOTICS SPECIFIC
    {
        id: 'top-rob-1',
        title: 'Figure AI Raises $2B for "General Purpose" Home Robot',
        summary: 'Backed by Bezos and Nvidia, the startup aims to have a robot in 10M homes by 2030. Demo shows robot folding laundry and making coffee.',
        source: 'VentureBeat',
        url: 'https://venturebeat.com',
        publishedAt: '2025-11-25T13:00:00Z',
        category: 'robotics',
        importanceScore: 85,
        topicSlug: 'figure-ai-raise'
    },
    // MARKET SPECIFIC
    {
        id: 'top-mkt-1',
        title: 'Microsoft-OpenAI "Stargate" Supercomputer Approved',
        summary: 'The $100B project in Wisconsin breaks ground. Will house 5M GPUs and consume 5GW of power.',
        source: 'WSJ',
        url: 'https://wsj.com',
        publishedAt: '2025-11-18T08:00:00Z',
        category: 'market',
        importanceScore: 98,
        topicSlug: 'stargate-supercomputer'
    }
];

export const getTopStories = (category: string = 'all') => {
    if (category === 'all' || category === 'All') {
        return TOP_STORIES_30D.sort((a, b) => b.importanceScore - a.importanceScore);
    }
    return TOP_STORIES_30D.filter(s => s.category === category.toLowerCase()).sort((a, b) => b.importanceScore - a.importanceScore);
};
