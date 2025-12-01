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
                    backgroundColor: '#0F172A',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15), transparent 70%)',
                    }}
                />

                {/* Logo Icon */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '120px',
                        height: '120px',
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        boxShadow: '0 0 50px rgba(37, 99, 235, 0.5)',
                        marginBottom: '40px',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: 'white' }}
                    >
                        <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 17L12 22L22 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 12L12 17L22 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: 80,
                        fontWeight: 900,
                        color: 'white',
                        letterSpacing: '-2px',
                        lineHeight: 1,
                        marginBottom: '20px',
                        textShadow: '0 0 40px rgba(37, 99, 235, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    NOVAI
                    <span style={{ color: '#3B82F6', marginLeft: '15px' }}>INTELLIGENCE</span>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: 32,
                        color: '#94A3B8',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        background: '#1E293B',
                        padding: '10px 30px',
                        borderRadius: '100px',
                        border: '1px solid #334155',
                    }}
                >
                    The Global Intelligence Terminal
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
                        <span style={{ color: '#64748B', fontSize: 20 }}>System Online</span>
                    </div>
                    <span style={{ color: '#334155', fontSize: 20 }}>|</span>
                    <span style={{ color: '#64748B', fontSize: 20 }}>v2.0.0 (Electric Blue)</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
