'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the heavy FeedContainer with SSR disabled
const FeedContainer = dynamic(
    () => import('./FeedContainer').then((mod) => mod.FeedContainer),
    {
        ssr: false,
        loading: () => <div className="min-h-screen animate-pulse bg-gray-50/50" />,
    }
);

interface FeedContainerClientProps {
    initialCategory?: string;
    forcedCategory?: string;
    showTicker?: boolean;
}

export function FeedContainerClient(props: FeedContainerClientProps) {
    return <FeedContainer {...props} />;
}
