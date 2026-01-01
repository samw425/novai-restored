import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Join Novai Intelligence';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    const fontRegular = fetch(
        new URL('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap')
    ).then((res) => res.arrayBuffer());

    const fontBold = fetch(
        new URL('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap')
    ).then((res) => res.arrayBuffer());

    const fontMono = fetch(
        new URL('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap')
    ).then((res) => res.arrayBuffer());

    const [fontRegularData, fontBoldData, fontMonoData] = await Promise.all([fontRegular, fontBold, fontMono]);

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
                    // Electric Blue Frame
                    border: '4px solid #3b82f6',
                    boxShadow: 'inset 0 0 60px rgba(59, 130, 246, 0.4)',
                }}
            >
                {/* Background Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.2), rgba(2, 6, 23, 1) 70%)',
                        zIndex: 0,
                    }}
                />

                {/* Grid Floor */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-250px',
                        left: '-20%',
                        width: '140%',
                        height: '800px',
                        background: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                        transform: 'perspective(1000px) rotateX(60deg)',
                        zIndex: 0,
                        opacity: 0.5,
                    }}
                />

                {/* Center Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '-30px' }}>

                    {/* Logo Wrapper */}
                    <div style={{ display: 'flex', width: '80px', height: '80px', marginBottom: '24px', filter: 'drop-shadow(0 0 30px rgba(37, 99, 235, 0.6))' }}>
                        <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4L6 9.5V18C6 26.5 12 34 20 37.5C28 34 34 26.5 34 18V9.5L20 4Z" fill="#2563EB" />
                            <path d="M20 4L6 9.5V18C6 18.5 6.1 19 6.2 19.5L20 5.5L33.8 19.5C33.9 19 34 18.5 34 18V9.5L20 4Z" fill="white" fillOpacity="0.2" />
                            <g transform="translate(28, 12)">
                                <circle cx="0" cy="0" r="5" fill="white" />
                                <circle cx="0" cy="0" r="3.5" fill="#dc2626" />
                            </g>
                        </svg>
                    </div>

                    {/* Headline */}
                    <div
                        style={{
                            fontSize: '100px',
                            fontWeight: 900,
                            lineHeight: 0.95,
                            letterSpacing: '-4px',
                            marginBottom: '16px',
                            backgroundImage: 'linear-gradient(180deg, #FFFFFF 20%, #94A3B8 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        JOIN NOVAI
                    </div>

                    {/* Subhead */}
                    <div
                        style={{
                            fontSize: '28px',
                            color: '#93C5FD',
                            fontWeight: 500,
                            marginBottom: '40px',
                            letterSpacing: '1px',
                        }}
                    >
                        Global Intelligence Awaits You
                    </div>

                    {/* Access Button Visual */}
                    <div
                        style={{
                            background: '#2563EB',
                            color: 'white',
                            padding: '16px 50px',
                            borderRadius: '99px',
                            fontSize: '22px',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)',
                            border: '2px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        Get Early Access
                    </div>

                </div>

                {/* Perks Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        display: 'flex',
                        gap: '40px',
                        fontFamily: '"JetBrains Mono"',
                        fontSize: '14px',
                        color: '#94a3b8',
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '10px 30px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span>
                        <span style={{ display: 'flex' }}><span style={{ color: 'white', fontWeight: 600, marginRight: '4px' }}>Real-Time</span> Intelligence</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span>
                        <span style={{ display: 'flex' }}><span style={{ color: 'white', fontWeight: 600, marginRight: '4px' }}>176+</span> Premium Sources</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span>
                        <span style={{ display: 'flex' }}><span style={{ color: 'white', fontWeight: 600, marginRight: '4px' }}>Daily</span> Curated Briefs</span>
                    </div>
                </div>

            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Inter',
                    data: fontRegularData,
                    style: 'normal',
                    weight: 400,
                },
                {
                    name: 'Inter',
                    data: fontBoldData,
                    style: 'normal',
                    weight: 900,
                },
                {
                    name: 'JetBrains Mono',
                    data: fontMonoData,
                    style: 'normal',
                    weight: 500,
                },
            ],
        }
    );
}
