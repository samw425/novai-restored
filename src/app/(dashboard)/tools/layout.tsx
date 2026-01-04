import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Signal Tools',
    description: 'Next-gen tools and utilities for AI intelligence analysis.',
    openGraph: {
        title: 'AI Signal Tools | Novai Intelligence',
        description: 'Next-gen tools and utilities for AI intelligence analysis.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
