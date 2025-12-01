'use client';

import { useState, useEffect } from 'react';
import { Wrench, Terminal, Cpu, ArrowUpRight, GitFork, Star, Loader2, Box, Sparkles } from 'lucide-react';
import { Tool } from '@/types';
import { FeedContainer } from '@/components/feed/FeedContainer';

export default function LabToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

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

        fetchTools();
    }, []);

    return (
        <div className="space-y-8 min-h-screen bg-gray-50/50 text-gray-900 p-6 lg:p-8 font-sans">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-indigo-600" />
                        LAB & TOOLS
                    </h1>
                    <p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">
                        FRAMEWORKS // LIBRARIES // MODELS // UTILITIES
                    </p>
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
            ) : (
                <div className="space-y-12">

                    {/* Featured Tools Directory */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-gray-900">Featured Resources</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tools.map((tool, i) => (
                                <article key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                                <Box className="h-3 w-3" />
                                                {tool.source || tool.category || 'TOOL'}
                                            </span>
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
                                        className="block group-hover:text-indigo-600 transition-colors mb-2"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                            {tool.name}
                                        </h3>
                                    </a>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                        {tool.description}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-auto">
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                                            <Star className="h-3 w-3 text-amber-400" />
                                            {Math.floor(Math.random() * 5000) + 100}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                                            <GitFork className="h-3 w-3 text-gray-400" />
                                            {Math.floor(Math.random() * 500) + 10}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Live Tool Feed */}
                    <section className="pt-8 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-indigo-600" />
                            Live Tool Intelligence
                        </h2>
                        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                            <FeedContainer forcedCategory="tools" showTicker={false} />
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
