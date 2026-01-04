import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Semiconductors',
    description: 'Intelligence on global chip manufacturing, supply chains, and semiconductor innovation.',
    openGraph: {
        title: 'Semiconductors | Novai Intelligence',
        description: 'Intelligence on global chip manufacturing and supply chains.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
