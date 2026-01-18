import React, { useEffect, useState } from 'react';
import { ContentRail } from '../components/content/ContentRail';
import { getTrending, getNowPlaying, getPopularTV } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { TrendingUp } from 'lucide-react';

export const TrendingPage: React.FC = () => {
    const [trending, setTrending] = useState<ContentItem[]>([]);
    const [movies, setMovies] = useState<ContentItem[]>([]);
    const [tv, setTv] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [trendingData, moviesData, tvData] = await Promise.all([
                    getTrending(),
                    getNowPlaying(),
                    getPopularTV(),
                ]);
                setTrending(trendingData);
                setMovies(moviesData.filter(m => m.vote_average >= 7));
                setTv(tvData.filter(t => t.vote_average >= 7));
            } catch (e) {
                console.error('Failed to fetch trending:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-vue-black pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="py-12 border-b border-white/10 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="text-vue-maroon" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">Trending Now</h1>
                    </div>
                    <p className="text-white/50">What everyone's watching right now, updated hourly</p>
                </div>

                {/* Content */}
                <ContentRail
                    title="🔥 Trending Today"
                    subtitle="The most talked about content right now"
                    items={trending}
                    isLoading={loading}
                />

                <ContentRail
                    title="🎬 Hot Movies"
                    subtitle="Top-rated movies getting buzz"
                    items={movies}
                    isLoading={loading}
                />

                <ContentRail
                    title="📺 Hot TV Shows"
                    subtitle="Series everyone's binging"
                    items={tv}
                    isLoading={loading}
                />
            </div>
        </main>
    );
};

export default TrendingPage;
