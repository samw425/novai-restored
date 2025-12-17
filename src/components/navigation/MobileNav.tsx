'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Menu, X, Calendar, Activity, Radio, FlaskConical, TrendingUp, Shield, Info, Hexagon, Bot, Scale, Wrench, Brain, Youtube, Globe, Terminal, DollarSign } from 'lucide-react';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                onClick={closeMenu}
                className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-all border-l-2 ${isActive
                    ? 'bg-slate-50 border-[#0F172A] text-[#0F172A]'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
            >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#0F172A]' : 'text-slate-400'}`} strokeWidth={isActive ? 2 : 1.5} />
                <span className={isActive ? 'font-bold' : ''}>{label}</span>
            </Link>
        );
    };

    return (
        <div className="lg:hidden">
            {/* Top Bar - Solid, Premium Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[100] px-4 flex items-center justify-between shadow-sm">
                <Logo onClick={closeMenu} />
                <button
                    onClick={toggleMenu}
                    className="p-2 text-[#0F172A] hover:bg-slate-50 rounded-full transition-colors active:scale-95"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Spacer */}
            <div className="h-16" />

            {/* Full Screen Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-16 bg-white z-[99] overflow-y-auto pb-32 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-6 space-y-8">

                        {/* INTELLIGENCE (Platform) */}
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-6 font-mono">Intelligence</h3>
                            <div className="space-y-0.5">
                                <NavLink href="/global-feed" icon={Activity} label="Global Feed" />
                                <NavLink href="/intelligence-brief" icon={Brain} label="Daily Intelligence Brief" />
                                <NavLink href="/daily-snapshot" icon={Calendar} label="Daily Snapshot" />
                                <NavLink href="/earnings" icon={DollarSign} label="Earnings Hub" />
                                <NavLink href="/future-of-code" icon={Terminal} label="Future of Code" />
                                <NavLink href="/videos" icon={Youtube} label="Video Feed" />
                            </div>
                        </div>

                        {/* SECTORS (Categories) */}
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-6 font-mono">Sectors</h3>
                            <div className="space-y-0.5">
                                <NavLink href="/ai" icon={Hexagon} label="AI News" />
                                <NavLink href="/llms" icon={Brain} label="LLMs & Models" />
                                <NavLink href="/robotics" icon={Bot} label="Robotics" />
                                <NavLink href="/policy" icon={Scale} label="Policy" />
                                <NavLink href="/research" icon={FlaskConical} label="Research" />
                                <NavLink href="/market" icon={TrendingUp} label="Market" />
                                <NavLink href="/tools" icon={Wrench} label="Tools" />
                            </div>
                        </div>

                        {/* COMMAND CENTER */}
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-6 font-mono">Command Center</h3>
                            <div className="space-y-0.5">
                                <NavLink href="/war-room" icon={Shield} label="War Room" />
                                <NavLink href="/anti-trust" icon={Globe} label="Regulatory Command" />
                                <NavLink href="/us-intel" icon={Shield} label="US Intelligence" />
                                <NavLink href="/global-demographics" icon={Globe} label="Global Demographics" />
                            </div>
                        </div>

                        {/* KNOWLEDGE */}
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-6 font-mono">Knowledge</h3>
                            <div className="space-y-0.5">
                                <NavLink href="/hacker-news" icon={Radio} label="Hacker News" />
                                <NavLink href="/lab-tools" icon={FlaskConical} label="Lab & Tools" />
                                <NavLink href="/trend-watch" icon={TrendingUp} label="Trend Watch" />
                            </div>
                        </div>

                        {/* SYSTEM */}
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-6 font-mono">System</h3>
                            <div className="space-y-0.5">
                                <NavLink href="/feedback" icon={Info} label="Feedback" />
                                <NavLink href="/support" icon={Activity} label="Support Novai" />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-6 pt-4">
                            <Link
                                href="/signup"
                                onClick={closeMenu}
                                className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                            >
                                GET DAILY BRIEFS
                            </Link>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
