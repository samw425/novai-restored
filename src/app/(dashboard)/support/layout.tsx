import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support Signal',
    description: 'Help keep the signal pure. Support Novai Intelligence.',
    openGraph: {
        title: 'Support Signal | Novai Intelligence',
        description: 'Help keep the signal pure. Support Novai Intelligence.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
