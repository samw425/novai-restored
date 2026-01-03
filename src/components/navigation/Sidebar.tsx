'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ProWaitlistModal } from '@/components/modals/ProWaitlistModal';
import { Calendar, Activity, Radio, FlaskConical, TrendingUp, Shield, Info, Hexagon, Bot, Scale, Wrench, Brain, Youtube, Terminal, Globe, Lock, Sparkles, ShieldAlert, Building2, DollarSign, Dna, Atom, Rocket, Cpu } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const intelligenceLinks = [
    {
        id: 'global-feed',
        label: 'Global Feed',
        icon: Activity,
        href: '/global-feed',
        tooltip: "Real-time stream of AI news from all sources."
    },
    {
        id: 'future-of-code',
        label: 'Future of Code',
        icon: Terminal,
        href: '/future-of-code',
        tooltip: "Tracking the end of human coding."
    },
];


const categoryLinks = [
    {
        id: 'ai',
        label: 'AI News',
        icon: Hexagon,
        href: '/ai',
        tooltip: "General AI news and developments."
    },
    {
        id: 'llms',
        label: 'LLMs & Models',
        icon: Brain,
        href: '/llms',
        tooltip: "Large Language Models and architecture updates."
    },
    {
        id: 'robotics',
        label: 'Robotics',
        icon: Bot,
        href: '/robotics',
        tooltip: "Robotics and autonomous systems news."
    },
    {
        id: 'us-intelligence',
        label: 'US Intelligence',
        icon: Shield,
        href: '/us-intel',
        tooltip: 'Domestic & Foreign Ops'
    },
    {
        id: 'policy',
        label: 'Policy',
        icon: Scale,
        href: '/policy',
        tooltip: "AI regulation and governance updates."
    },
    {
        id: 'research',
        label: 'Research',
        icon: FlaskConical,
        href: '/research',
        tooltip: "Latest AI research and breakthroughs."
    },
    {
        id: 'market',
        label: 'Market',
        icon: TrendingUp,
        href: '/market',
        tooltip: "AI business and funding news."
    },
    {
        id: 'tools',
        label: 'Tools',
        icon: Wrench,
        href: '/tools',
        tooltip: "New AI tools and frameworks."
    },
    {
        id: 'biotech',
        label: 'Biotech',
        icon: Dna,
        href: '/biotech',
        tooltip: "Synthetic biology and life sciences intel."
    },
    {
        id: 'quantum',
        label: 'Quantum',
        icon: Atom,
        href: '/quantum',
        tooltip: "Quantum computing and physics breakthroughs."
    },
    {
        id: 'space',
        label: 'Space',
        icon: Rocket,
        href: '/space',
        tooltip: "Space exploration and satellite intelligence."
    },
    {
        id: 'semiconductors',
        label: 'Chips',
        icon: Cpu,
        href: '/semiconductors',
        tooltip: "Semiconductor industry and hardware updates."
    },
];

const proFeatureLinks = [
    {
        id: 'daily-brief',
        label: 'Daily Brief',
        icon: Calendar,
        href: '/pro',
        tooltip: "Unlock personalized daily AI briefs."
    },
    {
        id: 'emerging-narratives',
        label: 'Emerging Narratives',
        icon: TrendingUp,
        href: '/pro',
        tooltip: "Track developing storylines and patterns."
    },
    {
        id: 'advanced-filters',
        label: 'Advanced Filters',
        icon: Wrench,
        href: '/pro',
        tooltip: "Filter feed by source, date, and custom parameters."
    },
    {
        id: 'personalized-feed',
        label: 'Personalized Feed',
        icon: Brain,
        href: '/pro',
        tooltip: "AI-curated feed based on your interests."
    },
    {
        id: 'ai-tools-analysis',
        label: 'AI Tools & Analysis',
        icon: FlaskConical,
        href: '/pro',
        tooltip: "Deep analysis and comparison of AI tools."
    },
    {
        id: 'alerts-watchlists',
        label: 'Alerts & Watchlists',
        icon: Shield,
        href: '/pro',
        tooltip: "Custom alerts for topics and companies you track."
    },
    {
        id: 'pro-reports',
        label: 'Pro Reports',
        icon: Terminal,
        href: '/pro',
        tooltip: "In-depth analysis reports and trend forecasts."
    },
];


export function Sidebar() {
    const pathname = usePathname();
    const [proModalOpen, setProModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<string>('');

    const handleProFeatureClick = (featureName: string) => {
        setSelectedFeature(featureName);
        setProModalOpen(true);
    };

    return (
        <div className="sticky top-24 w-full min-h-[calc(100vh-6rem)] pl-4 pr-6 py-4">
            <div className="mb-8 px-4 pt-2">
                <Logo />
            </div>

            <TooltipProvider delayDuration={300}>

                {/* INTELLIGENCE GROUP - STRATEGIC */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 mt-2">
                        INTELLIGENCE
                    </h3>
                    <nav className="space-y-1">
                        {/* 1. Global Feed */}
                        {intelligenceLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-blue-50 text-blue-700 font-bold'
                                                : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
                                                }`}
                                        >
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}

                        {/* 2. War Room */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/war-room"
                                    className={`flex items-center justify-between px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/war-room'
                                        ? 'bg-red-950/10 text-red-600 font-bold'
                                        : 'text-gray-500 hover:bg-red-50 hover:text-red-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className={`h-4 w-4 ${pathname === '/war-room' ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600'}`} />
                                        War Room
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Global Conflict & Geopolitics
                            </TooltipContent>
                        </Tooltip>

                        {/* 3. US Intelligence */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/us-intel"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/us-intel'
                                        ? 'bg-slate-900 text-white'
                                        : 'text-gray-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Shield className={`h-4 w-4 ${pathname === '/us-intel' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    US Intelligence
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Agency Feeds & Dossiers
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </div>

                {/* SECTORS GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        SECTORS
                    </h3>
                    <nav className="space-y-1">
                        {/* AI News - Moved from Intelligence */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/ai"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/ai'
                                        ? 'bg-gray-100 text-gray-900 font-bold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Hexagon className={`h-4 w-4 ${pathname === '/ai' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    AI News
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                General AI news and developments.
                            </TooltipContent>
                        </Tooltip>

                        {/* Standard Categories: LLMs, Robotics, Deep Tech */}
                        {categoryLinks.filter(l => l.id === 'llms' || l.id === 'robotics' || l.id === 'semiconductors' || l.id === 'quantum' || l.id === 'space' || l.id === 'biotech').map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-gray-100 text-gray-900 font-bold'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* GLOBAL ECONOMY GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        GLOBAL ECONOMY
                    </h3>
                    <nav className="space-y-1">
                        {/* Market, Earnings, Policy */}
                        {[
                            { id: 'market', label: 'Market Pulse', icon: TrendingUp, href: '/market-pulse', tooltip: 'Live Market Data' },
                            { id: 'earnings', label: 'Earnings Hub', icon: DollarSign, href: '/earnings', tooltip: 'Corporate Intelligence' },
                            { id: 'antitrust', label: 'Anti-Trust Command', icon: Globe, href: '/anti-trust', tooltip: 'Regulatory War Room' },
                            { id: 'realestate', label: 'Real-Estate', icon: Building2, href: '/real-estate', tooltip: 'Global Property Markets' },
                            { id: 'demographics', label: 'Global Census', icon: Activity, href: '/global-demographics', tooltip: 'Real-time Vital Stats' }
                        ].map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-emerald-50 text-emerald-700 font-bold'
                                                : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
                                                }`}
                                        >
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-emerald-700' : 'text-gray-400 group-hover:text-emerald-700'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}

                        {categoryLinks.filter(l => l.id === 'policy').map((link) => (
                            <Tooltip key={link.id}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === link.href
                                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                                            : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
                                            }`}
                                    >
                                        <link.icon className={`h-4 w-4 ${pathname === link.href ? 'text-emerald-700' : 'text-gray-400 group-hover:text-emerald-700'}`} />
                                        {link.label}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                    {link.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </nav>
                </div>

                {/* KNOWLEDGE BASE GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        KNOWLEDGE BASE
                    </h3>
                    <nav className="space-y-1">
                        {/* Research, Lab, HN, Video */}
                        {categoryLinks.filter(l => l.id === 'research').map((link) => (
                            <Tooltip key={link.id}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === link.href
                                            ? 'bg-orange-50 text-orange-700 font-bold'
                                            : 'text-gray-500 hover:bg-orange-50 hover:text-orange-700'
                                            }`}
                                    >
                                        <link.icon className={`h-4 w-4 ${pathname === link.href ? 'text-orange-700' : 'text-gray-400 group-hover:text-orange-700'}`} />
                                        {link.label}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                    {link.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        ))}

                        {[
                            { id: 'tools', label: 'Signal Tools', icon: Wrench, href: '/lab-tools', tooltip: 'Next-gen AI utilities' },
                            { id: 'hn', label: 'Hacker News', icon: Radio, href: '/hacker-news', tooltip: 'Community Pulse' },
                            { id: 'videos', label: 'Alpha Stream', icon: Youtube, href: '/videos', tooltip: 'Curated AI demos' }
                        ].map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-orange-50 text-orange-700 font-bold'
                                                : 'text-gray-500 hover:bg-orange-50 hover:text-orange-700'
                                                }`}
                                        >
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-orange-700' : 'text-gray-400 group-hover:text-orange-700'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* PRO FEATURES GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 flex items-center gap-2">
                        PRO FEATURES <span className="text-[9px] bg-gradient-to-r from-purple-600 to-blue-600 text-white px-1.5 py-0.5 rounded-full">BETA</span>
                    </h3>
                    <nav className="space-y-1">
                        {/* The Oracle */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/oracle"
                                    className={`flex items-center justify-between px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/oracle'
                                        ? 'bg-purple-50 text-purple-700 font-bold'
                                        : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Sparkles className={`h-4 w-4 ${pathname === '/oracle' ? 'text-purple-700' : 'text-gray-400 group-hover:text-purple-700'}`} />
                                        The Oracle
                                    </div>
                                    <Lock className="w-3 h-3 text-gray-300" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Agentic Synthesis Engine: The God&apos;s Eye View.
                            </TooltipContent>
                        </Tooltip>

                        {/* Other Pro Features */}
                        {proFeatureLinks.map((link) => (
                            <Tooltip key={link.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => handleProFeatureClick(link.label)}
                                        className="w-full flex items-center justify-between px-4 h-10 rounded-lg text-[13px] font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <link.icon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                                            {link.label}
                                        </div>
                                        <Lock className="h-3 w-3 text-gray-300" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                    {link.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </nav>
                </div>

                {/* SYSTEM GROUP */}
                <div className="mb-auto">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        SYSTEM
                    </h3>
                    <nav className="space-y-1">
                        <Link
                            href="/feedback"
                            className="flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                            <Info className="h-4 w-4 text-gray-400" />
                            Feedback
                        </Link>
                        <Link
                            href="/support"
                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all ${pathname === '/support'
                                ? 'bg-purple-50 text-purple-700 font-bold'
                                : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <span className="flex items-center justify-center h-4 w-4 text-[10px] font-bold border border-current rounded-full">❤</span>
                            Support Novai
                        </Link>
                    </nav>
                </div>

                <div className="mt-8 px-4 space-y-6">
                </div>
            </TooltipProvider>

            <ProWaitlistModal
                isOpen={proModalOpen}
                onClose={() => setProModalOpen(false)}
                featureName={selectedFeature}
            />
        </div>
    );
}

