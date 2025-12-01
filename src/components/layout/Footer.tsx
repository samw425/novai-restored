import Link from 'next/link';
import { Activity, Lock, Globe, ArrowRight, Zap, MapPin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 text-slate-600 py-16 mt-auto relative overflow-hidden">
            {/* Background decorative elements */}


            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3 text-slate-900">
                            <Logo theme="light" />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                            Synthesizing 70+ real-time data streams to empower decision-makers with actionable insights.
                        </p>
                    </div>

                    {/* Platform Links (Span 2) */}
                    <div className="lg:col-span-2">
                        <h3 className="text-slate-900 font-semibold text-sm mb-6 flex items-center gap-2">
                            Platform
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="/global-feed">Global Feed</FooterLink>
                            <FooterLink href="/war-room">War Room</FooterLink>
                            <FooterLink href="/us-intel">US Intel</FooterLink>
                            <FooterLink href="/deep-signals">Deep Signals</FooterLink>
                            <FooterLink href="/daily-snapshot">Daily Snapshot</FooterLink>
                            <FooterLink href="/intelligence-brief">Intel Brief</FooterLink>
                        </ul>
                    </div>

                    {/* Sectors Links (Span 2) */}
                    <div className="lg:col-span-2">
                        <h3 className="text-slate-900 font-semibold text-sm mb-6">
                            Sectors
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="/market-pulse">Market Pulse</FooterLink>
                            <FooterLink href="/ai">Artificial Intelligence</FooterLink>
                            <FooterLink href="/robotics">Robotics</FooterLink>
                            <FooterLink href="/research">Research</FooterLink>
                            <FooterLink href="/policy">Policy & Regs</FooterLink>
                            <FooterLink href="/hacker-news">Cyber Wire</FooterLink>
                        </ul>
                    </div>

                    {/* Tools & Resources (Span 2) */}
                    <div className="lg:col-span-2">
                        <h3 className="text-slate-900 font-semibold text-sm mb-6">
                            Resources
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="/tools">AI Tools DB</FooterLink>
                            <FooterLink href="/lab-tools">Lab Tools</FooterLink>
                            <FooterLink href="/trend-watch">Trend Watch</FooterLink>
                            <FooterLink href="/how-it-works">How It Works</FooterLink>
                            <FooterLink href="/about">Mission</FooterLink>
                            <FooterLink href="/feedback">Feedback</FooterLink>
                        </ul>
                    </div>

                    {/* Legal Links (Span 2) */}
                    <div className="lg:col-span-2">
                        <h3 className="text-slate-900 font-semibold text-sm mb-6">
                            Legal
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <FooterLink href="/legal/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/legal/terms">Terms of Service</FooterLink>
                            <FooterLink href="/legal/cookies">Cookie Policy</FooterLink>
                            <FooterLink href="/legal/data-governance">Data Governance</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p>&copy; 2026 NOVAI INTELLIGENCE. All rights reserved.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <a href="https://aether-architect.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
                                <Zap className="w-3 h-3" />
                                Powered by Aether
                            </a>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Los Angeles, CA</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                <span className="w-0 group-hover:w-2 h-[1px] bg-blue-600 transition-all duration-300"></span>
                {children}
            </Link>
        </li>
    );
}


