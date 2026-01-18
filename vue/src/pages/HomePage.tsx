import React, { useEffect, useState } from 'react';
import { Hero } from '../components/content/Hero';
import { WelcomeHero } from '../components/content/WelcomeHero';
import { ContentRail } from '../components/content/ContentRail';
import {
    getTrending,
    getNowPlaying,
    getPopularTV,
    getTopRated,
    getByPlatform,
    PLATFORMS
} from '../lib/api';
import type { ContentItem } from '../lib/api';

export const HomePage: React.FC = () => {
    const [trending, setTrending] = useState<ContentItem[]>([]);
    const [nowPlaying, setNowPlaying] = useState<ContentItem[]>([]);
    const [popularTV, setPopularTV] = useState<ContentItem[]>([]);
    const [topRated, setTopRated] = useState<ContentItem[]>([]);
    const [netflix, setNetflix] = useState<ContentItem[]>([]);
    const [disney, setDisney] = useState<ContentItem[]>([]);
    const [max, setMax] = useState<ContentItem[]>([]);
    const [prime, setPrime] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [
                    trendingData,
                    nowPlayingData,
                    popularTVData,
                    topRatedData,
                    netflixData,
                    disneyData,
                    maxData,
                    primeData,
                ] = await Promise.all([
                    getTrending(),
                    getNowPlaying(),
                    getPopularTV(),
                    getTopRated(),
                    getByPlatform('netflix', 'movie'),
                    getByPlatform('disney', 'movie'),
                    getByPlatform('max', 'tv'),
                    getByPlatform('prime', 'movie'),
                ]);

                setTrending(trendingData);
                setNowPlaying(nowPlayingData);
                setPopularTV(popularTVData);
                setTopRated(topRatedData);
                setNetflix(netflixData);
                setDisney(disneyData);
                setMax(maxData);
                setPrime(primeData);
            } catch (e) {
                console.error('Failed to fetch homepage data:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return (
        <main className="min-h-screen bg-vue-black">
            {/* Welcome Section - Explains What VUE Does */}
            <WelcomeHero />

            {/* Featured Content Hero */}
            <Hero items={trending} />

            {/* Content Rails */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <ContentRail
                    title="🔥 Trending Today"
                    subtitle="What everyone's talking about right now"
                    items={trending}
                    linkTo="/trending"
                    isLoading={loading}
                />

                <ContentRail
                    title="🎬 In Theaters Now"
                    subtitle="Currently playing at a theater near you"
                    items={nowPlaying}
                    linkTo="/movies/now-playing"
                    isLoading={loading}
                />

                <ContentRail
                    title="📺 Popular TV Shows"
                    subtitle="The most-watched series this week"
                    items={popularTV}
                    linkTo="/tv"
                    isLoading={loading}
                />

                {/* Platform sections */}
                <div className="py-8 border-t border-white/10 mt-8">
                    <h2 className="text-3xl font-black text-white mb-2">By Platform</h2>
                    <p className="text-white/50 mb-8">What's hot on your favorite streaming services</p>
                </div>

                <ContentRail
                    title={`${PLATFORMS.netflix.name}`}
                    subtitle="Top movies streaming on Netflix"
                    items={netflix}
                    linkTo="/platform/netflix"
                    isLoading={loading}
                />

                <ContentRail
                    title={`${PLATFORMS.disney.name}`}
                    subtitle="Disney, Marvel, Star Wars and more"
                    items={disney}
                    linkTo="/platform/disney"
                    isLoading={loading}
                />

                <ContentRail
                    title={`${PLATFORMS.max.name}`}
                    subtitle="HBO originals and premium content"
                    items={max}
                    linkTo="/platform/max"
                    isLoading={loading}
                />

                <ContentRail
                    title={`${PLATFORMS.prime.name}`}
                    subtitle="Included with Prime membership"
                    items={prime}
                    linkTo="/platform/prime"
                    isLoading={loading}
                />

                <ContentRail
                    title="⭐ All-Time Greats"
                    subtitle="Highest rated movies of all time"
                    items={topRated}
                    linkTo="/movies/top-rated"
                    isLoading={loading}
                />
            </div>
        </main>
    );
};

export default HomePage;
