export function NovaiLogo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Premium Geometric Shield - Deeper Royal Blue */}
            <path
                d="M20 4L6 9.5V18C6 26.5 12 34 20 37.5C28 34 34 26.5 34 18V9.5L20 4Z"
                fill="#1E40AF"
            />

            {/* Inner Reflection/Detail for Depth (Subtle) */}
            <path
                d="M20 4L6 9.5V18C6 18.5 6.1 19 6.2 19.5L20 5.5L33.8 19.5C33.9 19 34 18.5 34 18V9.5L20 4Z"
                fill="white"
                fillOpacity="0.1"
            />

            {/* Live Pulse Dot - Integrated directly into SVG for this component */}
            <circle cx="28" cy="12" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
        </svg>
    );
}
