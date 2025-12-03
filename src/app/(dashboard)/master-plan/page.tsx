import React from 'react';
import { Target, Brain, Zap, ArrowRight } from 'lucide-react';

export default function MasterPlanPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white -m-4 lg:-m-8 p-4 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-16 py-12">

                {/* Header */}
                <div className="space-y-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        THE MASTER PLAN
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Our three-phase roadmap to decode the technological singularity and provide humanity with a God's Eye View of the future.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative space-y-24 before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:-translate-x-px md:before:h-full md:before:w-0.5 md:before:bg-gradient-to-b md:before:from-transparent md:before:via-slate-800 md:before:to-transparent">

                    {/* Phase 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <Target className="w-5 h-5 text-slate-950" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Phase 1 (Current)</span>
                                <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">OPERATIONAL</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Total Awareness</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Aggregating global intelligence from 109+ high-signal sources. We are building the world's most comprehensive real-time monitor of AI, robotics, and geopolitical shifts.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    Real-time Global Feed
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    US Intelligence Integration
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    War Room Monitoring
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-blue-500 transition-colors duration-300">
                            <Brain className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Phase 2 (2026)</span>
                                <span className="px-2 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">IN DEVELOPMENT</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Agentic Synthesis</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Deploying autonomous AI agents to analyze, correlate, and synthesize the data. Moving from passive monitoring to active intelligence generation and pattern recognition.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    Automated Daily Briefings
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    Cross-Source Correlation
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    Sentiment Analysis Engine
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-purple-500 transition-colors duration-300">
                            <Zap className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-purple-400 tracking-widest uppercase">Phase 3 (2027)</span>
                                <span className="px-2 py-1 text-[10px] font-bold bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">CONCEPT</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">The Oracle</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Achieving predictive capability. The system will not just report what is happening, but project likely future scenarios based on high-dimensional data modeling.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    Predictive Modeling
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    Scenario Simulation
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    Strategic Recommendations
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Footer Call to Action */}
                <div className="text-center pt-12">
                    <p className="text-slate-500 text-sm mb-4">Join us in building the future of intelligence.</p>
                    <a href="/global-feed" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors">
                        Access Global Feed <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
