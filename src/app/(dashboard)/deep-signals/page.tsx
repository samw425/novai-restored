'use client';

import { useState, useEffect, useMemo } from 'react';
import { Radio, TrendingUp, AlertCircle, CheckCircle2, Loader2, Globe, Sparkles } from 'lucide-react';
import { Article } from '@/types';

export default function DeepSignalsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [patterns, setPatterns] = useState<{
        emerging: { topic: string, strength: number, articles: Article[] }[],
        consensus: { topic: string, sources: number, sentiment: 'positive' | 'negative' | 'mixed' }[],
        contradictions: { topic: string, conflicting: Article[] }[]
    }>({ emerging: [], consensus: [], contradictions: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from research and AI categories for pattern analysis
                const [researchRes, aiRes] = await Promise.all([
                    fetch('/api/feed/live?category=research&limit=30'),
                    fetch('/api/feed/live?category=ai&limit=30')
                ]);

                const researchData = await researchRes.json();
                const aiData = await aiRes.json();

                const allArticles = [...(researchData.articles || []), ...(aiData.articles || [])];
                const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.id, item])).values());

                setArticles(uniqueArticles);
                analyzePatterns(uniqueArticles);
            } catch (error) {
                console.error('Failed to fetch signal data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const analyzePatterns = (data: Article[]) => {
        if (data.length === 0) return;

        // 1. EMERGING TOPICS: Extract frequent multi-word phrases
        const phrases: Record<string, { count: number, articles: Article[] }> = {};

        data.forEach(article => {
            const words = article.title.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/);

            // Extract 2-3 word phrases
            for (let i = 0; i < words.length - 1; i++) {
                const bigram = `${words[i]} ${words[i + 1]}`;
                const trigram = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}` : null;

                // Skip common phrases
                const stopPhrases = ['the new', 'how to', 'what is', 'in the', 'of the', 'to the'];
                if (!stopPhrases.includes(bigram)) {
                    if (!phrases[bigram]) phrases[bigram] = { count: 0, articles: [] };
                    phrases[bigram].count++;
                    phrases[bigram].articles.push(article);
                }

                if (trigram && !stopPhrases.some(s => trigram.includes(s))) {
                    if (!phrases[trigram]) phrases[trigram] = { count: 0, articles: [] };
                    phrases[trigram].count++;
                    phrases[trigram].articles.push(article);
                }
            }
        });

        const emergingTopics = Object.entries(phrases)
            .filter(([_, data]) => data.count >= 3) // At least 3 mentions
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([topic, data]) => ({
                topic: topic.charAt(0).toUpperCase() + topic.slice(1),
                strength: Math.min(100, data.count * 10),
                articles: data.articles.slice(0, 3)
            }));

        // 2. CONSENSUS TOPICS: Topics covered by multiple sources
        const topicSources: Record<string, Set<string>> = {};
        const topicSentiment: Record<string, { positive: number, negative: number }> = {};

        emergingTopics.forEach(({ topic, articles: topicArticles }) => {
            topicSources[topic] = new Set(topicArticles.map(a => a.source));

            const positiveWords = ['breakthrough', 'success', 'advance', 'improve', 'efficient', 'powerful'];
            const negativeWords = ['concern', 'risk', 'warn', 'threat', 'danger', 'limit'];

            topicArticles.forEach(a => {
                const text = a.title.toLowerCase();
                if (!topicSentiment[topic]) topicSentiment[topic] = { positive: 0, negative: 0 };

                if (positiveWords.some(w => text.includes(w))) topicSentiment[topic].positive++;
                if (negativeWords.some(w => text.includes(w))) topicSentiment[topic].negative++;
            });
        });

        const consensusTopics = Object.entries(topicSources)
            .filter(([_, sources]) => sources.size >= 2) // Multiple sources
            .map(([topic, sources]) => {
                const sent = topicSentiment[topic];
                let sentiment: 'positive' | 'negative' | 'mixed' = 'mixed';
                if (sent.positive > sent.negative * 2) sentiment = 'positive';
                else if (sent.negative > sent.positive * 2) sentiment = 'negative';

                return { topic, sources: sources.size, sentiment };
            })
            .slice(0, 4);

        // 3. CONTRADICTIONS: Same topic with different sentiment
        const contradictions = emergingTopics
            .filter(({ topic }) => {
                const sent = topicSentiment[topic];
                return sent && sent.positive > 0 && sent.negative > 0;
            })
            .slice(0, 3)
            .map(({ topic, articles: topicArticles }) => ({
                topic,
                conflicting: topicArticles.slice(0, 2)
            }));

        setPatterns({ emerging: emergingTopics, consensus: consensusTopics, contradictions });
    };

    return (
        <div className="space-y-8 min-h-screen bg-gray-950 text-gray-100 p-6 lg:p-8 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <div className="border-b border-indigo-900/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Radio className="h-8 w-8 text-indigo-500" />
                        DEEP SIGNALS
                    </h1>
                    <p className="text-indigo-400/60 mt-2 text-sm font-mono uppercase tracking-widest">
                        Cross-Source Analysis // Pattern Detection // Conflict Zones
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-950/30 border border-indigo-900/50 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-bold text-indigo-200 tracking-wider">SCANNING FREQUENCIES</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-24">
                    <Loader2 className="animate-spin text-indigo-500 h-12 w-12" />
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Emerging Topics (Signal Matrix) */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-indigo-900/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600/50"></div>
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Emerging Signal Matrix</h2>
                        </div>

                        {patterns.emerging.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {patterns.emerging.map((topic, i) => (
                                    <div key={i} className="bg-gray-900/80 border border-gray-800 p-4 rounded-lg hover:border-indigo-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">{topic.topic}</h3>
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${topic.strength}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-mono text-indigo-400">{topic.strength}%</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-2">
                                            {topic.articles.map((article, j) => (
                                                <a
                                                    key={j}
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block hover:text-indigo-400 transition-colors truncate"
                                                >
                                                    • {article.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8 font-mono text-sm">No strong signals detected in current timeframe.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Consensus Analysis */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600/50"></div>
                            <div className="flex items-center gap-2 mb-6">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Cross-Source Verification</h2>
                            </div>

                            {patterns.consensus.length > 0 ? (
                                <div className="space-y-3">
                                    {patterns.consensus.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-gray-900/80 border border-gray-800 rounded-lg hover:border-emerald-500/30 transition-all">
                                            <div>
                                                <div className="font-bold text-gray-200 text-sm mb-1">{item.topic}</div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    VERIFIED BY {item.sources} SOURCES
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded border ${item.sentiment === 'positive' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' :
                                                    item.sentiment === 'negative' ? 'bg-red-950/30 text-red-400 border-red-900/50' :
                                                        'bg-gray-800 text-gray-400 border-gray-700'
                                                }`}>
                                                {item.sentiment.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center py-8 font-mono text-sm">No consensus detected.</p>
                            )}
                        </div>

                        {/* Contradictions */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50"></div>
                            <div className="flex items-center gap-2 mb-6">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Conflict Zones / Contradictions</h2>
                            </div>

                            {patterns.contradictions.length > 0 ? (
                                <div className="space-y-4">
                                    {patterns.contradictions.map((item, i) => (
                                        <div key={i} className="border-l-2 border-red-500/50 pl-4 py-1">
                                            <h3 className="font-bold text-gray-200 text-sm mb-2">{item.topic}</h3>
                                            <div className="text-xs text-gray-500 space-y-2">
                                                {item.conflicting.map((article, j) => (
                                                    <a
                                                        key={j}
                                                        href={article.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block hover:text-red-400 transition-colors"
                                                    >
                                                        <span className="text-red-500/50 mr-2">⚠</span>
                                                        {article.source}: {article.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center py-8 font-mono text-sm">No contradictions detected.</p>
                            )}
                        </div>
                    </div>

                    {/* Source Articles */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Raw Signal Feed</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {articles.slice(0, 6).map((article, i) => (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg hover:border-indigo-500/30 hover:bg-gray-900/80 transition-all group"
                                >
                                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-2">{article.category}</span>
                                    <h3 className="text-sm font-medium text-gray-300 group-hover:text-white line-clamp-2 mb-3 leading-relaxed">
                                        {article.title}
                                    </h3>
                                    <span className="text-[10px] font-mono text-gray-600 group-hover:text-indigo-400 transition-colors">{article.source}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
