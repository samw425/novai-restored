import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Space Intelligence',
    description: 'Curated intelligence on space exploration, satellite technology, and the lunar economy.',
    openGraph: {
        title: 'Space Intelligence | Novai Intelligence',
        description: 'Curated intelligence on space exploration and satellite technology.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
