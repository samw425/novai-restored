import React, { useEffect, useState } from 'react';
import { ContentCard } from '../components/content/ContentCard';
import { getPopularTV, getTrending } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { Heart } from 'lucide-react';

export const AudienceFavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [trending, tv] = await Promise.all([
                    getTrending(),
                    getPopularTV(),
                ]);
                // Sort by vote_count (most votes = audience favorites)
                const combined = [...trending, ...tv];
                const sorted = combined.sort((a, b) => b.vote_count - a.vote_count);
                const unique = sorted.filter((item, index, self) =>
                    index === self.findIndex(i => i.id === item.id)
                );
                setFavorites(unique.slice(0, 24));
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
                        <Heart className="text-vue-maroon" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">Audience Favorites</h1>
                    </div>
                    <p className="text-white/50">Most-voted content by real viewers</p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {favorites.map(item => (
                            <ContentCard key={item.id} item={item} size="sm" />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AudienceFavoritesPage;
