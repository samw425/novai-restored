'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, BrainCircuit, Activity } from 'lucide-react';

const DEMO_SLIDES = [
    {
        id: 'war-room',
        title: 'KINETIC WARFARE TRACKING',
        icon: <Shield className="w-6 h-6 text-red-500" />,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Placeholder for War Room Screenshot
        desc: 'Real-time satellite feeds and troop movement analysis.'
    },
    {
        id: 'global-feed',
        title: 'GLOBAL INTELLIGENCE FEED',
        icon: <Globe className="w-6 h-6 text-blue-500" />,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop', // Placeholder for Feed Screenshot
        desc: 'Curated signal from 500+ elite sources.'
    },
    {
        id: 'analyst-notes',
        title: 'AI SYNTHESIS ENGINE',
        icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop', // Placeholder for AI Screenshot
        desc: 'Proprietary "Why This Matters" analysis.'
    }
];

export function SimulatedDemo() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl group">
            {/* Screen Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={DEMO_SLIDES[currentSlide].id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${DEMO_SLIDES[currentSlide].image})` }}
                >
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
                </motion.div>
            </AnimatePresence>

            {/* UI Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center">
                            {DEMO_SLIDES[currentSlide].icon}
                        </div>
                        <div>
                            <motion.h3
                                key={currentSlide + 'title'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-lg font-bold text-white font-mono tracking-tight"
                            >
                                {DEMO_SLIDES[currentSlide].title}
                            </motion.h3>
                            <motion.p
                                key={currentSlide + 'desc'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-slate-400 font-mono"
                            >
                                {DEMO_SLIDES[currentSlide].desc}
                            </motion.p>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase animate-pulse flex items-center gap-2">
                        <Activity size={12} />
                        Live Demo
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 justify-center">
                    {DEMO_SLIDES.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
