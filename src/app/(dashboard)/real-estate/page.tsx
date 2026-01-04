'use client';

import { Building2, Home, Building, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { useInView } from 'react-intersection-observer';
import { Article } from '@/types';

// Real Estate RSS Feeds - Residential (30+ Sources)
const RESIDENTIAL_FEEDS = [
    // Tier 1: General Markets & Economy
    'https://news.google.com/rss/search?q=residential+real+estate+housing+market+site:reuters.com+OR+site:wsj.com+OR+site:bloomberg.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=home+prices+housing+inventory+site:cnbc.com+OR+site:marketwatch.com+OR+site:ft.com&hl=en-US&gl=US&ceid=US:en',

    // Tier 2: Industry Specialized
    'https://news.google.com/rss/search?q=housing+market+single+family+homes+site:realtor.com+OR+site:zillow.com+OR+site:redfin.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=mortgage+rates+housing+finance+site:housingwire.com+OR+site:mortgagenewsdaily.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=real+estate+news+site:inman.com+OR+site:themrealdeal.com+OR+site:rismedia.com&hl=en-US&gl=US&ceid=US:en',

    // Tier 3: Construction & Policy
    'https://news.google.com/rss/search?q=residential+construction+homebuilders+site:builderonline.com+OR+site:nahb.org+OR+site:housingwire.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=housing+policy+legislation+site:nar.realtor+OR+site:hud.gov&hl=en-US&gl=US&ceid=US:en',

    // Tier 4: Global Residential
    'https://news.google.com/rss/search?q=global+housing+market+property+prices+site:theguardian.com+OR+site:bbc.com+OR+site:scmp.com&hl=en-US&gl=US&ceid=US:en',
];

// Real Estate RSS Feeds - Commercial (30+ Sources)
const COMMERCIAL_FEEDS = [
    // Tier 1: Major Institutional
    'https://news.google.com/rss/search?q=commercial+real+estate+CRE+site:wsj.com+OR+site:bloomberg.com+OR+site:reuters.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=commercial+property+investment+site:pwc.com+OR+site:deloitte.com+OR+site:jll.com&hl=en-US&gl=US&ceid=US:en',

    // Tier 2: Specialized CRE News
    'https://news.google.com/rss/search?q=office+buildings+retail+property+site:commercialobserver.com+OR+site:globest.com+OR:site:bisnow.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=industrial+warehouse+logistics+site:costar.com+OR+site:prologis.com&hl=en-US&gl=US&ceid=US:en',

    // Tier 3: REITs & Finance
    'https://news.google.com/rss/search?q=REIT+real+estate+investment+trust+site:nareit.com+OR+site:seekingalpha.com+OR:site:investors.com&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=multifamily+housing+apartments+site:multihousingnews.com+OR+site:crenews.com&hl=en-US&gl=US&ceid=US:en',

    // Tier 4: Global Commercial
    'https://news.google.com/rss/search?q=global+commercial+real+estate+site:mingtiandi.com+OR+site:estatesgazette.com+OR:site:propertyweek.com&hl=en-US&gl=US&ceid=US:en',
];

export default function RealEstatePage() {
    const [activeTab, setActiveTab] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL');
    const [residentialArticles, setResidentialArticles] = useState<Article[]>([]);
    const [commercialArticles, setCommercialArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [residentialPage, setResidentialPage] = useState(1);
    const [commercialPage, setCommercialPage] = useState(1);

    const { ref: residentialRef, inView: residentialInView } = useInView({ threshold: 0.1 });
    const { ref: commercialRef, inView: commercialInView } = useInView({ threshold: 0.1 });

    const fetchArticles = useCallback(async (feeds: string[], isResidential: boolean, page: number) => {
        try {
            const response = await fetch('/api/rss/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: feeds, limit: 20, offset: (page - 1) * 20 })
            });
            const data = await response.json();
            if (data.articles) {
                if (isResidential) {
                    setResidentialArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
                } else {
                    setCommercialArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
                }
            }
        } catch (e) {
            console.error('Failed to fetch articles:', e);
        }
    }, []);

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await Promise.all([
                fetchArticles(RESIDENTIAL_FEEDS, true, 1),
                fetchArticles(COMMERCIAL_FEEDS, false, 1)
            ]);
            setLoading(false);
        };
        loadInitial();
    }, [fetchArticles]);

    // Infinite scroll for residential
    useEffect(() => {
        if (residentialInView && !loadingMore && residentialArticles.length > 0) {
            setLoadingMore(true);
            const nextPage = residentialPage + 1;
            setResidentialPage(nextPage);
            fetchArticles(RESIDENTIAL_FEEDS, true, nextPage).finally(() => setLoadingMore(false));
        }
    }, [residentialInView]);

    // Infinite scroll for commercial
    useEffect(() => {
        if (commercialInView && !loadingMore && commercialArticles.length > 0) {
            setLoadingMore(true);
            const nextPage = commercialPage + 1;
            setCommercialPage(nextPage);
            fetchArticles(COMMERCIAL_FEEDS, false, nextPage).finally(() => setLoadingMore(false));
        }
    }, [commercialInView]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Real Estate Intelligence"
                description="Comprehensive coverage of residential and commercial real estate markets. Track housing trends, mortgage rates, commercial property deals, and REIT performance."
                insight="Real estate remains a fundamental driver of wealth and economic activity. Understanding market dynamics across residential and commercial sectors provides critical insight into broader economic health and investment opportunities."
                icon={<Building2 className="w-8 h-8 text-emerald-500" />}
            />

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('RESIDENTIAL')}
                    className={`px-6 py-3 font-mono text-xs md:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'RESIDENTIAL'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Home size={16} />
                    RESIDENTIAL
                </button>
                <button
                    onClick={() => setActiveTab('COMMERCIAL')}
                    className={`px-6 py-3 font-mono text-xs md:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'COMMERCIAL'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Building size={16} />
                    COMMERCIAL
                </button>
            </div>

            {/* Residential Tab */}
            {activeTab === 'RESIDENTIAL' && (
                <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-bold text-emerald-800 mb-1">Residential Market Coverage</h3>
                        <p className="text-xs text-emerald-700">Housing prices, mortgage rates, home sales, inventory levels, and single-family housing trends from leading real estate sources.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {residentialArticles.map((article) => (
                            <FeedCard key={article.id} article={article} />
                        ))}
                    </div>
                    <div ref={residentialRef} className="py-8 flex justify-center">
                        {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />}
                    </div>
                </div>
            )}

            {/* Commercial Tab */}
            {activeTab === 'COMMERCIAL' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-bold text-blue-800 mb-1">Commercial Real Estate Coverage</h3>
                        <p className="text-xs text-blue-700">Office, retail, industrial, multifamily, and REIT performance. Deals, developments, and market analysis from top CRE sources.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {commercialArticles.map((article) => (
                            <FeedCard key={article.id} article={article} />
                        ))}
                    </div>
                    <div ref={commercialRef} className="py-8 flex justify-center">
                        {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
                    </div>
                </div>
            )}
        </div>
    );
}
