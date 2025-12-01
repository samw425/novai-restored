'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Menu, X, Calendar, Activity, Radio, FlaskConical, TrendingUp, Shield, Info, Hexagon, Bot, Scale, Wrench } from 'lucide-react';

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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="lg:hidden">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 px-4 flex items-center justify-between">
                <Link href="/global-feed" onClick={closeMenu}>
                    <Logo />
                </Link>
                <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-16" />

            {/* Full Screen Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-16 bg-white z-30 overflow-y-auto pb-20 animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="p-4 space-y-8">

                        {/* Platform */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Platform</h3>
                            <div className="space-y-1">
                                <NavLink href="/daily-snapshot" icon={Calendar} label="Daily Snapshot" />
                                <NavLink href="/global-feed" icon={Activity} label="Global Feed" />
                                <NavLink href="/deep-signals" icon={Radio} label="Deep Signals" />
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Categories</h3>
                            <div className="space-y-1">
                                <NavLink href="/ai" icon={Hexagon} label="AI News" />
                                <NavLink href="/robotics" icon={Bot} label="Robotics" />
                                <NavLink href="/policy" icon={Scale} label="Policy" />
                                <NavLink href="/research" icon={FlaskConical} label="Research" />
                                <NavLink href="/market" icon={TrendingUp} label="Market" />
                                <NavLink href="/tools" icon={Wrench} label="Tools" />
                            </div>
                        </div>

                        {/* Knowledge */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Knowledge</h3>
                            <div className="space-y-1">
                                <NavLink href="/hacker-news" icon={Radio} label="Hacker News" />
                                <NavLink href="/lab-tools" icon={FlaskConical} label="Lab & Tools" />
                                <NavLink href="/trend-watch" icon={TrendingUp} label="Trend Watch" />
                                <NavLink href="/war-room" icon={Shield} label="War Room" />
                            </div>
                        </div>

                        {/* System */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">System</h3>
                            <div className="space-y-1">
                                <NavLink href="/feedback" icon={Info} label="Feedback" />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            <Link
                                href="/signup"
                                onClick={closeMenu}
                                className="w-full bg-[#0F172A] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
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
