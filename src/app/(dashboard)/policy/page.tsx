import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Scale } from 'lucide-react';

export default function PolicyPage() {
    return (
        <CategoryFeed
            category="policy"
            title="Policy & Regulation"
            description="AI policy developments, regulation updates, EU AI Act, and government initiatives shaping the future of AI governance."
            insight="Regulation is the new innovation frontier. Tracking the EU AI Act and global governance is critical for compliance."
            icon={<Scale className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
