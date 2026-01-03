import { Cpu } from 'lucide-react';
import { Suspense } from 'react';
import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Semiconductor Command',
    description: 'Deep-dive intel on the world\'s most critical supply chain. From photolithography to next-gen AI silicon.',
};

export default function SemiconductorsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Semiconductor Command"
                description="Deep-dive intel on the world's most critical supply chain. From photolithography to next-gen AI silicon."
                insight="Silicon is the primary theater of operations in the war for compute supremacy. As lithography approaches physical limits at 2nm and below, the fight moves to advanced packaging and photonics. Chips are not just components; they are national security assets."
                icon={<Cpu className="w-8 h-8 text-blue-500" />}
            />
            <Suspense fallback={<div>Loading semiconductor intel...</div>}>
                <FeedContainer forcedCategory="semiconductors" showTicker={false} />
            </Suspense>
        </div>
    );
}
