'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function FeedArchivePage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
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
                .order('published_at', { ascending: false })
                .limit(100);

            if (error) console.error(error);
            else setNews(data || []);

            setLoading(false);
        }
        fetchFeed();
    }, []);

    return (
        <div>
            <h1>Feed Archive</h1>
            {loading && <p>Loading...</p>}
            {!loading && news.map(item => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                </div>
            ))}
        </div>
    );
}
