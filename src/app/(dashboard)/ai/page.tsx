import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Sparkles } from 'lucide-react';

export default function AIPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="AI News"
                description="General AI news, developments, and updates from leading tech publishers including Wired, The Verge, Ars Technica, and more."
                insight="AI is moving faster than any technology in history. We curate the noise so you don't miss the signal."
                icon={<Sparkles className="w-8 h-8 text-[#2563EB]" />}
            />
            <FeedContainer forcedCategory="ai" showTicker={false} />
        </div>
    );
}
