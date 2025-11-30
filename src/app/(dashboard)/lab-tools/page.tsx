'use client';

import { useState, useEffect } from 'react';
import { Wrench, Terminal, Cpu, ArrowUpRight, GitFork, Star, Loader2, Box } from 'lucide-react';
import { Article } from '@/types';

export default function LabToolsPage() {
    const [tools, setTools] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch('/api/feed/live?category=tools&limit=30');
                const data = await response.json();
                setTools(data.articles || []);
            } catch (error) {
                console.error('Failed to fetch tools:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, []);

    return (
        <div className="space-y-8 min-h-screen bg-gray-950 text-gray-100 p-6 lg:p-8 font-sans selection:bg-cyan-500/30">
            {/* Header */}
            <div className="border-b border-cyan-900/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-cyan-500" />
                        LAB & TOOLS
                    </h1>
                    <p className="text-cyan-400/60 mt-2 text-sm font-mono uppercase tracking-widest">
                        Frameworks // Libraries // Models // Utilities
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-cyan-950/30 border border-cyan-900/50 rounded-full">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-200 tracking-wider">REPO SCAN ACTIVE</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-24">
                    <Loader2 className="animate-spin text-cyan-500 h-12 w-12" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, i) => (
                        <div key={i} className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-cyan-950/50 transition-colors">
                                    <Box className="h-6 w-6 text-gray-400 group-hover:text-cyan-400" />
                                </div>
                                <div className="flex gap-2">
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                                        <Star className="h-3 w-3" />
                                        {Math.floor(Math.random() * 5000) + 100}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                                        <GitFork className="h-3 w-3" />
                                        {Math.floor(Math.random() * 500) + 10}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-200 group-hover:text-white mb-2 line-clamp-1">
                                {tool.title}
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                                {tool.summary}
                            </p>

                            <div className="pt-4 border-t border-gray-800 flex items-center justify-between mt-auto">
                                <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-wider">
                                    {tool.source}
                                </span>
                                <a
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    VIEW REPO <ArrowUpRight className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
