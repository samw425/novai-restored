import { Dna } from 'lucide-react';
import { Suspense } from 'react';
import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';

export default function BiotechPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Biotech Intelligence"
                description="Curated intelligence from the frontier of synthetic biology, genomics, and life sciences."
                insight="The biological revolution is the next 'Compute' moment. As we transition from reading the code of life to writing it, the economic and security implications cannot be overstated. We track the pioneers of this programmable future."
                icon={<Dna className="w-8 h-8 text-emerald-500" />}
            />
            <Suspense fallback={<div>Loading biotech intel...</div>}>
                <FeedContainer forcedCategory="biotech" showTicker={false} />
            </Suspense>
        </div>
    );
}
