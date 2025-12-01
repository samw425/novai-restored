import { ComingSoon } from '@/components/ui/ComingSoon';
import { Bot } from 'lucide-react';

export default function RoboticsPage() {
    return (
        <ComingSoon
            title="Robotics Tracker"
            description="Real-time tracking of humanoid robotics, embodied AI, and autonomous systems. We are integrating video feeds and hardware specs."
            eta="Initializing Q1 2026"
            icon={<Bot className="w-10 h-10 text-blue-400" />}
        />
    );
}
