import React, { useEffect, useState } from 'react';
import { ContentCard } from '../components/content/ContentCard';
import { getTrending } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { Calendar, Star } from 'lucide-react';

export const WhatToWatchPage: React.FC = () => {
    const [picks, setPicks] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getTrending();
                // Filter for high-rated content
                const topPicks = data.filter(item => item.vote_average >= 7.5).slice(0, 12);
                setPicks(topPicks);
            } catch (e) {
                console.error('Failed to fetch:', e);
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
                        <Calendar className="text-vue-maroon" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">What to Watch Tonight</h1>
                    </div>
                    <p className="text-white/50">Our top picks for tonight—all verified WATCH verdicts</p>
                </div>

                {/* Editor's Picks */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Star className="text-vue-maroon" size={24} />
                        VUE Picks
                    </h2>
                    <p className="text-white/40 mb-6">Highest-rated content you can stream right now</p>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {picks.map(item => (
                                <ContentCard key={item.id} item={item} size="sm" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default WhatToWatchPage;
