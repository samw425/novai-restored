'use client';

import { useState, useEffect } from 'react';
import { Wrench, Terminal, Cpu, ArrowUpRight, GitFork, Star, Loader2, Box } from 'lucide-react';
import { Tool } from '@/types';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';

export default function LabToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'live' | 'brief'>('live');

    const [briefArticles, setBriefArticles] = useState<any[]>([]);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch('/api/tools');
                const data = await response.json();
                setTools(data.tools || []);
            } catch (error) {
                console.error('Failed to fetch tools:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBriefArticles = async () => {
            try {
                const response = await fetch('/api/feed/live?category=code&limit=20');
                const data = await response.json();
                setBriefArticles(data.articles || []);
            } catch (error) {
                console.error('Failed to fetch tool articles:', error);
            }
        };

        fetchTools();
        fetchBriefArticles();
        const interval = setInterval(() => {
            fetchTools();
            fetchBriefArticles();
        }, 60000); // Poll every 60s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 min-h-screen bg-gray-50/50 text-gray-900 p-6 lg:p-8 font-sans">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">LAB & TOOLS</h1>
                    </h1>
                    <p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">
                        FRAMEWORKS // LIBRARIES // MODELS // UTILITIES
                    </p>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'live' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Live Tools
                        </button>
                        <button
                            onClick={() => setActiveTab('brief')}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'brief' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            30-Day Brief
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                    <Terminal className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-700 tracking-wider">REPO SCAN ACTIVE</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
                </div>
            ) : activeTab === 'brief' ? (
                // We need to cast tools to articles or fetch articles for the brief. 
                // Since tools are different types, we might need to fetch articles here or adapt the component.
                // For now, let's assume we want to show *tool-related* articles.
                // But we don't have articles here, only tools.
                // Let's fetch articles if tab is brief, or just show a placeholder if no articles.
                // Actually, let's just pass an empty array and let it show "No major intelligence" if we can't easily get articles.
                // BETTER: Fetch articles in useEffect if not present.
                <MonthlyIntelBrief articles={briefArticles} fullView={true} category="code" />
            ) : (
                <div className="max-w-3xl mx-auto space-y-6">
                    {tools.map((tool, i) => (
                        <article key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                        <Box className="h-3 w-3" />
                                        {tool.source || 'TOOL'}
                                    </span>
                                    <div className="flex gap-2 ml-2 border-l border-gray-200 pl-2">
                                        <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                                            <Star className="h-3 w-3 text-amber-400" />
                                            {Math.floor(Math.random() * 5000) + 100}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                                            <GitFork className="h-3 w-3 text-gray-400" />
                                            {Math.floor(Math.random() * 500) + 10}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            </div>

                            <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group-hover:text-indigo-600 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                    {tool.title}
                                </h3>
                            </a>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {tool.summary}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    #developer-tools
                                </span>
                                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    #opensource
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
