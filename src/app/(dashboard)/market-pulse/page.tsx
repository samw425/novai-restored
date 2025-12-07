'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowRight, Zap, DollarSign, BarChart3, Loader2, Lock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Article } from '@/types';
import { MarketHeatMap } from '@/components/market/MarketHeatMap';
import { AI_MARKET_DATA } from '@/lib/data/market-data';

export default function MarketPulsePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error('Failed to fetch market news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketNews();
    }, []);

    return (
        <div className="space-y-8 min-h-screen bg-slate-50 text-slate-900 p-6 lg:p-8 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <PageHeader
                title="Market Pulse"
                description="Capital Flow // AI Infrastructure // Sector Analysis"
                insight="Real-time visualization of capital allocation across the AI value chain. Tracking the money behind the intelligence."
                icon={<DollarSign className="w-8 h-8 text-blue-600" />}
            />

            {/* Pro Feature: Market Heatmap */}
            <div className="relative group">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-600" />
                        <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">AI Capital Heatmap</h2>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-50 border border-blue-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-blue-600">LIVE MARKET DATA</span>
                    </div>
                </div>

                {/* Heatmap Component */}
                <MarketHeatMap stocks={AI_MARKET_DATA} />
            </div>

            {/* Raw Feed (Context) */}
            <div className="relative pt-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        Incoming Financial Signals
                    </h2>
                    <div className="h-px flex-1 bg-slate-200"></div>
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
                                className="block bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md p-4 rounded-xl transition-all group"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                {item.source}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400">
                                                {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
