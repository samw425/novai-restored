import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Trend Watch',
    description: 'Scanning the horizon for emerging trends and cultural shifts.',
    openGraph: {
        title: 'Trend Watch | Novai Intelligence',
        description: 'Scanning the horizon for emerging trends and cultural shifts.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
