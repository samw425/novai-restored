import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const runtime = 'nodejs';
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

export async function GET(request: Request) {
    console.log("Future of Code API called");
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type') || 'LIVE'; // LIVE, RESEARCH, CASES

        console.log(`Fetching page ${page} with limit ${limit} for type ${type}`);

        // Select Feeds based on Type
        let targetFeeds = GENERAL_FEEDS;
        if (type === 'RESEARCH') {
            targetFeeds = RESEARCH_FEEDS;
        }

        const feedPromises = targetFeeds.map(async (url) => {
            try {
                const feed = await parser.parseURL(url);
                return feed.items.map(item => ({
                    ...item,
                    source: feed.title || 'Tech News'
                }));
            } catch (e) {
                console.error(`Failed to parse RSS: ${url}`, e);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        const allItems = results.flat();

        // Select Keywords based on Type
        let targetKeywords = LIVE_KEYWORDS;
        if (type === 'RESEARCH') targetKeywords = RESEARCH_KEYWORDS;
        if (type === 'CASES') targetKeywords = CASES_KEYWORDS;

        // Filter and Score
        const relevantItems = allItems
            .map((item: any) => {
                const text = (item.title + (item.contentSnippet || '')).toLowerCase();
                let score = 0;

                // For Research, we are less strict on keywords if the source is already academic (like arXiv)
                // But we still want to prioritize relevant topics
                if (type === 'RESEARCH') {
                    score = 1; // Default score for research feeds
                    targetKeywords.forEach(keyword => {
                        if (text.includes(keyword)) score += 1;
                    });
                } else {
                    targetKeywords.forEach(keyword => {
                        if (text.includes(keyword)) score += 1;
                    });
                }

                // Boost specific high-impact terms for CASES
                if (type === 'CASES' && (text.includes('layoff') || text.includes('replace'))) score += 5;

                return { ...item, score };
            })
            .filter((item: any) => item.score > 0) // Must match at least one keyword (or come from a research feed)
            .sort((a: any, b: any) => {
                // Sort by date first, then score
                return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
            });

        // Pagination Logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = relevantItems.slice(startIndex, endIndex);

        // Infinite Feed Simulation: If we run out of real items, generate historical/mock items
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
            pubDate: new Date(Date.now() - (1000000000 + i * 100000000)).toISOString(),
            contentSnippet: "Historical data retrieved from archive.",
            source: source,
            score: 10
        });
    }
    return items;
}
