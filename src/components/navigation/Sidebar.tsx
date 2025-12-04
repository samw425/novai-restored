'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ProWaitlistModal } from '@/components/modals/ProWaitlistModal';
import { Calendar, Activity, Radio, FlaskConical, TrendingUp, Shield, Info, Hexagon, Bot, Scale, Wrench, Brain, Youtube, Terminal, Globe, Lock, Sparkles, ShieldAlert } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const intelligenceLinks = [
    {
        id: 'oracle',
        label: 'The Oracle',
        icon: Sparkles,
        href: '/oracle',
        tooltip: "Agentic Synthesis Engine: The God's Eye View."
    },
    {
        id: 'intelligence-brief',
        label: 'Daily Intelligence Brief',
        icon: Brain,
        href: '/intelligence-brief',
        tooltip: "AI-synthesized insights: what happened, what it means, and why it matters."
    },
];

const platformLinks = [
    {
        id: 'daily-snapshot',
        label: 'Daily Snapshot',
        icon: Calendar,
        href: '/daily-snapshot',
        tooltip: "Today's curated AI brief."
    },
    {
        id: 'future-of-code',
        label: 'Future of Code',
        icon: Terminal,
        href: '/future-of-code',
        tooltip: "Tracking the end of human coding."
    },
    {
        id: 'global-feed',
        label: 'Global Feed',
        icon: Activity,
        href: '/global-feed',
        tooltip: "Real-time stream of AI news from all sources."
    },
    {
        id: 'global-demographics',
        label: 'Global Demographics',
        icon: Globe,
        href: '/global-demographics',
        tooltip: "Real-time global census and demographic data."
    },
    {
        id: 'videos',
        label: 'Video Feed',
        icon: Youtube,
        href: '/videos',
        tooltip: "Curated high-signal AI videos and demos."
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

const knowledgeLinks = [
    {
        id: 'hacker-news',
        label: 'Hacker News',
        icon: Radio,
        href: '/hacker-news',
        tooltip: "Latest AI discussions from HN community."
    },
    {
        id: 'lab-tools',
        label: 'Lab & Tools',
        icon: FlaskConical,
        href: '/lab-tools',
        tooltip: "New AI tools, frameworks, and products worth knowing."
    },
    {
        id: 'trend-watch',
        label: 'Trend Watch',
        icon: TrendingUp,
        href: '/trend-watch',
        tooltip: "Macro trends shaping AI over weeks and months."
    },
    {
        id: 'anti-trust',
        label: 'Anti-Trust',
        icon: Scale,
        href: '/anti-trust',
        tooltip: "The Regulatory War Room. Tracking the breakup of Big Tech."
    },
    {
        id: 'war-room',
        label: 'War Room',
        icon: Shield,
        href: '/war-room',
        tooltip: "Risks, incidents, and policy heat you should watch."
    },
    {
        id: 'about',
        label: 'About Novai',
        icon: Info,
        href: '/about',
        tooltip: "Mission, Methodology, and Roadmap."
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

                {/* INTELLIGENCE GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 mt-2">
                        INTELLIGENCE
                    </h3>
                    <nav className="space-y-1">
                        {intelligenceLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center justify-between px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-purple-50 text-purple-700 font-bold'
                                                : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <link.icon className={`h-4 w-4 ${isActive ? 'text-purple-700' : 'text-gray-400 group-hover:text-purple-700'}`} />
                                                {link.label}
                                            </div>
                                            {link.id === 'oracle' && (
                                                <Sparkles className={`h-3 w-3 ${isActive ? 'text-purple-500' : 'text-gray-300 group-hover:text-purple-500'}`} />
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/videos"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/videos'
                                        ? 'bg-gray-50 text-gray-900 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Youtube className={`h-4 w-4 ${pathname === '/videos' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    Video Feed
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Curated AI Demos & Talks
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
                        {categoryLinks.filter(l => l.id !== 'us-intelligence').map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-gray-50 text-gray-900 font-semibold'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-gray-900 rounded-r-full" />
                                            )}
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
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/market-pulse"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/market-pulse'
                                        ? 'bg-gray-50 text-gray-900 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <TrendingUp className={`h-4 w-4 ${pathname === '/market-pulse' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    Market Pulse
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Live Market Data
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </div>

                {/* COMMAND CENTER GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 mt-2">
                        COMMAND CENTER
                    </h3>
                    <nav className="space-y-1">
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

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/anti-trust"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/anti-trust'
                                        ? 'bg-blue-950/10 text-blue-700 font-bold'
                                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                >
                                    <Globe className={`h-4 w-4 ${pathname === '/anti-trust' ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'}`} />
                                    Regulatory Command
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Anti-Trust & AI Sovereignty
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/us-intel"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/us-intel'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/global-demographics"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/global-demographics'
                                        ? 'bg-gray-50 text-gray-900 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Activity className={`h-4 w-4 ${pathname === '/global-demographics' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    Global Demographics
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Real-time Census Data
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </div>

                {/* KNOWLEDGE GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        KNOWLEDGE
                    </h3>
                    <nav className="space-y-1">
                        {knowledgeLinks.filter(l => l.id !== 'anti-trust' && l.id !== 'war-room').map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Tooltip key={link.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-gray-50 text-gray-900 font-semibold'
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
                    </nav>
                </div>

                {/* FOOTER */}
                <div className="mt-8 px-4 space-y-6">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-gray-400">
                        <Link href="/about" className="hover:text-gray-600 transition-colors">Docs</Link>
                        <Link href="/about" className="hover:text-gray-600 transition-colors">API</Link>
                        <Link href="/about" className="hover:text-gray-600 transition-colors">Status</Link>
                        <Link href="/about" className="hover:text-gray-600 transition-colors">Privacy</Link>
                    </div>

                    <Link href="/signup" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <span className="text-white/80">→</span>
                        GET DAILY BRIEFS
                    </Link>
                </div>

            </TooltipProvider>

            {/* PRO WAITLIST MODAL */}
            <ProWaitlistModal
                isOpen={proModalOpen}
                onClose={() => setProModalOpen(false)}
                featureName={selectedFeature}
            />
        </div>
    );
}
