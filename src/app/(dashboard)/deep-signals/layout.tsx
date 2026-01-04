import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Deep Signals',
    description: 'High-signal analysis of emerging trends and hidden market patterns.',
    openGraph: {
        title: 'Deep Signals | Novai Intelligence',
        description: 'High-signal analysis of emerging trends and hidden market patterns.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
