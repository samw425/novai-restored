import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const ogSize = {
    width: 1200,
    height: 630,
};

export const ogContentType = 'image/png';

interface OGTemplateProps {
    title: string;
    subtitle?: string;
    showLiveIndicator?: boolean;
}

/**
 * Shared OG Image Template for all Novai pages
 * Ensures consistent branding across all link previews
 */
export function createOGImage({ title, subtitle, showLiveIndicator = true }: OGTemplateProps) {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: '#020617',
                    fontFamily: '"Inter"',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '4px solid #3b82f6',
                    boxShadow: 'inset 0 0 60px rgba(59, 130, 246, 0.4)',
                }}
            >
                {/* Background Glow */}
                <div
                    style={{
                        position: 'absolute',
                        width: '1400px',
                        height: '1400px',
                        background: 'radial-gradient(circle, rgba(29, 78, 216, 0.15) 0%, rgba(2, 6, 23, 1) 60%)',
                        zIndex: 0,
                    }}
                />

                {/* Globe Grid */}
                <div
                    style={{
                        position: 'absolute',
                        width: '1000px',
                        height: '1000px',
                        borderRadius: '50%',
                        border: '1px solid rgba(59, 130, 246, 0.15)',
                        transform: 'perspective(1000px) rotateX(10deg)',
                        background: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                        backgroundSize: '100px 100px',
                        zIndex: 0,
                        opacity: 0.6,
                    }}
                />

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, marginTop: '-20px' }}>

                    {/* Shield Logo */}
                    <div style={{ display: 'flex', width: '80px', height: '80px', marginBottom: '24px', filter: 'drop-shadow(0 0 25px rgba(37, 99, 235, 0.8))' }}>
                        <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4L6 9.5V18C6 26.5 12 34 20 37.5C28 34 34 26.5 34 18V9.5L20 4Z" fill="#2563EB" />
                            <path d="M20 4L6 9.5V18C6 18.5 6.1 19 6.2 19.5L20 5.5L33.8 19.5C33.9 19 34 18.5 34 18V9.5L20 4Z" fill="white" fillOpacity="0.2" />
                            <g transform="translate(28, 12)">
                                <circle cx="0" cy="0" r="5" fill="white" />
                                <circle cx="0" cy="0" r="3.5" fill="#dc2626" />
                            </g>
                        </svg>
                    </div>

                    {/* Page Title */}
                    <div
                        style={{
                            fontSize: title.length > 15 ? '72px' : '100px',
                            fontWeight: 900,
                            letterSpacing: '-4px',
                            lineHeight: 1,
                            backgroundImage: 'linear-gradient(180deg, #FFFFFF 10%, #E2E8F0 50%, #94A3B8 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            margin: 0,
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </div>

                    {/* Subtitle / Branding */}
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            letterSpacing: '8px',
                            color: '#60A5FA',
                            textTransform: 'uppercase',
                            marginTop: '16px',
                            marginBottom: '40px',
                            textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
                        }}
                    >
                        {subtitle || 'NOVAI INTELLIGENCE'}
                    </div>

                </div>

                {/* Live Status Footer */}
                {showLiveIndicator && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            background: 'rgba(2, 6, 23, 0.8)',
                            padding: '8px 24px',
                            borderRadius: '6px',
                            border: '1px solid rgba(59, 130, 246, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontWeight: 700, fontSize: '14px', letterSpacing: '1px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', marginRight: '8px' }} />
                            LIVE DATA STREAM
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
                            ⚡ LOW LATENCY
                        </div>
                    </div>
                )}

            </div>
        ),
        {
            ...ogSize,
        }
    );
}
