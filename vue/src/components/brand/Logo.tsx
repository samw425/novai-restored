import React from 'react';

// VUE Logo - A stylized "eye" representing "view" with a signal wave
// Color: Maroon (#991B1B)

interface LogoProps {
    size?: number;
    className?: string;
}

const VUE_RED = '#DC2626';

export const VueLogo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer signal rings */}
            <circle cx="50" cy="50" r="45" stroke={VUE_RED} strokeWidth="2" opacity="0.3" />
            <circle cx="50" cy="50" r="35" stroke={VUE_RED} strokeWidth="2" opacity="0.5" />

            {/* Main eye shape */}
            <path
                d="M10 50C10 50 30 25 50 25C70 25 90 50 90 50C90 50 70 75 50 75C30 75 10 50 10 50Z"
                stroke={VUE_RED}
                strokeWidth="3"
                fill="none"
            />

            {/* Iris */}
            <circle cx="50" cy="50" r="15" fill={VUE_RED} />

            {/* Pupil */}
            <circle cx="50" cy="50" r="6" fill="#000000" />

            {/* Highlight */}
            <circle cx="45" cy="46" r="3" fill="#FFFFFF" opacity="0.8" />
        </svg>
    );
};

// Text logo with custom styling
export const VueWordmark: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <span className={`font-black tracking-[-0.05em] ${className}`}>
            <span className="text-white">V</span>
            <span style={{ color: VUE_RED }}>U</span>
            <span className="text-white">E</span>
        </span>
    );
};

// Combined logo + wordmark
export const VueBrand: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <VueLogo size={size} />
            <VueWordmark className="text-2xl" />
        </div>
    );
};

export default VueLogo;
