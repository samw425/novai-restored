import { ComingSoon } from '@/components/ui/ComingSoon';
import { FlaskConical } from 'lucide-react';

export default function ResearchPage() {
    return (
        <ComingSoon
            title="Research Lab"
            description="Automated analysis of Arxiv papers and technical pre-prints. Our agents will summarize and rank breakthroughs before they hit the news."
            eta="Initializing Q1 2026"
            icon={<FlaskConical className="w-10 h-10 text-blue-400" />}
        />
    );
}
