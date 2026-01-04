import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Alpha Stream',
    description: 'Curated AI demos, tech breakthroughs, and visual intelligence feeds.',
    openGraph: {
        title: 'Alpha Stream | Novai Intelligence',
        description: 'Curated AI demos and visual intelligence feeds.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
