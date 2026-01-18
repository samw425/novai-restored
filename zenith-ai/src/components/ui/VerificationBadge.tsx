import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

interface VerificationBadgeProps {
    confidence: number;
    isValid: boolean;
    issues?: string[];
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ confidence, isValid, issues }) => {
    const percent = Math.round(confidence * 100);

    return (
        <div className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all
            ${isValid
                ? 'bg-zenith-accent/5 border-zenith-accent/30'
                : 'bg-red-500/5 border-red-500/30'}
        `}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isValid ? (
                        <CheckCircle2 className="w-4 h-4 text-zenith-accent" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {isValid ? 'VERIFIED_ASSET' : 'VERIFICATION_PENDING'}
                    </span>
                </div>
                <span className={`text-[10px] font-mono font-black ${isValid ? 'text-zenith-accent' : 'text-red-400'}`}>
                    {percent}% ACCURACY_CORE
                </span>
            </div>

            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${isValid ? 'bg-zenith-accent shadow-[0_0_10px_#00ff9d]' : 'bg-red-500'}`}
                    style={{ width: `${percent}%` }}
                />
            </div>

            {issues && issues.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                    {issues.map((issue, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] font-mono text-white/40 uppercase">
                            {issue.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerificationBadge;
