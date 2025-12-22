import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Novai Intelligence - The Global Intelligence Terminal';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#020617', // Slate 950
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1e3a8a 0%, #020617 70%)', // Blue 900 to Slate 950
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Abstract Globe / Grid Background */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '900px',
                        height: '900px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.4,
                    }}
                >
                    <svg width="900" height="900" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {/* Core Sphere */}
                        <circle cx="100" cy="100" r="80" fill="url(#globeGrad)" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.6" />

                        {/* Latitudes */}
                        <ellipse cx="100" cy="100" rx="80" ry="20" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />
                        <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />
                        <ellipse cx="100" cy="100" rx="80" ry="60" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />

                        {/* Longitudes */}
                        <ellipse cx="100" cy="100" rx="20" ry="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />
                        <ellipse cx="100" cy="100" rx="40" ry="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />
                        <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />

                        {/* Axis */}
                        <line x1="100" y1="20" x2="100" y2="180" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.8" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.8" />
                    </svg>
                </div>

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    {/* Brand Mark */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            background: 'linear-gradient(180deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 64, 175, 0) 100%)', // Blue-800 based
                            border: '1px solid rgba(59, 130, 246, 0.5)',
                            borderRadius: '50%',
                            width: '100px',
                            height: '100px',
                            boxShadow: '0 0 60px rgba(37, 99, 235, 0.4)',
                        }}
                    >
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Premium Geometric Shield - Logo.tsx Path */}
                            <path
                                d="M20 4L6 9.5V18C6 26.5 12 34 20 37.5C28 34 34 26.5 34 18V9.5L20 4Z"
                                fill="#2563EB"
                                stroke="white"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>

                    {/* Main Title */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 96,
                                fontWeight: 900,
                                color: 'white',
                                letterSpacing: '-4px',
                                lineHeight: 0.9,
                                textShadow: '0 0 60px rgba(59, 130, 246, 0.5)',
                            }}
                        >
                            NOVAI
                        </div>
                        <div
                            style={{
                                fontSize: 24,
                                fontWeight: 400,
                                color: '#94a3b8', // Slate 400
                                letterSpacing: '12px',
                                textTransform: 'uppercase',
                                marginTop: '10px',
                            }}
                        >
                            INTELLIGENCE
                        </div>
                    </div>

                    {/* Tagline / "Apple Copy" */}
                    <div
                        style={{
                            marginTop: '60px',
                            fontSize: 32,
                            color: 'white',
                            fontWeight: 500,
                            textAlign: 'center',
                            background: 'linear-gradient(90deg, transparent, rgba(30, 41, 59, 0.8), transparent)',
                            padding: '10px 40px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        Global Intelligence For the AI Era
                    </div>
                </div>

                {/* Status Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        fontSize: 18,
                        color: '#64748b',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                        <span>System Online</span>
                    </div>
                    <span>•</span>
                    <span>v2.0.0 (Electric Blue)</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
