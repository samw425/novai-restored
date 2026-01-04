import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Intelligence Brief',
    description: 'Curated daily analysis of the most critical global events.',
    openGraph: {
        title: 'Intelligence Brief | Novai Intelligence',
        description: 'Curated daily analysis of the most critical global events.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
