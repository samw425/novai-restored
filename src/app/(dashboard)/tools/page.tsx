import { ComingSoon } from '@/components/ui/ComingSoon';
import { Wrench } from 'lucide-react';

export default function ToolsPage() {
    return (
        <ComingSoon
            title="AI Tools Database"
            description="A comprehensive, curated directory of the latest AI tools, frameworks, and SDKs. We are currently indexing over 500+ developer resources."
            eta="Initializing Q1 2026"
            icon={<Wrench className="w-10 h-10 text-blue-400" />}
        />
    );
}
