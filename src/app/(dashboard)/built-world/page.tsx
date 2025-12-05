'use client';

import { useState, useEffect } from 'react';
import { Building2, Server, Home, Zap, ArrowUpRight, History, Activity, TrendingUp, Info, ChevronRight } from 'lucide-react';
import { ResourceLoader } from '@/components/ui/ResourceLoader';

interface Article {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    source: string;
    snippet?: string;
    subCategory: 'commercial' | 'residential';
}

export default function BuiltWorldPage() {
    const [activeTab, setActiveTab] = useState<'commercial' | 'residential'>('commercial');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/feed/built-world?type=${activeTab}`);
                const data = await res.json();
                setArticles(data.articles || []);
            } catch (error) {
                console.error('Failed to fetch built world feed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [activeTab]);

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 sm:px-6">
            {/* Hero Section */}
            <div className="relative pt-12 pb-8 md:pt-16 md:pb-10">
                <div className="space-y-6 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                        <Building2 className="w-3 h-3" />
                        Sector Intelligence
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-extrabold text-slate-900 tracking-tighter leading-[0.9]">
                        The Built World.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed font-sans tracking-tight">
                        Tracking the physical infrastructure of the AI era.
                    </p>
                </div>
            </div>

            {/* Data & Trends Row (New) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Power Demand</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-slate-900">1,000+ TWh</span>
                        <span className="text-xs font-bold text-emerald-600 flex items-center">+15% YoY</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Projected AI consumption by 2026.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Server className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Center Vacancy</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-slate-900">2.8%</span>
                        <span className="text-xs font-bold text-red-600 flex items-center">Record Low</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Primary markets (NoVA, Silicon Valley).</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Infrastructure CapEx</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-slate-900">$1 Trillion</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Expected investment over next 5 years.</p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Intelligence Stream (8/12) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Controls */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setActiveTab('commercial')}
                                className={`text-sm font-bold pb-4 -mb-4 transition-colors ${activeTab === 'commercial'
                                        ? 'text-slate-900 border-b-2 border-slate-900'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Compute & Commercial
                            </button>
                            <button
                                onClick={() => setActiveTab('residential')}
                                className={`text-sm font-bold pb-4 -mb-4 transition-colors ${activeTab === 'residential'
                                        ? 'text-slate-900 border-b-2 border-slate-900'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Residential & PropTech
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            LIVE FEED
                        </div>
                    </div>

                    {/* Feed List */}
                    {loading ? (
                        <ResourceLoader message="Accessing global infrastructure feeds..." />
                    ) : (
                        <div className="space-y-0 divide-y divide-slate-100">
                            {articles.map((article) => (
                                <a
                                    key={article.id}
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block py-6 hover:bg-slate-50 -mx-4 px-4 rounded-lg transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`p-1.5 rounded-md ${activeTab === 'commercial' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {activeTab === 'commercial' ? <Server className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                                            </span>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                {article.source}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                                            {new Date(article.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h3>

                                    {article.snippet && (
                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                                            {article.snippet}
                                        </p>
                                    )}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Context & History (4/12) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Historic Precedent Card (White Theme) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="w-4 h-4 text-blue-600" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Historic Precedent</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            The New Railroads
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Just as the 19th-century railroad boom reshaped geography, the AI era is rewriting the map of power. Data centers are the new depots; fiber is the new track.
                        </p>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[45%]"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-right">Infrastructure Deployment Cycle: Early Phase</p>
                    </div>

                    {/* Why This Matters */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Why This Matters</span>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-slate-300" />
                                <div>
                                    <strong className="block text-xs text-slate-900 mb-0.5">Compute is the new Oil</strong>
                                    <p className="text-xs text-slate-500 leading-relaxed">Access to power and land now determines national competitiveness.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-slate-300" />
                                <div>
                                    <strong className="block text-xs text-slate-900 mb-0.5">The "Smart" Premium</strong>
                                    <p className="text-xs text-slate-500 leading-relaxed">Real estate without AI integration will face rapid devaluation.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
