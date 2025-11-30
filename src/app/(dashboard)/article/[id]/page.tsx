'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, ExternalLink, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

export default function ArticleDetailPage() {
    const params = useParams();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArticle() {
            setLoading(true);

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                setLoading(false);
                return;
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) console.error('Error fetching article:', error);
            else setArticle(data);

            setLoading(false);
        }
        fetchArticle();
    }, [params.id]);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="h-8 w-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Loading Article...</span>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="py-20 text-center bg-white rounded-xl border border-[#E5E7EB]">
                <p className="font-bold text-[#14171F] mb-2">Article Not Found</p>
                <Link href="/global-feed" className="text-sm font-bold text-blue-600 hover:underline">
                    Return to Global Feed →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* BACK BUTTON */}
            <Link href="/global-feed" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#14171F] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
            </Link>

            {/* ARTICLE HEADER */}
            <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wide">
                        {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(article.timestamp).toLocaleDateString()}
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#14171F] mb-6 leading-tight">
                    {article.title}
                </h1>

                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600">
                            {article.source.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{article.source}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-xs font-bold text-gray-400 uppercase">
                            Impact: {article.impact_score}/100
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase">
                            Credibility: {article.credibility_score}/100
                        </div>
                    </div>
                </div>
            </div>

            {/* ARTICLE BODY */}
            <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                    AI-Generated Summary
                </h2>
                <p className="text-base text-gray-700 leading-relaxed mb-8">
                    {article.summary}
                </p>

                {article.impact && (
                    <>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-4">
                            Why This Matters
                        </h2>
                        <p className="text-base text-gray-700 leading-relaxed mb-8 italic">
                            "{article.impact}"
                        </p>
                    </>
                )}

                <a
                    href={article.source_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#14171F] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all"
                >
                    Read Original Source
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}
