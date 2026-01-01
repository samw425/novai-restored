'use client';

import { useEffect, useState } from 'react';
import { Globe, Zap, Shield, TrendingUp, Radio, Cpu, Building2, DollarSign, Newspaper, Eye, Radar, Lock, Satellite, FileText, Scale } from 'lucide-react';

interface IntelligentLoaderProps {
    context?: 'global' | 'war-room' | 'us-intel' | 'earnings' | 'ai' | 'robotics' | 'market' | 'antitrust' | 'hacker-news' | 'default';
    size?: 'sm' | 'md' | 'lg';
    inline?: boolean; // For inline spinners vs full container loaders
}

// Context-specific configurations
const contextConfigs = {
    'global': {
        title: 'Novai Intelligence Engine',
        subtitle: 'Aggregating real-time intelligence',
        sources: '109+',
        sourceLabel: 'global sources',
        steps: [
            { text: 'Connecting to secure feeds...', icon: Lock },
            { text: 'Scanning news networks...', icon: Newspaper },
            { text: 'Processing OSINT data...', icon: Radio },
            { text: 'Synthesizing intelligence...', icon: Cpu },
        ],
        accentColor: 'indigo',
    },
    'war-room': {
        title: 'War Room Command',
        subtitle: 'Establishing secure uplink',
        sources: '47+',
        sourceLabel: 'conflict monitoring feeds',
        steps: [
            { text: 'Connecting to satellite networks...', icon: Satellite },
            { text: 'Scanning global hotspots...', icon: Radar },
            { text: 'Processing threat vectors...', icon: Shield },
            { text: 'Mapping active conflicts...', icon: Globe },
        ],
        accentColor: 'red',
    },
    'us-intel': {
        title: 'US Intelligence Network',
        subtitle: 'Secure agency connection',
        sources: '12',
        sourceLabel: 'federal agencies',
        steps: [
            { text: 'Authenticating secure channels...', icon: Lock },
            { text: 'Connecting to agency feeds...', icon: Building2 },
            { text: 'Retrieving classified briefs...', icon: FileText },
            { text: 'Compiling intelligence report...', icon: Eye },
        ],
        accentColor: 'blue',
    },
    'earnings': {
        title: 'Market Intelligence',
        subtitle: 'Connecting to financial networks',
        sources: '25+',
        sourceLabel: 'market data providers',
        steps: [
            { text: 'Connecting to SEC EDGAR...', icon: Building2 },
            { text: 'Scanning earnings calendars...', icon: TrendingUp },
            { text: 'Processing market signals...', icon: DollarSign },
            { text: 'Compiling financial intel...', icon: Zap },
        ],
        accentColor: 'emerald',
    },
    'ai': {
        title: 'AI Research Scanner',
        subtitle: 'Analyzing innovation landscape',
        sources: '35+',
        sourceLabel: 'research sources',
        steps: [
            { text: 'Connecting to research networks...', icon: Cpu },
            { text: 'Scanning AI publications...', icon: FileText },
            { text: 'Processing breakthrough signals...', icon: Zap },
            { text: 'Synthesizing insights...', icon: Eye },
        ],
        accentColor: 'purple',
    },
    'robotics': {
        title: 'Robotics Intelligence',
        subtitle: 'Scanning automation sector',
        sources: '20+',
        sourceLabel: 'industry sources',
        steps: [
            { text: 'Connecting to industry feeds...', icon: Cpu },
            { text: 'Scanning robotics news...', icon: Newspaper },
            { text: 'Processing innovation data...', icon: Zap },
            { text: 'Compiling sector report...', icon: FileText },
        ],
        accentColor: 'cyan',
    },
    'market': {
        title: 'Market Command',
        subtitle: 'Real-time market intelligence',
        sources: '15+',
        sourceLabel: 'financial feeds',
        steps: [
            { text: 'Connecting to market feeds...', icon: TrendingUp },
            { text: 'Scanning price movements...', icon: DollarSign },
            { text: 'Processing trading signals...', icon: Zap },
            { text: 'Analyzing market sentiment...', icon: Eye },
        ],
        accentColor: 'green',
    },
    'antitrust': {
        title: 'Regulatory Monitor',
        subtitle: 'Scanning regulatory landscape',
        sources: '10+',
        sourceLabel: 'legal sources',
        steps: [
            { text: 'Connecting to legal databases...', icon: Scale },
            { text: 'Scanning regulatory filings...', icon: FileText },
            { text: 'Processing compliance data...', icon: Building2 },
            { text: 'Compiling legal intel...', icon: Eye },
        ],
        accentColor: 'amber',
    },
    'hacker-news': {
        title: 'Tech Community Feed',
        subtitle: 'Scanning developer networks',
        sources: '5+',
        sourceLabel: 'tech communities',
        steps: [
            { text: 'Connecting to HN API...', icon: Cpu },
            { text: 'Scanning top stories...', icon: Newspaper },
            { text: 'Processing discussions...', icon: Radio },
            { text: 'Ranking by engagement...', icon: TrendingUp },
        ],
        accentColor: 'orange',
    },
    'default': {
        title: 'Novai Intelligence',
        subtitle: 'Loading data',
        sources: '100+',
        sourceLabel: 'sources',
        steps: [
            { text: 'Establishing connection...', icon: Lock },
            { text: 'Fetching data...', icon: Newspaper },
            { text: 'Processing...', icon: Cpu },
            { text: 'Preparing display...', icon: Eye },
        ],
        accentColor: 'slate',
    },
};

const accentColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', glow: 'shadow-green-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
    slate: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/30', glow: 'shadow-slate-500/20' },
};

export function IntelligentLoader({ context = 'default', size = 'md', inline = false }: IntelligentLoaderProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const config = contextConfigs[context];
    const colors = accentColors[config.accentColor];

    useEffect(() => {
        // Cycle through steps
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % config.steps.length);
        }, 1200);

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return 95; // Never quite reach 100 while loading
                return prev + Math.random() * 8;
            });
        }, 200);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, [config.steps.length]);

    const CurrentIcon = config.steps[currentStep].icon;

    // Inline loader (small spinner with text)
    if (inline) {
        return (
            <div className="flex items-center gap-3 py-4">
                <div className={`w-6 h-6 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                    <CurrentIcon className={`w-3.5 h-3.5 ${colors.text} animate-pulse`} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{config.steps[currentStep].text}</span>
                    <span className="text-xs text-muted">{config.sources} {config.sourceLabel}</span>
                </div>
            </div>
        );
    }

    // Size configurations
    const sizeConfig = {
        sm: { container: 'py-8', icon: 'w-10 h-10', iconInner: 'w-5 h-5', title: 'text-sm', subtitle: 'text-xs' },
        md: { container: 'py-16', icon: 'w-14 h-14', iconInner: 'w-7 h-7', title: 'text-lg', subtitle: 'text-sm' },
        lg: { container: 'py-24', icon: 'w-20 h-20', iconInner: 'w-10 h-10', title: 'text-2xl', subtitle: 'text-base' },
    };

    const s = sizeConfig[size];

    return (
        <div className={`flex flex-col items-center justify-center ${s.container} px-4`}>
            {/* Animated Icon Container */}
            <div className="relative mb-6">
                {/* Outer pulsing ring */}
                <div className={`absolute inset-0 ${s.icon} rounded-2xl ${colors.border} border-2 animate-ping opacity-20`} />

                {/* Icon box */}
                <div className={`relative ${s.icon} rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-xl ${colors.glow}`}>
                    <CurrentIcon className={`${s.iconInner} ${colors.text} transition-all duration-300`} />
                </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className={`${s.title} font-bold text-foreground mb-1 tracking-tight`}>
                {config.title}
            </h3>
            <p className={`${s.subtitle} text-muted mb-4`}>
                {config.subtitle}
            </p>

            {/* Source count badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.border} border mb-6`}>
                <span className={`${s.subtitle} font-bold ${colors.text}`}>{config.sources}</span>
                <span className={`${s.subtitle} text-muted`}>{config.sourceLabel}</span>
            </div>

            {/* Current step indicator */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${colors.text} bg-current animate-pulse`} />
                <span className={`${s.subtitle} font-mono text-muted uppercase tracking-wider`}>
                    {config.steps[currentStep].text}
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs">
                <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.text} bg-current rounded-full transition-all duration-300 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

// Simple inline loader for feeds
export function FeedLoader({ context = 'default' }: { context?: IntelligentLoaderProps['context'] }) {
    return <IntelligentLoader context={context} size="md" />;
}

// Minimal loading indicator for infinite scroll
export function InfiniteScrollLoader({ context = 'default' }: { context?: IntelligentLoaderProps['context'] }) {
    return <IntelligentLoader context={context} size="sm" inline />;
}
