import React from 'react';
import { ShieldCheck, Database, Landmark, Globe } from "lucide-react";

interface ProvenanceBadgeProps {
    source: string;
    verifiedAt: string;
    confidence: number;
}

const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ source, verifiedAt, confidence }) => {
    const isGov = source.includes("GOV") || source.includes("COUNTY") || source.includes("ARCGIS") || source.includes("SOCRATA");

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-mono tracking-widest uppercase transition-all
      ${isGov
                ? 'bg-zenith-accent/10 border-zenith-accent/30 text-zenith-accent shadow-[0_0_15px_rgba(0,255,148,0.1)]'
                : 'bg-white/5 border-white/10 text-white/40'}
    `}>
            {isGov ? <Landmark className="w-2.5 h-2.5" /> : <Database className="w-2.5 h-2.5" />}
            <span>{source.replace(/_/g, ' ')}</span>
            <div className="w-[1px] h-2 bg-white/10 mx-1" />
            <span className="opacity-60">{Math.round(confidence * 100)}% DETECTED</span>
        </div>
    );
};

export default ProvenanceBadge;
