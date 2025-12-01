import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Globe } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Global Intelligence"
                description="Real-time aggregation of the world's most critical AI developments."
                insight="We aggregate data from 70+ sources to give you a comprehensive view of the AI landscape. Filter by category or search to find exactly what you need."
                icon={<Globe className="w-8 h-8 text-blue-600" />}
            />
            <FeedContainer />
        </div>
    );
}
