'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Zap, Terminal, AlertTriangle, Radio } from 'lucide-react';

const INTEL_STREAM = [
    { id: 1, type: 'WAR ROOM', message: 'Kinetic activity detected: South China Sea / Spratly Islands.', source: 'SAT-4', color: 'text-red-500' },
    { id: 2, type: 'MARKET', message: 'NVDA dark pool volume spike > 400% above moving average.', source: 'NYSE-L2', color: 'text-emerald-500' },
    { id: 3, type: 'CYBER', message: 'Zero-day vulnerability identified in critical infrastructure firmware.', source: 'CISA', color: 'text-orange-500' },
    { id: 4, type: 'POLICY', message: 'EU AI Act compliance deadline approaching for foundation models.', source: 'BRUSSELS', color: 'text-blue-500' },
    { id: 5, type: 'MODEL', message: 'GPT-5 training run completed. Parameter count estimated 2.5T.', source: 'LEAK', color: 'text-purple-500' },
];

export function LiveIntelPreview() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % INTEL_STREAM.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                        <Radio size={10} className="animate-pulse text-green-500" />
                        LIVE_FEED_V4.0 // ENCRYPTED
                    </div>
                </div>

                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm relative min-h-[300px] flex flex-col">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(15,23,42,0.8)_100%)] pointer-events-none z-10"></div>

                    <div className="space-y-4">
                        {INTEL_STREAM.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: idx === activeIndex ? 1 : 0.3,
                                    x: 0,
                                    filter: idx === activeIndex ? 'blur(0px)' : 'blur(1px)'
                                }}
                                className={`flex items-start gap-4 ${idx === activeIndex ? 'bg-slate-900/50 p-3 rounded border border-slate-800' : 'px-3'}`}
                            >
                                <span className="text-slate-600 text-xs whitespace-nowrap pt-1">
                                    {new Date().toISOString().split('T')[1].split('.')[0]}
                                </span>
                                <div>
                                    <div className={`text-[10px] font-bold mb-1 ${item.color} flex items-center gap-2`}>
                                        {item.type === 'WAR ROOM' && <Shield size={10} />}
                                        {item.type === 'MARKET' && <Zap size={10} />}
                                        {item.type === 'CYBER' && <AlertTriangle size={10} />}
                                        {item.type === 'POLICY' && <Globe size={10} />}
                                        {item.type === 'MODEL' && <Terminal size={10} />}
                                        {item.type} // {item.source}
                                    </div>
                                    <div className={idx === activeIndex ? 'text-white' : 'text-slate-500'}>
                                        {item.message}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Cursor */}
                    <div className="mt-6 flex items-center gap-2 text-blue-500 animate-pulse">
                        <span className="text-slate-600">root@novai:~$</span>
                        <span className="w-2 h-4 bg-blue-500"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
