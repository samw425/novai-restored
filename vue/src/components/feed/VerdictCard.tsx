import React, { useState } from 'react';
import type { Verdict } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Music2, Tv, MonitorPlay } from 'lucide-react';
import clsx from 'clsx';

interface VerdictCardProps {
    verdict: Verdict;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict }) => {
    const [isTrayOpen, setIsTrayOpen] = useState(false);

    // Dynamic Icon based on Service
    const getServiceIcon = (service: string) => {
        if (service.includes('spotify')) return <Music2 size={16} />;
        if (service.includes('youtube')) return <MonitorPlay size={16} />;
        return <Tv size={16} />;
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-vue-black selection:bg-vue-green selection:text-black">

            {/* 1. Cinematic Background Layer */}
            <div className="absolute inset-0 z-0">
                <iframe
                    className="w-full h-[120%] -translate-y-[10%] pointer-events-none scale-[1.35] grayscale-[0.3] opacity-80"
                    src={`https://www.youtube.com/embed/${verdict.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${verdict.youtubeId}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1`}
                    allow="autoplay; encrypted-media"
                    frameBorder="0"
                />
                {/* Advanced Vignetting for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-vue-black via-vue-black/50 to-transparent" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-vue-black/60" />
            </div>

            {/* 2. The Verdict Interface */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pb-24 lg:p-12 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="max-w-2xl w-full mx-auto"
                >
                    {/* Header: Score & Badge */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={clsx(
                            "px-4 py-1.5 rounded-full border text-[11px] font-black tracking-[0.2em] backdrop-blur-md",
                            verdict.verdict === 'STREAM'
                                ? "border-vue-green/50 text-vue-green bg-vue-green/10"
                                : "border-vue-red/50 text-vue-red bg-vue-red/10"
                        )}>
                            {verdict.verdict}
                        </div>
                        <div className="h-px w-8 bg-white/20" />
                        <span className="text-white/80 text-xs font-bold tracking-widest font-mono">
                            {verdict.score}% MATCH
                        </span>
                    </div>

                    {/* Main Content: Glass Card */}
                    <div className="glass p-8 md:p-10 rounded-[40px] relative overflow-hidden group">

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out pointer-events-none" />

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-3 text-white">
                            {verdict.title}
                        </h1>

                        <p className="text-lg md:text-xl font-medium text-zinc-300 leading-snug max-w-lg mb-8">
                            {verdict.why}
                        </p>

                        {/* Action Bar */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    const link = Object.values(verdict.streamingLinks)[0];
                                    if (link) window.open(link, '_blank');
                                }}
                                className="btn-primary flex-1 h-16 text-lg hover:brightness-110 active:scale-95"
                            >
                                {Object.keys(verdict.streamingLinks).length > 0
                                    ? getServiceIcon(Object.keys(verdict.streamingLinks)[0])
                                    : <Play fill="black" size={20} />
                                }
                                {verdict.pillar === 'TALK' ? 'LISTEN NOW' : 'WATCH NOW'}
                            </button>

                            <button
                                onClick={() => setIsTrayOpen(true)}
                                className="w-16 h-16 rounded-full glass flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                            >
                                <Info size={24} className="text-white/80" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 3. The Evidence Tray (Slide Up) */}
            <AnimatePresence>
                {isTrayOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTrayOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md z-20"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 glass-dark rounded-t-[40px] z-30 p-8 pb-12 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="w-16 h-1 bg-white/20 rounded-full mx-auto mb-8" />

                            {/* Tray Content */}
                            <div className="max-w-xl mx-auto space-y-8">
                                <div>
                                    <h3 className="text-xs font-black tracking-[0.2em] text-zinc-500 mb-4 uppercase">Pulse</h3>
                                    <div className="space-y-3">
                                        {verdict.redditPulse.map((c, i) => (
                                            <div key={i} className="glass p-4 rounded-xl text-sm text-zinc-300 font-medium">
                                                <span className="text-xs text-vue-green font-bold block mb-1">u/{c.user}</span>
                                                "{c.text}"
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full py-4 text-zinc-500 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors" onClick={() => setIsTrayOpen(false)}>
                                    Close Tray
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
