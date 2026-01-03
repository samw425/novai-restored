import { Rocket } from 'lucide-react';
import { Suspense } from 'react';
import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Space Intelligence',
    description: 'OSINT for the ultimate high ground. Tracking satellite deployments, orbital logistics, and deep space exploration.',
};

export default function SpacePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Space Intelligence"
                description="OSINT for the ultimate high ground. Tracking satellite deployments, orbital logistics, and deep space exploration."
                insight="Low Earth Orbit (LEO) is the new nervous system of global logistics and telecommunications. The congestion of orbital paths and the rise of private space agencies represent a profound shift in sovereign reach. We monitor the vertical expansion."
                icon={<Rocket className="w-8 h-8 text-orange-500" />}
            />
            <Suspense fallback={<div>Loading space intel...</div>}>
                <FeedContainer forcedCategory="space" showTicker={false} />
            </Suspense>
        </div>
    );
}
