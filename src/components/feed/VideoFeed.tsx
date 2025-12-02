'use client';

import React from 'react';
import { VideoItem } from '@/lib/data/video-feed';
import { Play, Clock, Eye, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VideoFeedProps {
    videos: VideoItem[];
}

export function VideoFeed({ videos }: VideoFeedProps) {
    return (
        <div className="space-y-4">
            {videos.map((video) => (
                <a
                    key={video.id}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col sm:flex-row"
                >
                    {/* Thumbnail Container - Horizontal on Desktop */}
                    <div className="relative w-full sm:w-72 aspect-video sm:aspect-auto bg-slate-100 overflow-hidden shrink-0">
                        {/* Placeholder for actual image if load fails, or use the URL directly */}
                        <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                // Fallback if image fails
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Video+Thumbnail';
                            }}
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                                <Play className="w-5 h-5 text-blue-600 ml-1" fill="currentColor" />
                            </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-bold text-white flex items-center gap-1">
                            <Clock size={10} />
                            {video.duration}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${video.category === 'Interview' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                video.category === 'Demo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                {video.category}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDistanceToNow(video.timestamp, { addSuffix: true })}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                            {video.title}
                        </h3>

                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                            {video.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                {video.source}
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-slate-400 font-normal flex items-center gap-1">
                                    <Eye size={10} />
                                    {video.views}
                                </span>
                            </span>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}
