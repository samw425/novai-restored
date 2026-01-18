import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContentCard } from '../components/content/ContentCard';
import { searchContent } from '../lib/api';
import type { ContentItem } from '../lib/api';
import { Search, Loader2 } from 'lucide-react';

export const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const doSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const data = await searchContent(query);
                setResults(data);
            } catch (e) {
                console.error('Search failed:', e);
            } finally {
                setLoading(false);
            }
        };
        doSearch();
    }, [query]);

    return (
        <main className="min-h-screen bg-vue-black pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="py-12 border-b border-white/10 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="text-vue-blue" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            {query ? `Results for "${query}"` : 'Search'}
                        </h1>
                    </div>
                    <p className="text-white/50">
                        {results.length > 0
                            ? `Found ${results.length} results`
                            : query ? 'No results found' : 'Search for movies, TV shows, and more'}
                    </p>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-vue-blue" size={48} />
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {results.map(item => (
                            <ContentCard key={item.id} item={item} size="sm" />
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-lg">No movies or TV shows found for "{query}"</p>
                    </div>
                ) : null}
            </div>
        </main>
    );
};

export default SearchPage;
