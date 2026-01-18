import React from 'react';
import { motion } from 'framer-motion';

interface FinancialChartProps {
    label: string;
    value: number;
    total: number;
    color?: string;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ label, value, total, color = 'var(--zenith-accent)' }) => {
    const percentage = Math.min(100, Math.max(0, (value / total) * 100));

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-mono">{label}</span>
                <span className="text-[10px] font-black text-white font-mono">{percentage.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ backgroundColor: color }}
                    className="h-full rounded-full relative z-10"
                />
                {/* Subtle Glow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                    className="absolute inset-0 blur-sm rounded-full"
                />
            </div>
        </div>
    );
};

export default FinancialChart;
