'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowRight, Zap, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { Article } from '@/types';

export default function MarketPulsePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        sentimentScore: 50, // 0-100
        sentimentLabel: 'Neutral',
        topEntities: [] as { name: string, count: number }[],
        trendingTopic: ''
    });

    useEffect(() => {
        const fetchMarketNews = async () => {
            try {
                // Fetch market and ai categories
                const [marketRes, aiRes] = await Promise.all([
                    fetch('/api/feed/live?category=market&limit=40'),
                    fetch('/api/feed/live?category=ai&limit=20')
                ]);

                const marketData = await marketRes.json();
                const aiData = await aiRes.json();

                const allArticles = [...(marketData.articles || []), ...(aiData.articles || [])];

                // Filter for AI/Tech Companies & Financial Context
                const aiCompanies = ['nvidia', 'microsoft', 'google', 'alphabet', 'meta', 'apple', 'amd', 'intel', 'tsmc', 'openai', 'anthropic', 'tesla', 'amazon', 'oracle', 'salesforce', 'palantir', 'snowflake', 'databricks'];
                const financialTerms = ['stock', 'shares', 'earnings', 'revenue', 'profit', 'valuation', 'ipo', 'acquisition', 'merger', 'invest', 'funding', 'capital', 'market', 'nasdaq', 'dow', 's&p'];

                const filteredArticles = allArticles.filter(article => {
                    const text = (article.title + ' ' + article.summary).toLowerCase();
                    const hasCompany = aiCompanies.some(c => text.includes(c));
                    const hasFinance = financialTerms.some(t => text.includes(t));
                    return hasCompany || (hasFinance && text.includes('ai'));
                });

                // Deduplicate
                const uniqueArticles = Array.from(new Map(filteredArticles.map(item => [item.id, item])).values())
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

                setArticles(uniqueArticles);
                analyzeData(uniqueArticles, aiCompanies);
            } catch (error) {
                console.error('Failed to fetch market news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketNews();
    }, []);

    const analyzeData = (data: Article[], targetEntities: string[]) => {
        if (data.length === 0) return;

        // 1. Sentiment Analysis
        let bullCount = 0;
        let bearCount = 0;
        const positive = ['rise', 'surge', 'jump', 'growth', 'record', 'up', 'gain', 'bull', 'buy', 'profit', 'beat', 'soar'];
        const negative = ['fall', 'drop', 'crash', 'loss', 'down', 'bear', 'sell', 'warn', 'risk', 'cut', 'miss', 'slump'];

        data.forEach(a => {
            const title = a.title.toLowerCase();
            if (positive.some(w => title.includes(w))) bullCount++;
            if (negative.some(w => title.includes(w))) bearCount++;
        });

        const totalSignals = bullCount + bearCount || 1;
        const score = Math.round((bullCount / totalSignals) * 100);
        let label = 'Neutral';
        if (score > 60) label = 'Greed / Bullish';
        else if (score < 40) label = 'Fear / Bearish';

        // 2. Entity Extraction (Focused on Target Companies)
        const entityCounts: Record<string, number> = {};
        data.forEach(a => {
            const text = (a.title + ' ' + a.summary).toLowerCase();
            targetEntities.forEach(company => {
                if (text.includes(company)) {
                    entityCounts[company] = (entityCounts[company] || 0) + 1;
                }
            });
        });

        const sortedEntities = Object.entries(entityCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }));

        setStats({
            sentimentScore: score,
            sentimentLabel: label,
            topEntities: sortedEntities,
            trendingTopic: sortedEntities[0]?.name || 'AI Sector'
        });
    };

    return (
        <div className="space-y-8 min-h-screen bg-gray-950 text-gray-100 p-6 lg:p-8 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <div className="border-b border-blue-900/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                        MARKET PULSE
                    </h1>
                    <p className="text-blue-400/60 mt-2 text-sm font-mono uppercase tracking-widest">
                        Sector Analysis // Financial Signals // Entity Tracking
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-950/30 border border-blue-900/50 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-blue-200 tracking-wider">LIVE MARKET DATA</span>
                </div>
            </div>

            {/* Intelligence Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Sentiment Meter */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/50"></div>
                    <div className="flex items-center gap-2 mb-8">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Market Sentiment Signal</h2>
                    </div>

                    {loading ? (
                        <div className="h-40 flex justify-center items-center"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>
                    ) : (
                        <div className="flex flex-col justify-center items-center text-center relative z-10">
                            <div className="relative w-48 h-24 overflow-hidden mb-4">
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-t-full border-t border-l border-r border-gray-700"></div>
                                <div
                                    className={`absolute top-0 left-0 w-full h-full rounded-t-full origin-bottom transition-all duration-1000 opacity-80 ${stats.sentimentScore > 60 ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : stats.sentimentScore < 40 ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                                        }`}
                                    style={{ transform: `rotate(${(stats.sentimentScore / 100) * 180 - 180}deg)` }}
                                ></div>
                                {/* Gauge Ticks */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[90%] border-t border-gray-900/50 rounded-t-full"></div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-5xl font-black text-white tracking-tighter tabular-nums">{stats.sentimentScore}</div>
                                <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${stats.sentimentScore > 60 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' :
                                        stats.sentimentScore < 40 ? 'text-red-400 border-red-900/50 bg-red-950/30' :
                                            'text-amber-400 border-amber-900/50 bg-amber-950/30'
                                    }`}>{stats.sentimentLabel}</div>
                            </div>

                            <div className="mt-6 w-full grid grid-cols-3 gap-2 text-[10px] text-gray-500 font-mono uppercase text-center border-t border-gray-800 pt-4">
                                <div>Bearish</div>
                                <div>Neutral</div>
                                <div>Bullish</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Entity Tracking Matrix */}
                <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-[50px]"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-400" />
                            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Entity Tracking Matrix</h2>
                        </div>
                        <span className="text-[10px] font-mono text-blue-500/60 bg-blue-950/30 px-2 py-1 rounded border border-blue-900/30">
                            TOP MENTIONS (24H)
                        </span>
                    </div>

                    {loading ? (
                        <div className="h-48 flex justify-center items-center"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>
                    ) : (
                        <div className="space-y-3 relative z-10">
                            {stats.topEntities.map((entity, i) => (
                                <div key={entity.name} className="group relative">
                                    <div className="flex justify-between items-center text-sm mb-1.5 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-blue-500/50 w-6">0{i + 1}</span>
                                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{entity.name}</span>
                                        </div>
                                        <span className="font-mono text-xs text-blue-400">{entity.count} <span className="text-gray-600 text-[10px]">SIG</span></span>
                                    </div>
                                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                            style={{ width: `${(entity.count / (stats.topEntities[0]?.count || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {stats.topEntities.length === 0 && (
                                <div className="text-center text-gray-600 font-mono text-sm py-12 border border-dashed border-gray-800 rounded-lg">
                                    NO SIGNAL DETECTED
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Raw Feed (Context) */}
            <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-blue-900/20"></div>
                    <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        Incoming Financial Signals
                    </h2>
                    <div className="h-px flex-1 bg-blue-900/20"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-2 p-12 flex justify-center">
                            <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
                        </div>
                    ) : (
                        articles.slice(0, 10).map((item, i) => (
                            <a
                                key={i}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-gray-900/30 border border-gray-800 hover:border-blue-500/50 p-4 rounded-lg transition-all group hover:bg-gray-900/80"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/30">
                                                {item.source}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500">
                                                {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
