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
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                <defs>
                    <linearGradient id="novaiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" /> {/* Electric Blue (Blue-600) */}
                        <stop offset="50%" stopColor="#3B82F6" /> {/* Bright Blue (Blue-500) */}
                        <stop offset="100%" stopColor="#22D3EE" /> {/* Cyan-400 (Pop) */}
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Abstract Neural Prism Shape */}
                <g filter="url(#glow)">
                    {/* Main Triangle Path */}
                    <path
                        d="M20 4L34 32H6L20 4Z"
                        stroke="url(#novaiGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.9"
                    />

                    {/* Internal Connection Network */}
                    <path
                        d="M20 14V24M14 28L20 24M26 28L20 24"
                        stroke="url(#novaiGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Nodes */}
                    <circle cx="20" cy="14" r="2" fill="white" stroke="#2563EB" strokeWidth="1.5" />
                    <circle cx="14" cy="28" r="2" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
                    <circle cx="26" cy="28" r="2" fill="white" stroke="#22D3EE" strokeWidth="1.5" />

                    {/* Central Core */}
                    <circle cx="20" cy="24" r="3" fill="url(#novaiGradient)" />
                </g>
            </svg>

            {showText && (
                <div className="flex flex-col justify-center">
                    <span className="font-bold text-xl tracking-tight leading-none font-sans" style={{ color: textColor }}>
                        NOVAI
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: subtextColor }}>
                        Intelligence
                    </span>
                </div>
            )}
        </div>
    );
};
