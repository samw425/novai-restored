"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Search, Target, Activity, ShieldCheck, Fingerprint, ChevronUp, ChevronDown } from 'lucide-react';

const AGENTS = [
    { id: 'RECON', name: 'RECON_AGENT', icon: Search, color: '#3b82f6', task: 'Benchmarking Global Liquidity', envKey: 'NEXT_PUBLIC_RENTCAST_KEY' },
    { id: 'ALPHA', name: 'ALPHA_ORACLE', icon: Zap, color: '#8b5cf6', task: 'Projecting Future Velocity', envKey: 'NEXT_PUBLIC_RENTCAST_KEY' },
    { id: 'ZILLOW', name: 'ZILLOW_HUNTER', icon: Target, color: '#ef4444', task: 'Scanning Alpha Off-Market', envKey: 'NEXT_PUBLIC_RAPIDAPI_KEY' },
    { id: 'VERIFY', name: 'VERIFY_AUDIT', icon: ShieldCheck, color: '#f59e0b', task: 'Enforcing Data Veracity' },
    { id: 'SKIP', name: 'SKIP_TRACE', icon: Fingerprint, color: '#ec4899', task: 'Uplinking Owner Identity', envKey: 'NEXT_PUBLIC_REALITYMOLE_KEY' },
];

export default function SovereignCouncilHUD() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % AGENTS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const activeAgentsCount = AGENTS.filter(a => !a.envKey || process.env[a.envKey]).length;

    return (
        <div className="fixed bottom-24 right-4 z-[100]">
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="w-56"
                    >
                        {/* Glassmorphism Panel */}
                        <div
                            className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.7) 0%, rgba(20, 20, 20, 0.6) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                            {/* Header */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="w-full flex items-center justify-between gap-2 p-3 border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-[#00FF9D] animate-pulse" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Council of Agents</span>
                                </div>
                                <ChevronDown className="w-3 h-3 text-white/40" />
                            </button>

                            {/* Agent List */}
                            <div className="p-3 space-y-2">
                                {AGENTS.map((agent, i) => {
                                    const isActive = i === activeIndex;
                                    const hasKey = !agent.envKey || process.env[agent.envKey];
                                    return (
                                        <motion.div
                                            key={agent.id}
                                            animate={{
                                                opacity: isActive ? 1 : 0.4,
                                                scale: isActive ? 1 : 0.98
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-center gap-2.5"
                                        >
                                            <div
                                                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300"
                                                style={{
                                                    background: isActive ? `${agent.color}20` : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${isActive ? agent.color + '40' : 'rgba(255,255,255,0.05)'}`,
                                                    boxShadow: isActive ? `0 0 12px ${agent.color}30` : 'none'
                                                }}
                                            >
                                                <agent.icon
                                                    className="w-3 h-3 transition-colors duration-300"
                                                    style={{ color: isActive ? agent.color : '#666' }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className="text-[8px] font-semibold text-white/80 tracking-wider uppercase truncate">
                                                        {agent.name}
                                                    </p>
                                                    {!hasKey ? (
                                                        <span className="text-[6px] font-medium text-white/25 px-1.5 py-0.5 bg-white/5 rounded-full shrink-0">
                                                            standby
                                                        </span>
                                                    ) : isActive && (
                                                        <motion.div
                                                            layoutId="activeIndicator"
                                                            className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] shrink-0"
                                                            style={{ boxShadow: '0 0 8px #00FF9D' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
                                    <span className="text-[7px] font-medium text-white/40 uppercase tracking-wider">
                                        {activeAgentsCount}/{AGENTS.length} Active
                                    </span>
                                </div>
                                <span className="text-[7px] font-mono text-white/30">v14.0</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Collapsed Minimal State */
                    <motion.button
                        key="collapsed"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsExpanded(true)}
                        className="group flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:border-[#00FF9D]/30 transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(20, 20, 20, 0.5) 100%)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                        }}
                    >
                        <div className="flex items-center -space-x-1">
                            {AGENTS.slice(0, 3).map((agent, i) => (
                                <div
                                    key={agent.id}
                                    className="w-4 h-4 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `${agent.color}30`,
                                        border: `1px solid ${agent.color}50`,
                                        zIndex: 3 - i
                                    }}
                                >
                                    <agent.icon className="w-2 h-2" style={{ color: agent.color }} />
                                </div>
                            ))}
                        </div>
                        <span className="text-[8px] font-semibold text-white/60 uppercase tracking-wider group-hover:text-white/80 transition-colors">
                            Agents
                        </span>
                        <ChevronUp className="w-3 h-3 text-white/40 group-hover:text-[#00FF9D] transition-colors" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
