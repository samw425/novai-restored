import React from 'react';
import { SystemStatus } from './right-rail/SystemStatus';
import { BreakthroughSpotlight } from './right-rail/BreakthroughSpotlight';
import { TrendingTopics } from './right-rail/TrendingTopics';
import { ToolOfTheDay } from './right-rail/ToolOfTheDay';
import { AboutSummary } from './right-rail/AboutSummary';

export function RightRail() {
    return (
        <div className="space-y-6 sticky top-24">
            <SystemStatus />
            <BreakthroughSpotlight />
            <TrendingTopics />
            <ToolOfTheDay />
            <AboutSummary />
        </div>
    );
}
