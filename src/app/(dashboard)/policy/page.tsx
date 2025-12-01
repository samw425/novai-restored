import { ComingSoon } from '@/components/ui/ComingSoon';
import { Scale } from 'lucide-react';

export default function PolicyPage() {
    return (
        <ComingSoon
            title="Global Policy Monitor"
            description="A dedicated dashboard for tracking AI regulation, the EU AI Act, and global governance initiatives. Compliance tracking module included."
            eta="Initializing Q1 2026"
            icon={<Scale className="w-10 h-10 text-blue-400" />}
        />
    );
}
