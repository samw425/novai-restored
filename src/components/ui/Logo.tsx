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
        <Link href="/global-feed" onClick={onClick} className={`flex items-center gap-3 cursor-pointer group ${className}`}>
            <div className="relative flex items-center justify-center">
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transform transition-transform group-hover:scale-105 duration-300 ease-out"
                >
                    {/* Premium Geometric Shield - Deeper Royal Blue */}
                    <path
                        d="M20 4L6 9.5V18C6 26.5 12 34 20 37.5C28 34 34 26.5 34 18V9.5L20 4Z"
                        fill="#1E40AF" 
                        className="drop-shadow-sm"
                    />
                    
                    {/* Inner Reflection/Detail for Depth (Subtle) */}
                    <path
                        d="M20 4L6 9.5V18C6 18.5 6.1 19 6.2 19.5L20 5.5L33.8 19.5C33.9 19 34 18.5 34 18V9.5L20 4Z"
                        fill="white"
                        fillOpacity="0.1"
                    />
                </svg>

                {/* Live Pulse Dot - Perfectly Positioned */}
                <div className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border-2 border-white"></span>
                </div>
            </div>

            {showText && (
                <div className="flex flex-col justify-center -space-y-0.5">
                    <span className="font-extrabold text-xl tracking-tighter leading-none" style={{ color: textColor }}>
                        NOVAI
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Intelligence
                    </span>
                </div>
            )}
        </Link>
    );
};
