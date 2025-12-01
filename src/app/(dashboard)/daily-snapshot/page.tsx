'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe, TrendingUp, Zap, Activity, Brain, Cpu, FileText } from 'lucide-react';
import { Article } from '@/types';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { PageHeader } from '@/components/ui/PageHeader';

export default function DailySnapshotPage() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const [leadStory, setLeadStory] = useState<Article | null>(null);
    const [keyDevelopments, setKeyDevelopments] = useState<Article[]>([]);
    const [rapidFire, setRapidFire] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch strictly AI & Robotics related categories
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
                    ...(researchData.articles || []), // Prioritize research for lead
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

                if (uniqueArticles.length > 0) {
                    // 1. Lead Story: Top Research or AI article
                    const lead = uniqueArticles[0];
                    setLeadStory(lead);

                    // 2. Key Developments: Next 3 articles (Underneath Lead)
                    const nextThree = uniqueArticles.slice(1, 4);
                    setKeyDevelopments(nextThree);

                    // 3. Rapid Fire: The rest (Sidebar)
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
        <div className="space-y-10 max-w-6xl mx-auto">
            {/* Header */}
            <PageHeader
                title={today}
                description="Daily Intelligence Briefing"
                insight="Your executive summary of the AI landscape. We process thousands of signals to highlight the few that truly matter."
                icon={<Clock className="w-8 h-8 text-gray-900" />}
            />

            {loading ? (
                <ResourceLoader message="Compiling daily intelligence snapshot..." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Column (8/12) */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* 1. The Lead Story (Hero) */}
                        {leadStory && (
                            <div className="group relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                            </span>
                                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Lead Story</span>
                                        </div>
                                        <span className="px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold tracking-wider uppercase rounded-md">
                                            Must Read
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <a href={leadStory.url} target="_blank" rel="noopener noreferrer" className="block group/title">
                                            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.1] tracking-tight group-hover/title:text-blue-600 transition-colors duration-300">
                                                {leadStory.title}
                                            </h2>
                                        </a>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium border-l-2 border-gray-100 pl-4">
                                            <span className="text-gray-900 font-bold">{leadStory.source}</span>
                                            <span>•</span>
                                            <span>{new Date(leadStory.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span>•</span>
                                            <span className="uppercase tracking-wide text-xs">{leadStory.category}</span>
                                        </div>
                                    </div>

                                    <p className="text-lg text-gray-600 leading-relaxed mb-8 font-serif antialiased">
                                        {leadStory.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex gap-2">
                                            {/* Placeholder for tags if needed */}
                                        </div>
                                        <a href={leadStory.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group/link">
                                            Read Full Analysis
                                            <TrendingUp className="h-4 w-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Key Developments */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    Key Developments
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {keyDevelopments.map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group h-full"
                                    >
                                        <div className="mb-4">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                                                {article.category}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                                            {article.title}
                                        </h4>
                                        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-gray-400 border-t border-gray-50">
                                            <span className="text-gray-600">{article.source}</span>
                                            <span>{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (4/12) - Rapid Fire */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 sticky top-28 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-6 text-gray-900 pb-4 border-b border-gray-100">
                                <Activity className="h-4 w-4 text-blue-600" />
                                <h2 className="text-sm font-bold uppercase tracking-widest">Rapid Fire</h2>
                            </div>

                            <div className="space-y-1 relative">
                                {/* Timeline line */}
                                <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-gray-200" />

                                {rapidFire.map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block pl-6 py-3 relative group hover:bg-white hover:rounded-lg hover:shadow-sm transition-all duration-200 -ml-2 pr-2"
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute left-[2px] top-5 w-[7px] h-[7px] rounded-full bg-gray-300 border-2 border-gray-50 group-hover:bg-blue-500 group-hover:scale-125 transition-all" />

                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                                                {article.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-mono">
                                                {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-[13px] font-semibold text-gray-700 leading-snug group-hover:text-gray-900 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                                <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
                                    View All Updates →
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
