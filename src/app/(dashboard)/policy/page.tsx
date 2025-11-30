import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Scale } from 'lucide-react';

export default function PolicyPage() {
    return (
        <CategoryFeed
            category="policy"
            title="Policy & Regulation"
            description="AI policy developments, regulation updates, EU AI Act, and government initiatives shaping the future of AI governance."
            icon={<Scale className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
