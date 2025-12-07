'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe, TrendingUp, Zap, Activity, Brain, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Article } from '@/types';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { PageHeader } from '@/components/ui/PageHeader';
import { DailyBrief } from '@/lib/data/daily-briefs';

export default function DailySnapshotPage() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
    const [pastBriefs, setPastBriefs] = useState<DailyBrief[]>([]);
    const [leadStory, setLeadStory] = useState<Article | null>(null);
    const [keyDevelopments, setKeyDevelopments] = useState<Article[]>([]);
    const [rapidFire, setRapidFire] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Daily Brief (Latest + Archive)
                try {
                    const [latestRes, archiveRes] = await Promise.all([
                        fetch('/api/brief?mode=latest'),
                        fetch('/api/brief?mode=archive')
                    ]);

                    const latestData = await latestRes.json();
                    const archiveData = await archiveRes.json();

                    if (latestData.brief) setDailyBrief(latestData.brief);
                    if (archiveData.briefs) setPastBriefs(archiveData.briefs);

                } catch (e) {
                    console.error('Brief fetch failed', e);
                }

                // 2. Fetch Articles (Live Feed Logic)
                const [aiRes, roboticsRes, researchRes] = await Promise.all([
                    fetch('/api/feed/live?category=ai&limit=20'),
                    fetch('/api/feed/live?category=robotics&limit=10'),
                    fetch('/api/feed/live?category=research&limit=10')
                ]);

                const aiData = await aiRes.json();
                const roboticsData = await roboticsRes.json();
                const researchData = await researchRes.json();

                // Combine and deduplicate
                let allArticles = [
                    ...(researchData.articles || []),
                    ...(aiData.articles || []),
                    ...(roboticsData.articles || [])
                ];

                // FALLBACK: If no articles, fetch from ALL
                if (allArticles.length === 0) {
                    const fallbackRes = await fetch('/api/feed/live?limit=30');
                    const fallbackData = await fallbackRes.json();
                    allArticles = fallbackData.articles || [];
                }

                // Remove duplicates based on ID
                const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.id, item])).values());

                // CRITICAL: Sort by freshness to ensure Lead Story is the absolute latest
                uniqueArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

                if (uniqueArticles.length > 0) {
                    setLeadStory(uniqueArticles[0]);
                    setKeyDevelopments(uniqueArticles.slice(1, 4));
                    setRapidFire(uniqueArticles.slice(4, 14));
                }

            } catch (error) {
                console.error('Failed to fetch snapshot data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4 sm:px-6">

            {/* Header with Analyst Note */}
            <div className="pt-8 md:pt-12">
                <PageHeader
                    title="The Morning Protocol."
                    description={today}
                    insight="Live Intelligence Feed. The definitive Lead Story and critical real-time developments, prioritized above the noise."
                    icon={<Clock className="w-8 h-8 text-blue-600" />}
                />
            </div>

            {loading ? (
                <ResourceLoader message="Decrypting daily intelligence brief..." />
            ) : (
                <div className="space-y-20">

                    {/* 2. LIVE FEED (Lead Story + Stream) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Column (8/12) */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Lead Story (Cinematic) */}
                            {leadStory && (
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-500" />
                                    <div className="relative bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-2 w-2 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                </span>
                                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Lead Story</span>
                                            </div>
                                            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
                                                Must Read
                                            </span>
                                        </div>

                                        <div className="mb-8">
                                            <a href={leadStory.url} target="_blank" rel="noopener noreferrer" className="block group/title">
                                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-[1.05] tracking-tight group-hover/title:text-blue-700 transition-colors duration-300">
                                                    {leadStory.title}
                                                </h2>
                                            </a>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium border-l-2 border-slate-200 pl-4">
                                                <span className="text-slate-900 font-bold uppercase tracking-wide text-xs">{leadStory.source}</span>
                                                <span>•</span>
                                                <span className="font-mono text-xs">{new Date(leadStory.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>

                                        <p className="text-xl text-slate-600 leading-relaxed mb-8 font-serif antialiased border-b border-slate-100 pb-8">
                                            {leadStory.summary}
                                        </p>

                                        <div className="flex items-center justify-end">
                                            <a href={leadStory.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group/link bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-200">
                                                Read Full Analysis
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Key Developments (Editorial List) */}
                            <div>
                                <div className="flex items-center gap-3 mb-8 pl-1 border-b border-slate-200 pb-4">
                                    <Zap className="h-5 w-5 text-slate-900" />
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                        Key Developments
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    {keyDevelopments.map((article) => (
                                        <a
                                            key={article.id}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block"
                                        >
                                            <div className="flex items-baseline gap-3 mb-2">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                                                    {article.category}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                                                {article.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                                                {article.source}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (4/12) - Rapid Fire Stream */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 pl-4 border-l border-slate-200">
                                <div className="flex items-center gap-2 mb-8 text-slate-900">
                                    <Activity className="h-4 w-4 text-slate-900" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest">Rapid Fire</h2>
                                </div>

                                <div className="space-y-8">
                                    {rapidFire.map((article) => (
                                        <a
                                            key={article.id}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group relative"
                                        >
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                                                    {article.source}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-medium text-slate-700 leading-snug group-hover:text-slate-900 transition-colors line-clamp-3">
                                                {article.title}
                                            </h3>
                                        </a>
                                    ))}
                                </div>

                                <div className="mt-8 pt-4">
                                    <a
                                        href="/global-feed"
                                        className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 inline-flex"
                                    >
                                        View Full Feed
                                        <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 3. PAST BRIEFS ARCHIVE */}
                    <div className="pt-16 border-t border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <Clock className="h-5 w-5 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                Intelligence Archive (Past 30 Days)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastBriefs.filter(b => b.id !== dailyBrief?.id).slice(0, 6).map((brief) => (
                                <div key={brief.id} className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-xs font-mono text-slate-400">
                                            {brief.date}
                                        </div>
                                        <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full">
                                            {brief.clearanceLevel.split('//')[0]}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                                        {brief.headline}
                                    </h4>
                                    <div className="space-y-2">
                                        {brief.items.slice(0, 2).map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.impact === 'CRITICAL' ? 'bg-red-500' :
                                                    item.impact === 'SEVERE' ? 'bg-orange-500' : 'bg-blue-500'
                                                    }`}></span>
                                                <span className="truncate">{item.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
