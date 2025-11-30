import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Wrench } from 'lucide-react';

export default function ToolsPage() {
    return (
        <CategoryFeed
            category="tools"
            title="Tools & Frameworks"
            description="New AI tools, developer frameworks, SDKs, and open-source projects from Hugging Face, LangChain, and the AI developer community."
            icon={<Wrench className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
