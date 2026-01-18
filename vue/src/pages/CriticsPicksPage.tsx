import React, { useEffect, useState } from 'react';
import { ContentCard } from '../components/content/ContentCard';
import { getTopRated } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { Award } from 'lucide-react';

export const CriticsPicksPage: React.FC = () => {
    const [picks, setPicks] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getTopRated();
                // Top rated = critics' picks
                setPicks(data.slice(0, 20));
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
                        <Award className="text-vue-maroon" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">Critics' Picks</h1>
                    </div>
                    <p className="text-white/50">Highest rated by professional critics and reviewers</p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {picks.map(item => (
                            <ContentCard key={item.id} item={item} size="sm" />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default CriticsPicksPage;
