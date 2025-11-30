export function NovaiLogo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer Neural Ring */}
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
            />

            {/* Signal Wave/Data Stream */}
            <path
                d="M 20 50 Q 30 30, 40 50 T 60 50 T 80 50"
                stroke="url(#gradient2)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            />

            {/* Central Node */}
            <circle
                cx="50"
                cy="50"
                r="8"
                fill="url(#gradient3)"
            />

            {/* Neural Connection Points */}
            <circle cx="30" cy="35" r="3" fill="#4F46E5" opacity="0.6" />
            <circle cx="50" cy="25" r="3" fill="#4F46E5" opacity="0.8" />
            <circle cx="70" cy="35" r="3" fill="#14B8A6" opacity="0.6" />
            <circle cx="75" cy="55" r="3" fill="#14B8A6" opacity="0.8" />

            {/* Connection Lines */}
            <line x1="30" y1="35" x2="50" y2="50" stroke="#4F46E5" strokeWidth="1" opacity="0.3" />
            <line x1="50" y1="25" x2="50" y2="50" stroke="#4F46E5" strokeWidth="1" opacity="0.3" />
            <line x1="70" y1="35" x2="50" y2="50" stroke="#14B8A6" strokeWidth="1" opacity="0.3" />
            <line x1="75" y1="55" x2="50" y2="50" stroke="#14B8A6" strokeWidth="1" opacity="0.3" />

            {/* Gradients */}
            <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
                <radialGradient id="gradient3">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </radialGradient>
            </defs>
        </svg>
    );
}
