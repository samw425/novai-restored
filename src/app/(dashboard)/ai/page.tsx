import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Sparkles } from 'lucide-react';

export default function AIPage() {
    return (
        <CategoryFeed
            category="ai"
            title="AI News"
            description="General AI news, developments, and updates from leading tech publishers including Wired, The Verge, Ars Technica, and more."
            icon={<Sparkles className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
