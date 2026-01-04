import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Master Plan',
    description: 'The roadmap for Novai Intelligence and the future of information advantage.',
    openGraph: {
        title: 'Master Plan | Novai Intelligence',
        description: 'The roadmap for Novai Intelligence and the future of information advantage.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
