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
        id: 'robotics',
        label: 'Robotics',
        icon: Bot,
        href: '/robotics',
        tooltip: "Robotics and autonomous systems news."
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
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="sticky top-24 w-full bg-[#F3F4F6] min-h-[calc(100vh-6rem)] rounded-xl p-4 border border-[#E5E7EB]">
            <div className="mb-6 px-4">
                <Logo />
            </div>

            <TooltipProvider delayDuration={300}>

                {/* INTELLIGENCE GROUP */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2 px-4 mt-2">
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
                                            className={`flex items-center gap-3 px-4 h-10 rounded-full text-sm transition-all group relative overflow-hidden ${isActive
                                                ? 'bg-[#E0ECFF] text-[#1D4ED8] font-medium'
                                                : 'text-[#4B5563] hover:bg-[#E5F0FF] hover:text-[#1D4ED8]'
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#2563EB] rounded-r-full" />
                                            )}
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* PLATFORM GROUP */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2 px-4 mt-2">
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
                                            className={`flex items-center gap-3 px-4 h-10 rounded-full text-sm transition-all group relative overflow-hidden ${isActive
                                                ? 'bg-[#E0ECFF] text-[#1D4ED8] font-medium'
                                                : 'text-[#4B5563] hover:bg-[#E5F0FF] hover:text-[#1D4ED8]'
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#2563EB] rounded-r-full" />
                                            )}
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* CATEGORIES GROUP */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2 px-4">
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
                                            className={`flex items-center gap-3 px-4 h-10 rounded-full text-sm transition-all group relative overflow-hidden ${isActive
                                                ? 'bg-[#E0ECFF] text-[#1D4ED8] font-medium'
                                                : 'text-[#4B5563] hover:bg-[#E5F0FF] hover:text-[#1D4ED8]'
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#2563EB] rounded-r-full" />
                                            )}
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* KNOWLEDGE GROUP */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2 px-4">
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
                                            className={`flex items-center gap-3 px-4 h-10 rounded-full text-sm transition-all group relative overflow-hidden ${isActive
                                                ? 'bg-[#E0ECFF] text-[#1D4ED8] font-medium'
                                                : 'text-[#4B5563] hover:bg-[#E5F0FF] hover:text-[#1D4ED8]'
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#2563EB] rounded-r-full" />
                                            )}
                                            <link.icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'}`} />
                                            {link.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none">
                                        {link.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* MARKETS GROUP */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2 px-4">
                        MARKETS
                    </h3>
                    <nav className="space-y-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/market-pulse"
                                    className={`flex items-center gap-3 px-4 h-10 rounded-full text-sm transition-all group relative overflow-hidden ${pathname === '/market-pulse'
                                        ? 'bg-[#E0ECFF] text-[#1D4ED8] font-medium'
                                        : 'text-[#4B5563] hover:bg-[#E5F0FF] hover:text-[#1D4ED8]'
                                        }`}
                                >
                                    {pathname === '/market-pulse' && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-[#2563EB] rounded-r-full" />
                                    )}
                                    <TrendingUp className={`h-4 w-4 ${pathname === '/market-pulse' ? 'text-[#2563EB]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'}`} />
                                    Market Pulse
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs bg-gray-900 text-white border-none">
                                Live AI & Robotics market data.
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </div>

                {/* SYSTEM GROUP */}
                <div className="mb-auto">
                    <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2 px-4">
                        SYSTEM
                    </h3>
                    <nav className="space-y-1">
                        <Link
                            href="/feedback"
                            className="flex items-center gap-3 px-4 h-10 rounded-full text-sm text-[#4B5563] hover:bg-[#E5F0FF] hover:text-[#1D4ED8] transition-all"
                        >
                            <Info className="h-4 w-4 text-[#9CA3AF]" />
                            Feedback
                        </Link>
                    </nav>
                </div>

                {/* FOOTER */}
                <div className="mt-8 px-4 space-y-6">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-gray-400">
                        <Link href="/about" className="hover:text-gray-600">Docs</Link>
                        <Link href="/about" className="hover:text-gray-600">API</Link>
                        <Link href="/about" className="hover:text-gray-600">Status</Link>
                        <Link href="/about" className="hover:text-gray-600">Privacy</Link>
                    </div>

                    <Link href="/signup" className="w-full bg-[#0F172A] text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
                        <span className="text-gray-400">→</span>
                        GET DAILY BRIEFS
                    </Link>
                </div>

            </TooltipProvider>
        </div>
    );
}
