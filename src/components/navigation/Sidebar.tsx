'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Calendar, Activity, Radio, FlaskConical, TrendingUp, Shield, Info, Hexagon, Bot, Scale, Wrench, Brain } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const intelligenceLinks = [
    {
        id: 'intelligence-brief',
        label: 'Intelligence Brief',
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
        id: 'global-feed',
        label: 'Global Feed',
        icon: Activity,
        href: '/global-feed',
        tooltip: "Real-time stream of AI news from all sources."
    },
    {
        id: 'live-wire',
        label: 'Live Wire',
        icon: Radio,
        href: '/live-wire',
        tooltip: "Raw, unfiltered real-time intelligence stream."
    },
    {
        id: 'deep-signals',
        label: 'Deep Signals',
        icon: Radio,
        href: '/deep-signals',
        tooltip: "High-impact patterns and analysis behind the news."
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
        id: 'cyber-intel',
        label: 'Cyber Intel',
        icon: Shield,
        href: '/cyber-intel',
        tooltip: "Cybersecurity threats and defense intelligence."
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

    return (
        <div className="sticky top-24 w-full bg-white/80 backdrop-blur-xl min-h-[calc(100vh-6rem)] rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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
                                            className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${isActive
                                                ? 'bg-gray-900 text-white shadow-md'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
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

                {/* PLATFORM GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 mt-2">
                        PLATFORM
                    </h3>
                    <nav className="space-y-1">
                        {platformLinks.map((link) => {
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
                    </nav>
                </div>

                {/* CATEGORIES GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        CATEGORIES
                    </h3>
                    <nav className="space-y-1">
                        {categoryLinks.map((link) => {
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
                    </nav>
                </div>

                {/* KNOWLEDGE GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        KNOWLEDGE
                    </h3>
                    <nav className="space-y-1">
                        {knowledgeLinks.map((link) => {
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
                    </nav>
                </div>

                {/* MARKETS GROUP */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                        MARKETS
                    </h3>
                    <nav className="space-y-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/market-pulse"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium transition-all group relative ${pathname === '/market-pulse'
                                        ? 'bg-gray-50 text-gray-900 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {pathname === '/market-pulse' && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-gray-900 rounded-r-full" />
                                    )}
                                    <TrendingUp className={`h-4 w-4 ${pathname === '/market-pulse' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    Market Pulse
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none shadow-xl">
                                Live AI & Robotics market data.
                            </TooltipContent>
                        </Tooltip>
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
        </div>
    );
}
