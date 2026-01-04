import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Signal Tools',
    description: 'Next-gen AI utilities and intelligence analysis tools.',
    openGraph: {
        title: 'Signal Tools | Novai Intelligence',
        description: 'Next-gen AI utilities and intelligence analysis tools.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
