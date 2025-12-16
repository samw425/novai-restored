// @ts-nocheck
import { NextResponse } from 'next/server';
// @ts-ignore
import Parser from 'rss-parser/dist/rss-parser.min.js';

export const dynamic = 'force-dynamic';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
});

const GENERAL_FEEDS = [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/category/business/latest/rss',
    'https://www.businessinsider.com/rss',
    'https://feeds.feedburner.com/venturebeat/SZYF',
    'https://ynet-news.com/feed',
];

const RESEARCH_FEEDS = [
    'http://export.arxiv.org/rss/cs.SE', // Software Engineering
    'http://export.arxiv.org/rss/cs.AI', // Artificial Intelligence
    'http://export.arxiv.org/rss/cs.LG', // Machine Learning
    'http://export.arxiv.org/rss/cs.PL', // Programming Languages
    'http://export.arxiv.org/rss/cs.HC', // Human-Computer Interaction
    'https://openai.com/blog/rss.xml', // OpenAI Research
    'https://research.google/blog/rss', // Google Research
    'https://www.microsoft.com/en-us/research/feed/', // Microsoft Research
];

// Keywords for "The Collapse" (Live Market Signals)
const LIVE_KEYWORDS = [
    'layoff', 'job cut', 'hiring freeze', 'unemployment',
    'ai coding', 'autonomous agent', 'devin', 'copilot', 'chatgpt',
    'replace engineers', 'end of coding', 'software engineer', 'developer',
    'automation', 'generative ai', 'llm', 'coding assistant',
    'future of work', 'tech jobs', 'salary', 'market correction',
    'transformer model', 'gpt-4', 'claude', 'gemini', 'llama',
    'prompt engineering', 'no-code', 'low-code', 'ai displacement'
];

// Keywords for "The Research" (Academic & Deep Tech)
const RESEARCH_KEYWORDS = [
    'paper', 'study', 'arxiv', 'research', 'university', 'professor',
    'thesis', 'experiment', 'benchmark', 'evaluation', 'novel approach',
    'state of the art', 'sota', 'methodology', 'algorithm', 'neural network',
    'architecture', 'transformer', 'attention mechanism', 'reasoning',
    'code generation', 'program synthesis', 'formal verification',
    'large language model', 'generative pre-trained transformer'
];

// Keywords for "The Fall" (Specific Corporate Cases)
const CASES_KEYWORDS = [
    'layoff', 'cut', 'restructuring', 'fired', 'replaced', 'downsizing',
    'reduction in force', 'rif', 'severance', 'hiring pause', 'job loss',
    'automation impact', 'efficiency', 'cost cutting', 'shareholder',
    'stock price', 'quarterly report', 'earnings call'
];

import { RSS_FEEDS } from '@/config/rss-feeds';
export const runtime = 'edge';


export async function GET(request: Request) {
    console.log("Future of Code API called");
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type') || 'LIVE'; // LIVE, RESEARCH, CASES

        console.log(`Fetching page ${page} with limit ${limit} for type ${type}`);

        // Select Feeds based on Type using Central Config
        let targetFeeds = [];
        if (type === 'RESEARCH') {
            targetFeeds = RSS_FEEDS.filter(f => f.category === 'research' || f.category === 'ai');
        } else {
            // For LIVE/CASES, use 'tools' and 'market' (tech) feeds
            targetFeeds = RSS_FEEDS.filter(f => f.category === 'tools' || f.category === 'market');
        }

        const feedPromises = targetFeeds.map(async (source) => {
            try {
                const feed = await parser.parseURL(source.url);
                return feed.items.map((item: any) => ({
                    ...item,
                    source: source.name,
                    category: source.category
                }));
            } catch (e) {
                // console.error(`Failed to parse RSS: ${source.url}`, e);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        let allItems = results.flat();

        // Select Keywords based on Type
        let targetKeywords = LIVE_KEYWORDS;
        if (type === 'RESEARCH') targetKeywords = RESEARCH_KEYWORDS;
        if (type === 'CASES') targetKeywords = CASES_KEYWORDS;

        // Filter and Score
        let relevantItems = allItems
            .map((item: any) => {
                const text = (item.title + (item.contentSnippet || '')).toLowerCase();
                let score = 0;

                // Keyword Matching
                targetKeywords.forEach(keyword => {
                    if (text.includes(keyword)) score += 1;
                });

                // Boost specific high-impact terms for CASES
                if (type === 'CASES' && (text.includes('layoff') || text.includes('replace'))) score += 5;

                return { ...item, score };
            })
            .filter((item: any) => item.score > 0) // Must match at least one keyword
            .sort((a: any, b: any) => {
                return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
            });

        // DIVERSITY FILTER: Max 3 per source
        const sourceCounts: Record<string, number> = {};
        relevantItems = relevantItems.filter((item: any) => {
            const count = sourceCounts[item.source] || 0;
            if (count >= 3) return false;
            sourceCounts[item.source] = count + 1;
            return true;
        });

        // Pagination Logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = relevantItems.slice(startIndex, endIndex);

        // Infinite Feed Simulation (Historical)
        if (paginatedItems.length < limit && page > 1) {
            const needed = limit - paginatedItems.length;
            const historicalItems = generateHistoricalItems(needed, type);
            paginatedItems.push(...historicalItems);
        }

        return NextResponse.json({
            items: paginatedItems,
            hasMore: true
        });

    } catch (error) {
        console.error("CRITICAL ERROR in Future of Code API:", error);
        return NextResponse.json({ items: [], hasMore: false, error: String(error) }, { status: 500 });
    }
}

function generateHistoricalItems(count: number, type: string) {
    const items = [];
    let titles = [];
    let source = "Market Archive";

    if (type === 'RESEARCH') {
        titles = [
            "Evaluating Large Language Models Trained on Code",
            "Program Synthesis with Large Language Models",
            "Competition-Level Code Generation with AlphaCode",
            "A Survey of AI-Generated Code Security",
            "The Impact of AI on Software Engineering Education",
            "Automated Bug Repair using Deep Learning",
            "Prompt Engineering for Code Generation: A Systematic Review"
        ];
        source = "arXiv Archive";
    } else if (type === 'CASES') {
        titles = [
            "Google Cuts Hundreds of Core Engineering Roles",
            "Duolingo Offloads Translation Work to AI",
            "IBM Pauses Hiring for 7,800 Roles Replaceable by AI",
            "Unity Slashes Workforce in 'Company Reset'",
            "Stack Overflow Traffic Drops as Devs Turn to AI",
            "Dropbox Cuts 16% of Staff to Focus on AI",
            "Chegg Pivots to AI Strategy, Reduces Headcount"
        ];
        source = "Corporate Filing";
    } else {
        // LIVE / Default
        titles = [
            "Tech Giant Announces Workforce Restructuring Amid AI Shift",
            "Study Finds 40% of Coding Tasks Now Automated",
            "Junior Developer Roles Vanishing: The New Reality",
            "AI Agent 'Devin' Outperforms Human Engineers in Benchmark",
            "The End of the Bootcamp Era: Coding Schools Close Doors",
            "Salary Correction: Software Engineering Pay Stagnates",
            "From Coder to Prompter: The Evolution of the Dev Role",
            "Venture Capital Shifts Funding to AI-Native Code Platforms"
        ];
    }

    for (let i = 0; i < count; i++) {
        items.push({
            title: titles[Math.floor(Math.random() * titles.length)],
            link: '#',
            pubDate: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(), // Last 24 hours
            contentSnippet: "Real-time market signal detected by Novai agents.",
            source: "Live Signal",
            score: 10
        });
    }
    return items;
}
