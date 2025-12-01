'use client';

import { useEffect, useState } from 'react';
import { Globe, Zap, Shield, TrendingUp, Radio } from 'lucide-react';

export function GlobalLoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [currentSource, setCurrentSource] = useState(0);

    const sources = [
        { name: 'AI Research Papers', icon: TrendingUp, color: 'text-blue-500' },
        { name: 'Global News Feeds', icon: Globe, color: 'text-emerald-500' },
        { name: 'Market Data', icon: Zap, color: 'text-amber-500' },
        { name: 'Security Intel', icon: Shield, color: 'text-red-500' },
        { name: 'OSINT Sources', icon: Radio, color: 'text-purple-500' }
    ];

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        const sourceInterval = setInterval(() => {
            setCurrentSource(prev => (prev + 1) % sources.length);
        }, 800);

        return () => {
            clearInterval(progressInterval);
            clearInterval(sourceInterval);
        };
    }, []);

    const CurrentIcon = sources[currentSource].icon;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 z-50 flex items-center justify-center">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />

            {/* Glowing Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 text-center">
                {/* Logo/Icon */}
                <div className="mb-8 relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                        <CurrentIcon className={`w-10 h-10 text-white transition-all duration-300 ${sources[currentSource].color}`} />
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-indigo-400/30 rounded-2xl animate-ping" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    Novai Intelligence
                </h1>

                {/* Subtitle */}
                <p className="text-indigo-200 mb-8 text-sm leading-relaxed">
                    Aggregating intelligence from <span className="font-bold text-white">70+ global sources</span>
                </p>

                {/* Current Activity */}
                <div className="mb-6 h-6">
                    <p className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${sources[currentSource].color}`}>
                        Syncing {sources[currentSource].name}...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                        </div>
                    </div>
                    <p className="text-indigo-300 text-xs mt-2 font-mono">{progress}%</p>
                </div>

                {/* Info Footer */}
                <div className="mt-12 pt-6 border-t border-white/10">
                    <p className="text-xs text-indigo-300/70 leading-relaxed">
                        Real-time synthesis • Vector analysis • Pattern detection
                    </p>
                </div>
            </div>
        </div>
    );
}
