import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Info } from 'lucide-react';
import { ZenithProperty } from '@/lib/types';
import { getMotivationLabel } from '@/lib/data/motivation-engine';

interface PremiumCardProps {
    property: ZenithProperty;
    onRevealContact?: (id: string) => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ property, onRevealContact }) => {
    const motivationLabel = getMotivationLabel(property.motivationScore);
    const isHighMotivation = property.motivationScore >= 70;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="elite-card p-5 flex flex-col gap-4"
        >
            {/* Visual Indicator for Motivation */}
            <div className="absolute top-0 right-0 p-3">
                <div className={`h-2 w-2 rounded-full ${isHighMotivation ? 'bg-zenith-distress animate-pulse shadow-[0_0_10px_#ff3b30]' : 'bg-zenith-accent'}`} />
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{property.address}</h3>
                    <div className="flex items-center gap-1 text-zenith-muted text-sm mt-1">
                        <MapPin size={14} />
                        <span>{property.type} • Austin, TX</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-zenith-muted font-semibold">Value Est.</p>
                    <p className="text-lg font-mono text-white">${(property.estimatedValue / 1000).toFixed(0)}k</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-zenith-muted font-semibold">Zenith Score</p>
                    <p className={`text-lg font-mono ${isHighMotivation ? 'text-zenith-distress' : 'text-zenith-accent'}`}>
                        {property.motivationScore}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <TrendingUp size={16} className={isHighMotivation ? 'text-zenith-distress' : 'text-zenith-accent'} />
                <span className="text-xs font-medium text-white/80">{motivationLabel}</span>
            </div>

            <div className="flex gap-2 mt-auto pt-4">
                <button
                    onClick={() => onRevealContact?.(property.id)}
                    className="flex-1 bg-zenith-accent text-black font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity glow-accent"
                >
                    Reveal Contact
                </button>
                <button className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <Info size={20} />
                </button>
            </div>

            {/* Subtle Shimmer Overlay */}
            <div className="absolute inset-0 pointer-events-none animate-shimmer opacity-20" />
        </motion.div>
    );
};
