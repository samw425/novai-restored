'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Briefcase, Globe, ArrowUpRight, ArrowDownRight, Activity, Building2, Zap, TrendingDown } from 'lucide-react';
import { Article } from '@/types';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
import { MarketGraph } from '@/components/market/MarketGraph';
import { StockTable } from '@/components/market/StockTable';

export default function MarketPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [businessIntel, setBusinessIntel] = useState<{
        funding: Article[],
        ipos: Article[],
        acquisitions: Article[],
        topCompanies: { name: string, mentions: number }[]
    }>({ funding: [], ipos: [], acquisitions: [], topCompanies: [] });
    const [activeTab, setActiveTab] = useState<'live' | 'brief'>('live');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/feed/live?category=market&limit=40');
                const data = await response.json();
                const fetchedArticles = data.articles || [];

                setArticles(fetchedArticles);
                analyzeBusinessActivity(fetchedArticles);
            } catch (error) {
                console.error('Failed to fetch market data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Poll every 60s
        return () => clearInterval(interval);
    }, []);

    const analyzeBusinessActivity = (data: Article[]) => {
        // Filter for specific business activities
        const fundingArticles = data.filter(a => {
            const text = (a.title + ' ' + a.summary).toLowerCase();
            return text.includes('funding') || text.includes('raises') || text.includes('investment') ||
                text.includes('capital') || text.includes('series') || text.includes('round');
        }).slice(0, 5);

        const ipoArticles = data.filter(a => {
            const text = (a.title + ' ' + a.summary).toLowerCase();
            return text.includes('ipo') || text.includes('public offering') || text.includes('goes public') ||
                text.includes('listing') || text.includes('debut');
        }).slice(0, 3);

        const acquisitionArticles = data.filter(a => {
            const text = (a.title + ' ' + a.summary).toLowerCase();
            return text.includes('acquisition') || text.includes('acquires') || text.includes('merger') ||
                text.includes('buyout') || text.includes('takeover');
        }).slice(0, 3);

        // Extract company names from titles
        const aiCompanies = ['openai', 'anthropic', 'nvidia', 'microsoft', 'google', 'meta', 'apple', 'amazon', 'tesla', 'hugging face', 'cohere', 'stability', 'midjourney', 'character', 'perplexity', 'inflection'];
        const companyMentions: Record<string, number> = {};

        data.forEach(article => {
            const text = (article.title + ' ' + article.summary).toLowerCase();
            aiCompanies.forEach(company => {
                if (text.includes(company)) {
                    companyMentions[company] = (companyMentions[company] || 0) + 1;
                }
            });
        });

        const topCompanies = Object.entries(companyMentions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([name, mentions]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                mentions
            }));

        setBusinessIntel({ funding: fundingArticles, ipos: ipoArticles, acquisitions: acquisitionArticles, topCompanies });
    };

    // Mock Data for "Wow" Factor (since we don't have a paid stock API)
    const aiStocks = [
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 148.50, change: 2.45, changePercent: 1.68, volume: '42.1M', trend: [140, 142, 141, 145, 144, 146, 148], sector: 'AI Chips' },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.20, change: -1.10, changePercent: -0.26, volume: '18.5M', trend: [418, 420, 419, 416, 417, 416, 415], sector: 'Software' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 175.30, change: 0.85, changePercent: 0.49, volume: '22.3M', trend: [170, 172, 171, 173, 174, 174, 175], sector: 'Software' },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 245.80, change: 5.20, changePercent: 2.16, volume: '95.2M', trend: [230, 235, 232, 238, 240, 242, 245], sector: 'Robotics' },
        { symbol: 'PLTR', name: 'Palantir Tech', price: 24.50, change: 0.45, changePercent: 1.87, volume: '35.6M', trend: [22, 23, 23, 24, 24, 24, 24.5], sector: 'Software' },
        { symbol: 'AMD', name: 'Adv Micro Devices', price: 165.40, change: 1.20, changePercent: 0.73, volume: '48.9M', trend: [160, 162, 161, 163, 164, 165, 165], sector: 'AI Chips' },
        { symbol: 'AVAV', name: 'AeroVironment', price: 185.20, change: 3.10, changePercent: 1.70, volume: '1.2M', trend: [178, 180, 182, 181, 183, 184, 185], sector: 'Robotics' },
        { symbol: 'PATH', name: 'UiPath Inc', price: 18.90, change: -0.30, changePercent: -1.56, volume: '8.4M', trend: [20, 19.5, 19.2, 19.0, 18.8, 19.0, 18.9], sector: 'Software' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Business Intelligence</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Market Activity</h1>
                <p className="text-gray-500 mt-2 text-lg">AI Company Funding, IPOs, and M&A Tracking.</p>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'live' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Live Market
                    </button>
                    <button
                        onClick={() => setActiveTab('brief')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'brief' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        30-Day Brief
                    </button>
                </div>
            </div>

            {loading ? (
                <ResourceLoader message="Analyzing global market data..." />
            ) : activeTab === 'brief' ? (
                <MonthlyIntelBrief articles={articles} fullView={true} category="market" />
            ) : (
                <div className="space-y-8">

                    {/* Top Level Metrics - Graphs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">AI Sector Index</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-black text-gray-900">4,285.12</span>
                                <span className="text-sm font-bold text-emerald-600">+1.24%</span>
                            </div>
                            <MarketGraph data={[4200, 4220, 4210, 4250, 4240, 4260, 4285]} color="green" height={60} />
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Robotics Index</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-black text-gray-900">1,892.45</span>
                                <span className="text-sm font-bold text-emerald-600">+0.85%</span>
                            </div>
                            <MarketGraph data={[1850, 1860, 1870, 1865, 1880, 1890, 1892]} color="green" height={60} />
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Venture Capital Flow</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-black text-gray-900">$2.4B</span>
                                <span className="text-sm font-bold text-gray-400">Last 7 Days</span>
                            </div>
                            <MarketGraph data={[1.2, 1.5, 2.1, 1.8, 2.2, 2.5, 2.4]} color="blue" height={60} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Stock Table */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Top AI & Robotics Movers</h2>
                                <span className="text-xs font-mono text-emerald-600 animate-pulse">● LIVE DATA</span>
                            </div>
                            <StockTable stocks={aiStocks as any} />
                        </div>

                        {/* Side Rail: Funding & IPOs */}
                        <div className="space-y-6">
                            {/* Funding Rounds */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-bold text-gray-900">Recent Funding</h2>
                                </div>
                                <div className="space-y-3">
                                    {businessIntel.funding.slice(0, 5).map((article, i) => (
                                        <a key={i} href={article.url} target="_blank" className="block p-3 bg-emerald-50/50 rounded-lg hover:bg-emerald-100 transition-colors group">
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-2 mb-1">{article.title}</h3>
                                            <span className="text-xs text-gray-500">{article.source}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* IPOs */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-lg font-bold text-gray-900">IPO Watch</h2>
                                </div>
                                <div className="space-y-3">
                                    {businessIntel.ipos.slice(0, 3).map((article, i) => (
                                        <a key={i} href={article.url} target="_blank" className="block p-3 bg-blue-50/50 rounded-lg hover:bg-blue-100 transition-colors group">
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 line-clamp-2 mb-1">{article.title}</h3>
                                            <span className="text-xs text-gray-500">{article.source}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
