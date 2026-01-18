import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContentRail } from '../components/content/ContentRail';
import { getByPlatform, PLATFORMS } from '../lib/api';
import type { ContentItem, PlatformKey } from '../lib/api';
import { Tv, Play } from 'lucide-react';

export const PlatformPage: React.FC = () => {
    const { platform } = useParams<{ platform: string }>();
    const [movies, setMovies] = useState<ContentItem[]>([]);
    const [tvShows, setTvShows] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    const platformKey = platform as PlatformKey;
    const platformInfo = PLATFORMS[platformKey] || { name: platform, color: '#00D4FF' };

    useEffect(() => {
        const fetchData = async () => {
            if (!platformKey || !PLATFORMS[platformKey]) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const [moviesData, tvData] = await Promise.all([
                    getByPlatform(platformKey, 'movie'),
                    getByPlatform(platformKey, 'tv'),
                ]);
                setMovies(moviesData);
                setTvShows(tvData);
            } catch (e) {
                console.error('Failed to fetch platform data:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [platformKey]);

    return (
        <main className="min-h-screen bg-vue-black pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Platform Header */}
                <div className="py-12 border-b border-white/10 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                            style={{ backgroundColor: platformInfo.color }}
                        >
                            {platformInfo.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                {platformInfo.name}
                            </h1>
                            <p className="text-white/50">What's streaming now</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2 text-white/60">
                            <Play size={16} className="text-vue-blue" />
                            <span className="text-sm">{movies.length} Movies</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <Tv size={16} className="text-vue-blue" />
                            <span className="text-sm">{tvShows.length} TV Shows</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <ContentRail
                    title="🎬 Popular Movies"
                    subtitle={`Top movies streaming on ${platformInfo.name}`}
                    items={movies}
                    isLoading={loading}
                />

                <ContentRail
                    title="📺 Popular TV Shows"
                    subtitle={`Binge-worthy series on ${platformInfo.name}`}
                    items={tvShows}
                    isLoading={loading}
                />
            </div>
        </main>
    );
};

export default PlatformPage;
