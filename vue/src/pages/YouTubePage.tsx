import React, { useState } from 'react';
import { Play, TrendingUp, Podcast, Music, Gamepad2, Newspaper, GraduationCap, Film } from 'lucide-react';

// YouTube Categories
const YOUTUBE_CATEGORIES = [
    { id: '0', name: 'Trending', icon: TrendingUp },
    { id: '10', name: 'Music', icon: Music },
    { id: '20', name: 'Gaming', icon: Gamepad2 },
    { id: '24', name: 'Entertainment', icon: Film },
    { id: '25', name: 'News', icon: Newspaper },
    { id: '27', name: 'Education', icon: GraduationCap },
    { id: '26', name: 'How-to', icon: GraduationCap },
];

interface YouTubeVideo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnail: string;
    viewCount: string;
    publishedAt: string;
}

// Mock data for YouTube trending (would be replaced with real API)
const MOCK_TRENDING: YouTubeVideo[] = [
    { id: '1', title: 'The Joe Rogan Experience #2100', channelTitle: 'PowerfulJRE', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '5.2M', publishedAt: '2 hours ago' },
    { id: '2', title: 'Lex Fridman Podcast - Sam Altman', channelTitle: 'Lex Fridman', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '3.1M', publishedAt: '1 day ago' },
    { id: '3', title: 'Huberman Lab: Sleep Protocols', channelTitle: 'Andrew Huberman', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '2.8M', publishedAt: '3 days ago' },
];

const MOCK_PODCASTS: YouTubeVideo[] = [
    { id: 'p1', title: 'Call Her Daddy: Weekly Roundup', channelTitle: 'Call Her Daddy', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '1.8M', publishedAt: '4 hours ago' },
    { id: 'p2', title: 'The Daily: Breaking News Analysis', channelTitle: 'The New York Times', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '890K', publishedAt: '6 hours ago' },
    { id: 'p3', title: 'Diary of a CEO - Simon Cowell', channelTitle: 'Steven Bartlett', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '4.2M', publishedAt: '2 days ago' },
    { id: 'p4', title: 'SmartLess: Celebrity Guest Special', channelTitle: 'SmartLess', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '1.2M', publishedAt: '1 day ago' },
    { id: 'p5', title: 'Impaulsive: Logan Paul Returns', channelTitle: 'Impaulsive', thumbnail: 'https://via.placeholder.com/480x360', viewCount: '2.1M', publishedAt: '5 hours ago' },
];

// YouTube Video Card Component
const YouTubeCard: React.FC<{ video: YouTubeVideo }> = ({ video }) => {
    return (
        <a
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-72"
        >
            <div className="relative overflow-hidden rounded-xl bg-white/5 transition-all duration-300 group-hover:scale-105">
                <div className="aspect-video relative">
                    <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-red-900/20 flex items-center justify-center">
                        <Play size={48} className="text-white/50" />
                    </div>

                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                            <Play size={24} fill="white" className="text-white ml-1" />
                        </div>
                    </div>

                    {/* Duration badge (simulated) */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs font-medium text-white">
                        2:34:15
                    </div>
                </div>
            </div>

            <div className="mt-3 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-vue-green transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">{video.channelTitle}</p>
                    <p className="text-xs text-white/40">{video.viewCount} views • {video.publishedAt}</p>
                </div>
            </div>
        </a>
    );
};

// Category Pill Component
const CategoryPill: React.FC<{ category: typeof YOUTUBE_CATEGORIES[0]; active: boolean; onClick: () => void }> = ({ category, active, onClick }) => {
    const Icon = category.icon;
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${active
                ? 'bg-vue-green text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
        >
            <Icon size={16} />
            {category.name}
        </button>
    );
};

export const YouTubePage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('0');
    const [trending] = useState<YouTubeVideo[]>(MOCK_TRENDING);
    const [podcasts] = useState<YouTubeVideo[]>(MOCK_PODCASTS);

    return (
        <main className="min-h-screen bg-vue-black pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                            <Play size={20} fill="white" className="text-white ml-0.5" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">YouTube</h1>
                    </div>
                    <p className="text-white/60">Trending videos and podcasts updated daily</p>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8 -mx-4 px-4">
                    {YOUTUBE_CATEGORIES.map((cat) => (
                        <CategoryPill
                            key={cat.id}
                            category={cat}
                            active={activeCategory === cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                        />
                    ))}
                </div>

                {/* Trending Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-vue-green" size={24} />
                        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                        <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-xs font-bold">LIVE</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                        {trending.map((video) => (
                            <YouTubeCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>

                {/* Podcasts Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Podcast className="text-purple-400" size={24} />
                        <h2 className="text-2xl font-bold text-white">Trending Podcasts</h2>
                        <span className="text-xs text-white/40 font-medium">Updated Daily</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                        {podcasts.map((video) => (
                            <YouTubeCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>

                {/* Categories Grid */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Browse Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {YOUTUBE_CATEGORIES.filter(c => c.id !== '0').map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className="p-6 rounded-2xl glass hover:bg-white/10 transition-all group"
                                >
                                    <Icon size={32} className="text-vue-green mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                                    <p className="text-xs text-white/40 mt-1">Explore trending</p>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default YouTubePage;
