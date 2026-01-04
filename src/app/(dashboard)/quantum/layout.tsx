import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quantum Intelligence',
    description: 'Tracking the frontier of quantum computing, cryptography, and communications.',
    openGraph: {
        title: 'Quantum Intelligence | Novai Intelligence',
        description: 'Tracking the frontier of quantum computing and cryptography.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
