import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Biotech Intelligence',
    description: 'Curated intelligence from the frontier of synthetic biology, genomics, and life sciences.',
    openGraph: {
        title: 'Biotech Intelligence | Novai Intelligence',
        description: 'Curated intelligence from the frontier of synthetic biology and genomics.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
