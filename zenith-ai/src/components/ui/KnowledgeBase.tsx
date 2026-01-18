import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, TrendingUp, Users, Target, CheckCircle2, AlertTriangle, Calculator, FileText, Zap } from 'lucide-react';

interface KnowledgeBaseProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'EDUCATION' | 'WHOLESALERS' | 'CAP_RATES';
}

export default function KnowledgeBase({ isOpen, onClose, initialTab = 'EDUCATION' }: KnowledgeBaseProps) {
    const [activeTab, setActiveTab] = useState(initialTab);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="w-full max-w-5xl h-[85vh] bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-zenith-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Zenith Academy</h2>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Institutional Intelligence \ Alpha-2 Core</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex px-8 border-b border-white/5 bg-black/40">
                        {[
                            { id: 'EDUCATION', label: 'INVESTMENT_STRATEGY', icon: Target },
                            { id: 'CAP_RATES', label: 'CAP_RATE_ACADEMY', icon: Calculator },
                            { id: 'WHOLESALERS', label: 'WHOLESALER_PORTAL', icon: Users }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative
                                    ${activeTab === tab.id ? 'text-zenith-accent' : 'text-white/30 hover:text-white'}
                                `}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zenith-accent" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        {activeTab === 'EDUCATION' && <InvestmentStrategyContent />}
                        {activeTab === 'CAP_RATES' && <CapRateContent />}
                        {activeTab === 'WHOLESALERS' && <WholesalerPortalContent />}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function InvestmentStrategyContent() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-zenith-accent">
                        <CheckCircle2 className="w-5 h-5" />
                        <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">The Good Investment</h3>
                    </div>
                    <div className="space-y-4 text-sm text-white/60 leading-relaxed font-mono">
                        <p>A "Zenith Grade" asset isn't just a house; it's a data-backed yield engine. Look for:</p>
                        <ul className="space-y-3 list-none">
                            <li className="flex gap-3">
                                <span className="text-zenith-accent">01.</span>
                                <span><strong className="text-white">Equity Surplus:</strong> Assets with {">"}40% equity detected via public record correlation.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-zenith-accent">02.</span>
                                <span><strong className="text-white">Motivation Delta:</strong> High Motivation Scores ({">"}75) combined with Off-Market status.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-zenith-accent">03.</span>
                                <span><strong className="text-white">Cap Rate Stability:</strong> Markets with cap rates exceeding the current 10-year Treasury + 300bps.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-zenith-distress">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">The Bad Investment</h3>
                    </div>
                    <div className="space-y-4 text-sm text-white/60 leading-relaxed font-mono">
                        <p>Avoid these "Capital Traps" detected by our Oracle engine:</p>
                        <ul className="space-y-3 list-none">
                            <li className="flex gap-3 text-white/40">
                                <span className="text-zenith-distress">01.</span>
                                <span><strong className="text-white/60">Equity Erosion:</strong> Recent high-LTV refinances suggesting a "tapped out" owner.</span>
                            </li>
                            <li className="flex gap-3 text-white/40">
                                <span className="text-zenith-distress">02.</span>
                                <span><strong className="text-white/60">Zoning Latency:</strong> Assets in jurisdictions with pending restrictive zoning changes.</span>
                            </li>
                            <li className="flex gap-3 text-white/40">
                                <span className="text-zenith-distress">03.</span>
                                <span><strong className="text-white/60">Liquidity Voids:</strong> Average days on market (DOM) exceeding 90 days in that specific zip.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="p-8 rounded-2xl bg-zenith-accent/5 border border-zenith-accent/20">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zenith-accent mb-4">ZENITH_ALPHA_TIP</h4>
                <p className="text-sm font-mono text-white/80 italic">
                    "The best deals are found where the records are messy but the equity is clean. Zenith prioritizes 'Record Chaos' as a distress signal."
                </p>
            </div>
        </div>
    );
}

function CapRateContent() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Understanding Cap Rates</h3>
                        <p className="text-sm text-white/60 leading-relaxed font-mono">
                            Capitalization Rate (Cap Rate) is the expected rate of return on a real estate investment property.
                            It is the ratio between the Net Operating Income (NOI) and the asset value.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-8">
                        <div className="text-center">
                            <div className="text-[10px] text-white/40 uppercase mb-1">NOI</div>
                            <div className="h-px w-20 bg-white/20 mx-auto my-2" />
                            <div className="text-[10px] text-white/40 uppercase mt-1">Value</div>
                        </div>
                        <div className="text-2xl text-white/20">=</div>
                        <div className="text-3xl font-black text-zenith-accent italic uppercase">Cap Rate</div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">HOW TO EVALUATE</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: '4% - 5%', desc: 'Primary Market (e.g., Austin, NYC). Low risk, stable appreciation.' },
                                { title: '6% - 8%', desc: 'Secondary Market. Balanced yield and growth potential.' },
                                { title: '10%+', desc: 'High Yield / Value-Add. Likely requires heavy renovation or management.' }
                            ].map(item => (
                                <div key={item.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-6 items-center">
                                    <span className="text-lg font-black text-white italic min-w-[80px]">{item.title}</span>
                                    <span className="text-xs text-white/60 font-mono">{item.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-zenith-accent/5 p-8 rounded-2xl border border-zenith-accent/10 space-y-6">
                    <TrendingUp className="w-8 h-8 text-zenith-accent" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">ZEN_ESTIMATE_MATH</h4>
                    <p className="text-xs text-white/60 font-mono leading-relaxed">
                        Zenith calculates Cap Rates in real-time by correlating nationwide rent data with our proprietary ZenEstimate.
                    </p>
                    <button className="w-full py-3 rounded-xl bg-zenith-accent text-black text-[10px] font-black uppercase tracking-widest">Open Calculator</button>
                </div>
            </div>
        </div>
    );
}

function WholesalerPortalContent() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Wholesaler Execution Portal</h3>
                <p className="text-sm text-white/60 leading-relaxed font-mono">
                    Wholesaling is high-velocity real estate. Zenith provides the armor and the weaponry for your business.
                </p>
            </div>

            <section className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                    <div className="flex gap-4 items-center">
                        <Users className="w-6 h-6 text-zenith-accent" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Building a Buyers List</h4>
                    </div>
                    <div className="space-y-4 text-xs font-mono text-white/60 leading-relaxed">
                        <p>Most wholesalers fail because they don't have a list. Here is how to build one in 10 minutes on Zenith:</p>
                        <ol className="space-y-3 list-none">
                            <li className="flex gap-3">
                                <span className="text-white/20">Step 1:</span>
                                <span>Filter map for <strong className="text-white">"Corporate"</strong> owners and <strong className="text-white">"Trusts"</strong>. These are your cash buyers.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-white/20">Step 2:</span>
                                <span>Use <strong className="text-white">Elite Skip-Trace</strong> to reveal the principal's direct phone number.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-white/20">Step 3:</span>
                                <span>Click "Add to Portfolio" to tag them as a 'Buy-Side Partner'.</span>
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                    <div className="flex gap-4 items-center">
                        <Zap className="w-6 h-6 text-zenith-accent" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">The Zenith Advantage</h4>
                    </div>
                    <ul className="space-y-4 text-xs font-mono text-white/60 leading-relaxed">
                        <li className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zenith-accent mt-1.5" />
                            <span><strong className="text-white">Zero Competition:</strong> Find assets before they hit any wholesaler lists.</span>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zenith-accent mt-1.5" />
                            <span><strong className="text-white">Verified Debt:</strong> See exact loan balances to know if a deal is even possible.</span>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zenith-accent mt-1.5" />
                            <span><strong className="text-white">Direct-to-Principal:</strong> Skip the middleman agents entirely.</span>
                        </li>
                    </ul>
                </div>
            </section>

            <div className="flex justify-center">
                <button className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-zenith-accent transition-all shadow-xl hover:scale-105 active:scale-95">
                    Launch Wholesaler Dashboard
                </button>
            </div>
        </div>
    );
}
