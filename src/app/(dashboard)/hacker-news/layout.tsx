import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hacker News Pulse',
    description: 'Real-time feed of the most important stories from the global developer community.',
    openGraph: {
        title: 'Hacker News Pulse | Novai Intelligence',
        description: 'Real-time feed of important developer community stories.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
