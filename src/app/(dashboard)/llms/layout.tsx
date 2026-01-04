import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'LLM Intelligence',
    description: 'Tracking the evolution and deployment of Large Language Models.',
    openGraph: {
        title: 'LLM Intelligence | Novai Intelligence',
        description: 'Tracking the evolution and deployment of Large Language Models.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
