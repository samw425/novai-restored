'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Bot, Cpu, Play, ArrowUpRight, Battery, Activity, Zap } from 'lucide-react';
import { ROBOT_SPECS } from '@/lib/data/robotics-specs';

interface RoboticsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    source: string;
    type: 'news' | 'video';
    thumbnail?: string;
    snippet?: string;
}

export default function RoboticsPage() {
    const [feedItems, setFeedItems] = useState<RoboticsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'live' | 'brief'>('live');
    const [visibleItems, setVisibleItems] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/feed/robotics');
                const data = await res.json();
                if (data.items) {
                    setFeedItems(data.items);
                }
            } catch (e) {
                console.error("Failed to fetch robotics feed", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const videos = feedItems.filter(i => i.type === 'video');
    const news = feedItems.filter(i => i.type === 'news');
    const featuredVideo = videos[0]; // Most recent video

    return (
        <div className="space-y-8">
            <PageHeader
                title="ROBOTICS TRACKER"
                description="HUMANOID & EMBODIED AI INTELLIGENCE"
                insight="Tracking the rapid evolution of embodied AI. From lab prototypes to production-ready humanoids, we monitor hardware specs, software breakthroughs, and deployment milestones."
                icon={<Bot className="w-8 h-8 text-blue-600" />}
            />

            {/* HERO: Featured Video / Breakthrough */}
            {featuredVideo && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-[300px] lg:h-[400px]">
                            <img
                                src={featuredVideo.thumbnail}
                                alt={featuredVideo.title}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <a
                                    href={featuredVideo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer group"
                                >
                                    <Play className="w-6 h-6 text-white fill-white group-hover:text-blue-400 group-hover:fill-blue-400 transition-colors" />
                                </a>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col justify-end relative z-20">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                    Latest Breakthrough
                                </span>
                                <span className="text-slate-400 text-xs font-mono uppercase">
                                    Source: {featuredVideo.source}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                                {featuredVideo.title}
                            </h2>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                New footage detected from {featuredVideo.source}. Analysis suggests significant improvements in actuation and control policies.
                            </p>
                            <a
                                href={featuredVideo.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider text-xs transition-colors"
                            >
                                Watch Analysis <ArrowUpRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Live Feed (News) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveTab('live')}
                                className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'live' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <Activity size={18} />
                                Live Wire
                            </button>
                            <div className="h-4 w-px bg-slate-300" />
                            <button
                                onClick={() => setActiveTab('brief')}
                                className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'brief' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <Zap size={18} />
                                30-Day Brief
                            </button>
                        </div>
                        {activeTab === 'live' && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 min-h-[400px]">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm font-mono animate-pulse">
                                Initializing Neural Link...
                            </div>
                        ) : activeTab === 'live' ? (
                            <>
                                {news.slice(0, visibleItems).map((item, i) => (
                                    <div key={i} className="p-5 hover:bg-slate-50 transition-colors group">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                                                        {item.source}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {new Date(item.pubDate).toLocaleDateString()} • {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                        {item.title}
                                                    </a>
                                                </h4>
                                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                                    {item.snippet}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {visibleItems < news.length && (
                                    <div className="p-4 text-center">
                                        <button
                                            onClick={() => setVisibleItems(prev => prev + 10)}
                                            className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-wider transition-colors"
                                        >
                                            Load More Intelligence
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            // 30-Day Brief View (Filtered by last 30 days, maybe sorted by 'importance' if we had it, for now just date)
                            news.filter(item => {
                                const date = new Date(item.pubDate);
                                const thirtyDaysAgo = new Date();
                                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                return date >= thirtyDaysAgo;
                            }).slice(0, 10).map((item, i) => (
                                <div key={i} className="p-5 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                                            {i + 1 < 10 ? `0${i + 1}` : i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                    {item.title}
                                                </a>
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    {item.source}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(item.pubDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {!loading && activeTab === 'brief' && news.filter(item => {
                            const date = new Date(item.pubDate);
                            const thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                            return date >= thirtyDaysAgo;
                        }).length === 0 && (
                                <div className="p-8 text-center text-slate-400">No briefings available for this period.</div>
                            )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Hardware Specs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu className="text-emerald-600" size={18} />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hardware Database</h3>
                    </div>

                    <div className="space-y-4">
                        {ROBOT_SPECS.map((robot) => (
                            <div key={robot.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row h-auto md:h-40">
                                    <div className="w-full md:w-1/3 h-40 md:h-full relative overflow-hidden">
                                        <img
                                            src={robot.imageUrl}
                                            alt={robot.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
                                    </div>
                                    <div className="w-full md:w-2/3 p-4 flex flex-col justify-between bg-white">
                                        <div>
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 leading-none mb-1 tracking-tight">{robot.name}</h4>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase block leading-tight tracking-wider">{robot.company}</span>
                                                </div>
                                                <span className={`shrink-0 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${robot.status === 'PRODUCTION' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    robot.status === 'PROTOTYPE' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                                    }`}>
                                                    {robot.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                                                <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                                                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Height</span>
                                                    <span className="font-mono text-slate-700 font-bold text-[10px]">{robot.height.split('(')[0]}</span>
                                                </div>
                                                <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                                                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Weight</span>
                                                    <span className="font-mono text-slate-700 font-bold text-[10px]">{robot.weight.split('(')[0]}</span>
                                                </div>
                                                <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-center">
                                                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Compute</span>
                                                    <span className="font-mono text-slate-700 font-bold text-[10px] break-words" title={robot.compute}>
                                                        {robot.compute.split(' ')[0]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={robot.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-wider flex items-center gap-1 mt-auto transition-colors"
                                        >
                                            View Full Specs <ArrowUpRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
