'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Bot, Cpu, Play, ExternalLink, Battery, Activity, Zap } from 'lucide-react';
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
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider text-xs transition-colors"
                            >
                                Watch Analysis <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Live Feed (News) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-blue-600" size={18} />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Wire</h3>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm font-mono animate-pulse">
                                Initializing Neural Link...
                            </div>
                        ) : news.length > 0 ? (
                            news.slice(0, 10).map((item, i) => (
                                <div key={i} className="p-5 hover:bg-slate-50 transition-colors group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                                                    {item.source}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(item.pubDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                    {item.title}
                                                </a>
                                            </h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                                {item.snippet}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">No recent updates found.</div>
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
                            <div key={robot.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="flex">
                                    <div className="w-1/3 bg-slate-100 relative">
                                        <img
                                            src={robot.imageUrl}
                                            alt={robot.name}
                                            className="w-full h-full object-cover absolute inset-0 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                    <div className="w-2/3 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 leading-none">{robot.name}</h4>
                                                <span className="text-xs font-bold text-slate-500 uppercase">{robot.company}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${robot.status === 'PRODUCTION' ? 'bg-emerald-100 text-emerald-700' :
                                                    robot.status === 'PROTOTYPE' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {robot.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-3">
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Height</span>
                                                <span className="font-mono text-slate-700">{robot.height}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight</span>
                                                <span className="font-mono text-slate-700">{robot.weight}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Compute</span>
                                                <span className="font-mono text-slate-700 truncate">{robot.compute}</span>
                                            </div>
                                        </div>

                                        <a
                                            href={robot.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1"
                                        >
                                            View Specs <ExternalLink size={10} />
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
