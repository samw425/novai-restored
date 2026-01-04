import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daily Snapshot',
    description: 'A rapid overview of the most critical intelligence vectors in the last 24 hours.',
    openGraph: {
        title: 'Daily Snapshot | Novai Intelligence',
        description: 'A rapid overview of the most critical intelligence vectors in the last 24 hours.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
