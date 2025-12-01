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
                    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E3A8A" /> {/* Deep Navy */}
                        <stop offset="100%" stopColor="#2563EB" /> {/* Electric Blue */}
                    </linearGradient>
                    <linearGradient id="nGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E0F2FE" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Main Shield Shape */}
                <path
                    d="M20 2L6 8V18C6 26.5 12 34 20 38C28 34 34 26.5 34 18V8L20 2Z"
                    fill="url(#shieldGradient)"
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                    filter="url(#glow)"
                />

                {/* The "N" Monogram */}
                <path
                    d="M14 13V27L26 13V27"
                    stroke="url(#nGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Signal Dot */}
                <circle cx="26" cy="13" r="1.5" fill="#EF4444" className="animate-pulse" />
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
