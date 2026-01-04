import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How It Works',
    description: 'Protocol for gaining an information advantage with Novai Intelligence.',
    openGraph: {
        title: 'How It Works | Novai Intelligence',
        description: 'Protocol for gaining an information advantage with Novai Intelligence.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
