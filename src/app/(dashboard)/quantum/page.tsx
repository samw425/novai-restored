import { Atom } from 'lucide-react';
import { Suspense } from 'react';
import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quantum Intel',
    description: 'Tracking the leap from classical to quantum. Breakthroughs in computing, sensing, and cryptography.',
};

export default function QuantumPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Quantum Intel"
                description="Tracking the leap from classical to quantum. Breakthroughs in computing, sensing, and cryptography."
                insight="Quantum advantage is the 'Nuclear Moment' of the 21st century. Those who master the qubit will possess the power to break all modern encryption while simulating materials at the atomic level. This is the ultimate strategic high ground."
                icon={<Atom className="w-8 h-8 text-cyan-500" />}
            />
            <Suspense fallback={<div>Loading quantum intel...</div>}>
                <FeedContainer forcedCategory="quantum" showTicker={false} />
            </Suspense>
        </div>
    );
}
