import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Shield, Database, Filter, Cpu, Map, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-4xl mx-auto px-6 pt-8">
                <PageHeader
                    title="About Novai"
                    description="MISSION & METHODOLOGY"
                    insight="We are building the world's first autonomous open-source intelligence agency."
                    icon={<Shield className="w-8 h-8 text-blue-600" />}
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 space-y-12">

                {/* Mission Section */}
                <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">The Mission</h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            In an era of information overload, the signal is lost in the noise.
                            Novai Intelligence was founded on a single premise:
                            <span className="font-bold text-slate-900"> Decision-makers need synthesis, not just aggregation.</span>
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed mt-4">
                            We are building a platform that autonomously monitors, verifies, and analyzes global developments
                            in Artificial Intelligence, National Security, and Market Dynamics. Our goal is to provide
                            a "God's Eye View" of the technological singularity and the geopolitical shifts it triggers.
                        </p>
                    </div>
                </section>

                {/* How It Works - The Pipeline */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">The Intelligence Engine</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Step 1: Ingestion */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Database size={64} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">1</span>
                                <h3 className="text-lg font-bold text-slate-900">Global Ingestion</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Our scrapers monitor 70+ verified sources 24/7, including research labs (OpenAI, DeepMind),
                                government feeds (DoD, CISA), and high-signal industry blogs. We ingest RSS feeds,
                                API streams, and raw HTML.
                            </p>
                        </div>

                        {/* Step 2: Noise Reduction */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Filter size={64} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">2</span>
                                <h3 className="text-lg font-bold text-slate-900">Signal Filtering</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Not every press release matters. We use a multi-stage filtering process to remove
                                marketing fluff, duplicate stories, and low-impact news. Only items with significant
                                technical or strategic value pass through.
                            </p>
                        </div>

                        {/* Step 3: Clustering */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Map size={64} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">3</span>
                                <h3 className="text-lg font-bold text-slate-900">Semantic Clustering</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We use vector embeddings to group related stories into "Narratives".
                                If 5 different sources report on "GPT-5", we present them as a single,
                                evolving storyline rather than 5 separate links.
                            </p>
                        </div>

                        {/* Step 4: Analysis */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield size={64} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">4</span>
                                <h3 className="text-lg font-bold text-slate-900">Autonomous Analysis</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Our LLM agents read the clustered content and generate a "Novai Analysis" —
                                a concise, executive summary that highlights the strategic implications
                                of the event, not just the facts.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Strategic Roadmap - Premium Redesign */}
                <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                    <div className="relative z-10 p-10 sm:p-12">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                            <div>
                                <h2 className="text-4xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                    The Master Plan
                                </h2>
                                <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                                    We are not just building a news reader. We are building the <span className="text-white font-bold">central nervous system</span> for the post-AI world.
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <Map className="w-24 h-24 text-slate-800 opacity-50" />
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Phase 1: NOW */}
                            <div className="relative pl-8 sm:pl-12 border-l-2 border-emerald-500/30">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] ring-4 ring-slate-900"></div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                                Active / Deployed
                                            </span>
                                            <h3 className="text-2xl font-bold text-white">Phase 1: Total Awareness</h3>
                                        </div>
                                        <p className="text-slate-400 mb-6 leading-relaxed">
                                            Ingesting the world's data in real-time. We have established direct pipelines to 70+ high-signal sources, filtering noise and clustering narratives autonomously.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['Global Feed Aggregation', 'Real-time US Intel Stream', 'Market Pulse & Tickers', 'Semantic Noise Filtering'].map((item) => (
                                                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 2: NEXT */}
                            <div className="relative pl-8 sm:pl-12 border-l-2 border-blue-500/30">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-4 ring-slate-900"></div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20 animate-pulse">
                                                In Development
                                            </span>
                                            <h3 className="text-2xl font-bold text-white">Phase 2: Agentic Synthesis</h3>
                                        </div>
                                        <p className="text-slate-400 mb-6 leading-relaxed">
                                            Moving beyond reading. Autonomous agents will read thousands of articles daily to generate executive-level briefings, audio summaries, and strategic one-pagers.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['Daily Audio Briefings', 'Executive One-Pagers', 'Cross-Lingual Intel', 'Personalized Deep Dives'].map((item) => (
                                                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3: FUTURE */}
                            <div className="relative pl-8 sm:pl-12 border-l-2 border-purple-500/30">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] ring-4 ring-slate-900"></div>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">
                                                Q3 2026
                                            </span>
                                            <h3 className="text-2xl font-bold text-white">Phase 3: The Oracle</h3>
                                        </div>
                                        <p className="text-slate-400 mb-6 leading-relaxed">
                                            Predictive intelligence. Using historical data and sentiment analysis to forecast market movements, geopolitical conflicts, and second-order effects before they happen.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['Conflict Probability Models', 'Supply Chain Risk AI', 'Market Impact Simulation', 'Scenario Wargaming'].map((item) => (
                                                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
