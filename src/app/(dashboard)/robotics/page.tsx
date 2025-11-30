import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Bot } from 'lucide-react';

export default function RoboticsPage() {
    return (
        <CategoryFeed
            category="robotics"
            title="Robotics"
            description="Latest developments in robotics, humanoid systems, and autonomous machines from Boston Dynamics, Tesla, Figure AI, and more."
            icon={<Bot className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
