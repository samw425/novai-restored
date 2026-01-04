import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Global Census',
    description: 'Real-time global vital statistics, demographics, and population trends.',
    openGraph: {
        title: 'Global Census | Novai Intelligence',
        description: 'Real-time global vital statistics and population trends.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
