'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Globe, Shield, Satellite, Radio } from 'lucide-react';

interface ResourceLoaderProps {
    message?: string;
}

export function ResourceLoader({ message = "Initializing intelligence stream..." }: ResourceLoaderProps) {
    const [statusText, setStatusText] = useState("Initializing secure connection...");

    const statusMessages = [
        "Connecting to satellite feeds...",
        "Decrypting global signals...",
        "Synthesizing intelligence streams...",
        "Aggregating multi-vector telemetry...",
        "Verifying source authenticity...",
        "Calibrating real-time sensors..."
    ];

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % statusMessages.length;
            setStatusText(statusMessages[currentIndex]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center animate-in fade-in duration-700">
            <div className="relative mb-10">
                {/* Central Pulse */}
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping blur-2xl"></div>
                <div className="relative bg-white p-6 rounded-full shadow-2xl border border-indigo-50 z-10">
                    <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
                </div>

                {/* Orbiting Satellites */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s' }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg border border-indigo-50">
                        <Satellite size={16} className="text-indigo-400" />
                    </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg border border-indigo-50">
                        <Globe size={16} className="text-blue-400" />
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                {message}
            </h3>

            <div className="h-8 mb-8">
                <p className="text-sm text-indigo-600 font-mono font-bold animate-pulse uppercase tracking-widest">
                    {statusText}
                </p>
            </div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl p-6 shadow-xl text-left transform transition-all hover:scale-[1.02]">
                <div className="flex gap-4">
                    <div className="bg-indigo-50 p-2.5 rounded-xl h-fit">
                        <Shield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">
                            Establishing Secure Uplink
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            We are currently aggregating and verifying live intelligence from <span className="font-bold text-indigo-600">70+ global sources</span>.
                            To ensure 100% accuracy and real-time synthesis, this process may take <span className="font-bold text-gray-900">up to 30 seconds</span>.
                        </p>
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full animate-progress-indeterminate"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
