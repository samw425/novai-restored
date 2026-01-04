import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Market Intelligence',
    description: 'Real-time analysis of global financial markets and economic trends.',
    openGraph: {
        title: 'Market Intelligence | Novai Intelligence',
        description: 'Real-time analysis of global financial markets.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
