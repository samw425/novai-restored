import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, theme = 'light' }) => {
    const textColor = theme === 'light' ? '#0F172A' : '#FFFFFF';
    const subtextColor = theme === 'light' ? '#6B7280' : '#9CA3AF';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                width="36"
                height="36"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                <defs>
                    {/* Gradient for hexagon */}
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer glow hexagon */}
                <path
                    d="M16 2L28.1244 9V23L16 30L3.87564 23V9L16 2Z"
                    stroke="url(#hexGradient)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.3"
                    filter="url(#glow)"
                />

                {/* Main hexagon with gradient */}
                <path
                    d="M16 2L28.1244 9V23L16 30L3.87564 23V9L16 2Z"
                    stroke="url(#hexGradient)"
                    strokeWidth="2"
                    fill="none"
                />

                {/* Inner Network Nodes with glow */}
                <circle cx="16" cy="16" r="3.5" fill="url(#hexGradient)" filter="url(#glow)" />
                <circle cx="16" cy="8" r="2" fill="#3B82F6" opacity="0.8" />
                <circle cx="23" cy="20" r="2" fill="#2563EB" opacity="0.8" />
                <circle cx="9" cy="20" r="2" fill="#1D4ED8" opacity="0.8" />

                {/* Connecting Lines with gradient */}
                <path d="M16 16L16 8" stroke="url(#hexGradient)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                <path d="M16 16L23 20" stroke="url(#hexGradient)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                <path d="M16 16L9 20" stroke="url(#hexGradient)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
            </svg>

            {showText && (
                <div className="flex flex-col">
                    <span className="font-bold text-xl tracking-tight leading-none" style={{ color: textColor }}>
                        NOVAI
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-widest mt-0.5" style={{ color: subtextColor }}>
                        Intelligence
                    </span>
                </div>
            )}
        </div>
    );
};
