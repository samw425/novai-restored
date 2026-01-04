import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Market Pulse',
    description: 'Live global market data, economic indicators, and real-time financial signals.',
    openGraph: {
        title: 'Market Pulse | Novai Intelligence',
        description: 'Live global market data and real-time financial signals.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
