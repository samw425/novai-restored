import React, { useEffect, useState } from 'react';
import { ContentCard } from '../components/content/ContentCard';
import { getPopularTV } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { Tv } from 'lucide-react';

export const TVPage: React.FC = () => {
    const [shows, setShows] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getPopularTV();
                setShows(data);
            } catch (e) {
                console.error('Failed to fetch TV shows:', e);
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
                        <Tv className="text-vue-blue" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">TV Shows</h1>
                    </div>
                    <p className="text-white/50">Find your next binge with VUE verdicts</p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {shows.map(show => (
                            <ContentCard key={show.id} item={show} size="sm" />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default TVPage;
