'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Building2, Loader2, Zap, TrendingDown } from 'lucide-react';
import { Article } from '@/types';

export default function MarketPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [businessIntel, setBusinessIntel] = useState<{
        funding: Article[],
        ipos: Article[],
        acquisitions: Article[],
        topCompanies: { name: string, mentions: number }[]
    }>({ funding: [], ipos: [], acquisitions: [], topCompanies: [] });

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
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Business Activity Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Funding Rounds */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-lg font-bold text-gray-900">Funding Rounds</h2>
                            </div>

                            {businessIntel.funding.length > 0 ? (
                                <div className="space-y-3">
                                    {businessIntel.funding.map((article, i) => (
                                        <a
                                            key={i}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
                                        >
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-2 mb-1">
                                                {article.title}
                                            </h3>
                                            <span className="text-xs text-gray-500">{article.source}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-sm">No funding news detected.</p>
                            )}
                        </div>

                        {/* IPOs */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-bold text-gray-900">IPOs & Listings</h2>
                            </div>

                            {businessIntel.ipos.length > 0 ? (
                                <div className="space-y-3">
                                    {businessIntel.ipos.map((article, i) => (
                                        <a
                                            key={i}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                                        >
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 line-clamp-2 mb-1">
                                                {article.title}
                                            </h3>
                                            <span className="text-xs text-gray-500">{article.source}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-sm">No IPO news detected.</p>
                            )}
                        </div>

                        {/* M&A */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="h-5 w-5 text-purple-600" />
                                <h2 className="text-lg font-bold text-gray-900">M&A Activity</h2>
                            </div>

                            {businessIntel.acquisitions.length > 0 ? (
                                <div className="space-y-3">
                                    {businessIntel.acquisitions.map((article, i) => (
                                        <a
                                            key={i}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                                        >
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-700 line-clamp-2 mb-1">
                                                {article.title}
                                            </h3>
                                            <span className="text-xs text-gray-500">{article.source}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-sm">No M&A news detected.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Companies in the News */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingDown className="h-5 w-5 text-gray-700" />
                            <h2 className="text-lg font-bold text-gray-900">Most Mentioned Companies</h2>
                        </div>

                        {businessIntel.topCompanies.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {businessIntel.topCompanies.map((company, i) => (
                                    <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-black text-gray-900 mb-1">{company.mentions}</div>
                                        <div className="text-xs font-bold text-gray-600 uppercase">{company.name}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">Analyzing company mentions...</p>
                        )}
                    </div>

                    {/* All Market News */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">All Market News</h2>
                        <div className="divide-y divide-gray-100">
                            {articles.slice(0, 10).map((article, i) => (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block py-4 hover:bg-gray-50 transition-colors flex gap-4 group"
                                >
                                    <div className="flex-shrink-0 w-12 text-center">
                                        <span className="block text-xs font-bold text-gray-400 group-hover:text-emerald-600 transition-colors">
                                            {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">{article.source}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
