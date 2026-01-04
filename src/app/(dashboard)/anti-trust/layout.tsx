import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Anti-Trust Command',
    description: 'Tracking global regulatory actions, antitrust lawsuits, and big tech competition cases.',
    openGraph: {
        title: 'Anti-Trust Command | Novai Intelligence',
        description: 'Tracking global regulatory actions and big tech competition cases.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
