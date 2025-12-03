'use client';

import { useState, useEffect } from 'react';
import { VideoItem } from '@/lib/data/video-feed';
import { Play, Clock, Eye, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoFeedContainerProps {
    liveVideos: VideoItem[]; // Initial static data (fallback)
    briefVideos: VideoItem[];
}

export function VideoFeedContainer({ liveVideos: initialLiveVideos, briefVideos }: VideoFeedContainerProps) {
    const [activeTab, setActiveTab] = useState<'live' | 'brief'>('live');
    const [videos, setVideos] = useState<VideoItem[]>(initialLiveVideos);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/feed/videos');
            if (res.ok) {
                const data = await res.json();
                setVideos(data.videos);
            }
        } catch (error) {
            console.error('Failed to fetch videos:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVideos();
        // Poll every 5 minutes for new content
        const interval = setInterval(fetchVideos, 300000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchVideos();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Feed Column */}
            <div className="lg:col-span-8 space-y-6">
                {/* Tabs */}
                <div className="flex items-center justify-between">
                    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'live'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            Live Wire
                        </button>
                        <button
                            onClick={() => setActiveTab('brief')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'brief'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            30-Day Brief
                        </button>
                    </div>

                    {activeTab === 'live' && (
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                            title="Refresh Feed"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Feed Content */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {activeTab === 'live' ? (
                            loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
                                </div>
                            ) : (
                                videos.map((video) => (
                                    <VideoCard key={video.id} video={video} />
                                ))
                            )
                        ) : (
                            briefVideos.map((video) => (
                                <VideoCard key={video.id} video={video} isBrief />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Rail (Stats/Info) - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-xl p-6 text-white">
                    <h3 className="font-serif text-xl font-bold mb-4">Intelligence Brief</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Curated high-signal video intelligence from the world's leading AI labs.
                        Updated in real-time.
                    </p>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Sources Monitored</span>
                            <span className="font-mono text-blue-400">12</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Avg. Signal Score</span>
                            <span className="font-mono text-green-400">94/100</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Update Frequency</span>
                            <span className="font-mono text-purple-400">Real-time</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VideoCard({ video, isBrief }: { video: VideoItem; isBrief?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all"
        >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 aspect-video sm:aspect-auto rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            // Fallback for broken thumbnails
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Thumbnail';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                        {video.duration}
                    </div>
                    <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-4 h-4 text-slate-900 ml-0.5" fill="currentColor" />
                        </div>
                    </a>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${video.category === 'Launch' ? 'bg-purple-100 text-purple-700' :
                                video.category === 'Demo' ? 'bg-blue-100 text-blue-700' :
                                    video.category === 'Safety' ? 'bg-red-100 text-red-700' :
                                        'bg-slate-100 text-slate-600'
                            }`}>
                            {video.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.publishedAt}
                        </span>
                    </div>

                    <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                            {video.title}
                        </a>
                    </h3>

                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                        {video.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-700">
                                {video.source}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {video.views}
                            </span>
                        </div>

                        {isBrief && (
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                AI Score: {video.aiScore}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
