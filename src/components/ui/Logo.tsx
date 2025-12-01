import React from 'react';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    showText?: boolean;
    theme?: 'light' | 'dark';
    onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, theme = 'light', onClick }) => {
    const textColor = theme === 'light' ? '#0F172A' : '#FFFFFF';
    const subtextColor = theme === 'light' ? '#64748B' : '#94A3B8';

    return (
        <Link href="/global-feed" onClick={onClick} className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
            <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                {/* Modern Blue Shield */}
                <path
                    d="M18 3L5 8V16C5 23.5 10.5 30.5 18 34C25.5 30.5 31 23.5 31 16V8L18 3Z"
                    fill="#2563EB"
                />

                {/* Red Blinking Status Dot - Top Right */}
                <circle
                    cx="28"
                    cy="8"
                    r="3"
                    fill="#EF4444"
                    className="animate-pulse"
                />
            </svg>

            {showText && (
                <div className="flex flex-col justify-center">
                    <span className="font-black text-xl tracking-tight leading-none" style={{ color: textColor }}>
                        NOVAI
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] mt-1" style={{ color: subtextColor }}>
                        Intelligence
                    </span>
                </div>
            )}
        </Link>
    );
};
