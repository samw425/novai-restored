export enum View {
    GLOBAL_FEED = 'GLOBAL_FEED',
    DAILY_SNAPSHOT = 'DAILY_SNAPSHOT',
    DEEP_SIGNALS = 'DEEP_SIGNALS',
    LAB_TOOLS = 'LAB_TOOLS',
    TREND_WATCH = 'TREND_WATCH',
    WAR_ROOM = 'WAR_ROOM',
    AUTH = 'AUTH',
    PROFILE = 'PROFILE',
    FEEDBACK = 'FEEDBACK',
}

export interface UserPreferences {
    categories: string[];
    sources: string[];
    alerts: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    plan: 'Free' | 'Pro' | 'Enterprise';
    preferences: UserPreferences;
}

export interface Article {
    id: string;
    source: string;
    title: string;
    summary: string;
    description?: string;
    publishedAt: string; // ISO string
    publishedAt: string; // ISO string
    category: string;
    topicSlug: string;
    importanceScore: number;
    url: string; // Link to the real article
    relatedLinks?: { title: string; url: string }[];
}

export interface MarketTicker {
    symbol: string;
    price: number;
    changePercent: number;
    data: { time: string; value: number }[]; // For sparkline
}

export interface Tool {
    id: string;
    name: string;
    tagline: string;
    description: string;
    category: string;
    pricing: 'Free' | 'Paid' | 'Freemium';
    isToolOfTheDay?: boolean;
}

export interface RiskEvent {
    id: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    date: string;
}

export interface Trend {
    id: string;
    name: string;
    growth: number; // percentage
    description: string;
    data: { day: string; value: number }[];
}

export interface Signal {
    id: string;
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    horizon: 'Immediate' | '6 Months' | '1-2 Years' | '5+ Years';
    confidenceScore: number; // 0-100
    sourceCount: number;
}

export interface DailyBriefing {
    id: string;
    date: string;
    headline: string;
    summary: string;
    statOfTheDay: { value: string; label: string };
    marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
    topStories: Article[];
}

// Legacy type alias for backwards compatibility
export type Category = 'ai' | 'research' | 'robotics' | 'policy' | 'market' | 'tools';
