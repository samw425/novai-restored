import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Earnings Hub',
    description: 'Comprehensive corporate earnings calendar, live data, and financial analysis.',
    openGraph: {
        title: 'Earnings Hub | Novai Intelligence',
        description: 'Comprehensive corporate earnings calendar and analysis.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
