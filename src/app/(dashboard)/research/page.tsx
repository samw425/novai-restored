import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { FlaskConical } from 'lucide-react';

export default function ResearchPage() {
    return (
        <CategoryFeed
            category="research"
            title="Research"
            description="Cutting-edge AI research papers, model architectures, and breakthroughs from OpenAI, Google DeepMind, Anthropic, and academia."
            icon={<FlaskConical className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
