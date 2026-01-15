"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Map as MapIcon, Database, Zap, ArrowRight, X, Cpu, CheckCircle } from "lucide-react";

const BOOT_LOGS = [
    "INITIALIZING_ZENITH_CORE_V1.2.4...",
    "ESTABLISHING_SECURE_HANDSHAKE...",
    "LOADING_GEOSPATIAL_MODELS...",
    "CONNECTING_TO_LIVE_FEED...",
    "OPTIMIZING_NEURAL_NETWORKS...",
    "SYSTEM_READY."
];

export default function OnboardingHUD({ onComplete }: { onComplete: () => void }) {
    const [bootStep, setBootStep] = useState(0);
    const [bootComplete, setBootComplete] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const steps = [
        {
            title: "UNLISTED INVENTORY",
            desc: "Zillow shows you what's for sale. Zenith shows you what *could* be for sale. Access 100% of properties, not just the 1% on the MLS.",
            icon: MapIcon
        },
        {
            title: "LIVE DATA FEEDS",
            desc: "Our engine pipes directly into public records, tax delinquencies, and pre-foreclosures. Real-time signals of motivation to sell.",
            icon: Database
        },
        {
            title: "DIRECT ACCESS",
            desc: "Skip the 6% agent commission. Contact owners directly with skip-traced phone and email data.",
            icon: Zap
        }
    ];

    useEffect(() => {
        if (!bootComplete && bootStep < BOOT_LOGS.length) {
            const timeout = setTimeout(() => {
                setBootStep(prev => prev + 1);
            }, 400);
            return () => clearTimeout(timeout);
        } else if (!bootComplete && bootStep === BOOT_LOGS.length) {
            setTimeout(() => setBootComplete(true), 800);
        }
    }, [bootStep, bootComplete]);

    const nextOnboardingStep = () => {
        if (onboardingStep < steps.length - 1) {
            setOnboardingStep(prev => prev + 1);
        } else {
            dismiss();
        }
    };

    const dismiss = () => {
        setIsVisible(false);
        setTimeout(onComplete, 500);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {!bootComplete ? (
                <div key="boot" className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono">
                    <div className="w-[400px] p-6 border-l-2 border-zenith-accent/30 bg-zenith-accent/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-50">
                            <Cpu className="w-6 h-6 text-zenith-accent animate-pulse" />
                        </div>

                        <div className="space-y-1 mb-8">
                            {BOOT_LOGS.slice(0, bootStep).map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[10px] text-zenith-accent/80 tracking-widest"
                                >
                                    {`> ${log}`}
                                </motion.div>
                            ))}
                            {bootStep < BOOT_LOGS.length && (
                                <motion.div
                                    animate={{ opacity: [0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="w-2 h-4 bg-zenith-accent"
                                />
                            )}
                        </div>

                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-zenith-accent shadow-[0_0_10px_#00ff9d]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(bootStep / BOOT_LOGS.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <motion.div
                    key="onboarding"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="w-[90vw] max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Highlight */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-zenith-accent/10 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zenith-distress/10 rounded-full blur-[100px]" />

                        <div className="relative flex flex-col md:flex-row gap-8 items-center">
                            {/* Graphic Side */}
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="w-32 h-32 relative flex items-center justify-center">
                                    <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-4 border border-zenith-accent/20 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                                    <div className="w-16 h-16 bg-zenith-accent/10 rounded-full flex items-center justify-center backdrop-blur-md border border-zenith-accent/30 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
                                        {(() => {
                                            const Icon = steps[onboardingStep].icon;
                                            return <Icon className="w-8 h-8 text-zenith-accent" />;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 text-center md:text-left">
                                <motion.div
                                    key={onboardingStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                        <div className="px-2 py-0.5 rounded border border-zenith-accent/30 bg-zenith-accent/5 text-[9px] font-mono tracking-widest text-zenith-accent">
                                            STEP_0{onboardingStep + 1}
                                        </div>
                                        <div className="h-[1px] w-12 bg-white/10" />
                                    </div>

                                    <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
                                        {steps[onboardingStep].title}
                                    </h2>
                                    <p className="text-zenith-muted text-sm leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                                        {steps[onboardingStep].desc}
                                    </p>
                                </motion.div>

                                <button
                                    onClick={nextOnboardingStep}
                                    className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 mx-auto md:mx-0"
                                >
                                    <span className="tracking-widest uppercase text-xs">
                                        {onboardingStep === steps.length - 1 ? "Initialize System" : "Proceed"}
                                    </span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
