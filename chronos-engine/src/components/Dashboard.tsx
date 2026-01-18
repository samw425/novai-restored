/**
 * THE EXISTENTIAL DASHBOARD (Rebuilt V3)
 * 
 * Pure "Raised" Neomorphism.
 */

import { useState, useEffect } from 'react';
import type { GlobalState } from '../lib/types';

interface DailyRhyme {
    modern: string;
    historical: string;
    explanation: string;
}

interface DashboardProps {
    state: GlobalState;
    dailyRhyme?: DailyRhyme;
    onOverviewClick: () => void;
    onDeepWorkClick: () => void;
}

function NeomorphicMetric({ label, value, desc }: { label: string; value: number; desc: string }) {
    // 0-100% Protection
    const safeVal = Math.max(0, Math.min(100, Math.round((value || 0) * 100)));

    return (
        <div className="neomorph-card">
            <div className="metric-header">
                <span className="metric-name">{label}</span>
                <span className="metric-value">{safeVal}%</span>
            </div>
            <p className="metric-desc">{desc}</p>
        </div>
    );
}

export function Dashboard({ state, dailyRhyme, onOverviewClick, onDeepWorkClick }: DashboardProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <aside className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="logo-well">
                    <img src="/logo.svg" alt="Chronos" className="logo-img" />
                </div>
                <div>
                    <h1 className="brand-title">CHRONOS</h1>
                    <p className="brand-subtitle">Temporal Engine</p>
                </div>
            </header>

            {/* Status Orb */}
            <div className="status-pill">
                <div className="status-dot"></div>
                <span className="status-text">SYSTEM ONLINE &bull; {time.toLocaleTimeString()}</span>
            </div>

            {/* Metrics */}
            <div className="metrics-container">
                <NeomorphicMetric
                    label="Cosmic Turbulence"
                    value={state.cosmic_turbulence}
                    desc="Solar flux deviation & geomagnetic instability."
                />
                <NeomorphicMetric
                    label="Human Resonance"
                    value={state.human_sentiment}
                    desc="Global emotional entropy & collective coherence."
                />
                <NeomorphicMetric
                    label="Existential Align"
                    value={state.existential_alignment}
                    desc="Correspondence between current events & history."
                />
            </div>

            {/* Daily Rhyme */}
            {dailyRhyme && (
                <div className="daily-rhyme">
                    <span className="rhyme-label">Temporal Echo</span>
                    <p className="rhyme-content">"{dailyRhyme.modern}"</p>
                    <p className="rhyme-historical">...rhymes with {dailyRhyme.historical}</p>
                </div>
            )}

            {/* Actions */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                <button onClick={onOverviewClick} className="neomorph-card" style={{ flex: 1, padding: '16px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none' }}>
                    Reset View
                </button>
                <button onClick={onDeepWorkClick} className="neomorph-card" style={{ flex: 1, padding: '16px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none' }}>
                    Deep Work
                </button>
            </div>
        </aside>
    );
}

export default Dashboard;
