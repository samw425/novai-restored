import React, { useEffect, useState } from 'react';
import { ContentCard } from '../components/content/ContentCard';
import { getNowPlaying, getTopRated } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { Film, Filter } from 'lucide-react';

type FilterType = 'all' | 'now_playing' | 'top_rated';

export const MoviesPage: React.FC = () => {
    const [movies, setMovies] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [nowPlaying, topRated] = await Promise.all([
                    getNowPlaying(),
                    getTopRated(),
                ]);

                if (filter === 'now_playing') {
                    setMovies(nowPlaying);
                } else if (filter === 'top_rated') {
                    setMovies(topRated);
                } else {
                    // Combine and dedupe
                    const combined = [...nowPlaying, ...topRated];
                    const unique = combined.filter((movie, index, self) =>
                        index === self.findIndex(m => m.id === movie.id)
                    );
                    setMovies(unique);
                }
            } catch (e) {
                console.error('Failed to fetch movies:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filter]);

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All Movies' },
        { key: 'now_playing', label: 'In Theaters' },
        { key: 'top_rated', label: 'Top Rated' },
    ];

    return (
        <main className="min-h-screen bg-vue-black pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="py-12 border-b border-white/10 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Film className="text-vue-blue" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">Movies</h1>
                    </div>
                    <p className="text-white/50">Discover what to watch with VUE verdicts</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-8">
                    <Filter size={18} className="text-white/40" />
                    <div className="flex gap-2">
                        {filters.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f.key
                                    ? 'bg-vue-blue text-black'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
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
                        {movies.map(movie => (
                            <ContentCard key={movie.id} item={movie} size="sm" />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MoviesPage;
