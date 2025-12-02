import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Shield, Database, Filter, Cpu, Map, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <PageHeader
                title="About Novai"
                description="MISSION & METHODOLOGY"
                insight="We are building the world's first autonomous open-source intelligence agency."
                icon={<Shield className="w-8 h-8 text-blue-600" />}
            />

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

                {/* Roadmap */}
                <section className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Map size={200} />
                    </div>
                    <h2 className="text-2xl font-black mb-8 tracking-tight relative z-10">Strategic Roadmap</h2>

                    <div className="space-y-8 relative z-10">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <div className="w-px h-full bg-slate-700 my-2"></div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-emerald-400 mb-1">Phase 1: Aggregation (Current)</h4>
                                <p className="text-sm text-slate-400 max-w-xl">
                                    Establish real-time pipelines for US Intelligence, Global Tech News, and Market Data.
                                    Build the core "War Room" and "Feed" interfaces.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="w-px h-full bg-slate-700 my-2"></div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-blue-400 mb-1">Phase 2: Synthesis (Q1 2026)</h4>
                                <p className="text-sm text-slate-400 max-w-xl">
                                    Deploy "Novai Synthesis Agents" to generate daily audio briefings and written
                                    intelligence estimates. Move from "News Feed" to "Daily Briefing".
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-purple-400 mb-1">Phase 3: Prediction (Q3 2026)</h4>
                                <p className="text-sm text-slate-400 max-w-xl">
                                    Utilize historical data and sentiment analysis to predict market movements
                                    and geopolitical conflict escalation probabilities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
