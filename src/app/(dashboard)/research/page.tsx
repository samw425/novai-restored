import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { FlaskConical } from 'lucide-react';

export default function ResearchPage() {
    return (
        <CategoryFeed
            category="research"
            title="Research Papers"
            description="Latest AI research papers, pre-prints, and technical breakthroughs from top labs and conferences."
            insight="The pace of research is accelerating. We track pre-prints to spot breakthroughs before they hit the mainstream."
            icon={<FlaskConical className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
