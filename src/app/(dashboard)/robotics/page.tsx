import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Bot } from 'lucide-react';

export default function RoboticsPage() {
    return (
        <CategoryFeed
            category="robotics"
            title="Robotics & Hardware"
            description="Developments in embodied AI, humanoid robots, drones, and the hardware powering the AI revolution."
            insight="Embodied AI is the next trillion-dollar wave. Watch for convergence between LLMs and physical control systems."
            icon={<Bot className="w-8 h-8 text-[#2563EB]" />}
        />
    );
}
