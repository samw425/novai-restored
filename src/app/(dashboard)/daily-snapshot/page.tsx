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
        <div className="space-y-8">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title={today}
                description="Curated intelligence on AI & Robotics."
                insight="Your daily executive summary. We process thousands of articles to highlight the few that actually matter."
                icon={<Clock className="w-8 h-8 text-blue-600" />}
            />

            {loading ? (
                <ResourceLoader message="Compiling daily intelligence snapshot..." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Column (2/3) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. The Lead Story (Hero) */}
                        {leadStory && (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 flex justify-between items-center">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        The Lead Story
                                    </span>
                                    <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded">
                                        MUST READ
                                    </span>
                                </div>
                                <div className="p-8">
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded">
                                            {leadStory.category}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center">
                                            {new Date(leadStory.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <a href={leadStory.url} target="_blank" rel="noopener noreferrer" className="group">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">
                                            {leadStory.title}
                                        </h2>
                                    </a>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        {leadStory.summary}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                                                {leadStory.source.substring(0, 2).toUpperCase()}
                                            </div>
                                            {leadStory.source}
                                        </div>
                                        <a href={leadStory.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                            Read Full Analysis <TrendingUp className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Key Developments (Row of 3) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-500" />
                                Key Developments
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {keyDevelopments.map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded">
                                                {article.category}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 mb-2 line-clamp-3 flex-1">
                                            {article.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                                            <span className="truncate max-w-[100px]">{article.source}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1/3) - Rapid Fire */}
                    <div>
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-6">
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <Activity className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-lg font-bold">Rapid Fire</h2>
                            </div>

                            <div className="space-y-4">
                                {rapidFire.map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                {article.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-blue-600 line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
