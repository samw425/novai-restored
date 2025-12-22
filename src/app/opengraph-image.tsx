import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Novai Intelligence';
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

    const [fontRegularData, fontBoldData] = await Promise.all([fontRegular, fontBold]);

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
                    backgroundColor: '#020617', // Slate 950
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
                        width: '1400px',
                        height: '1400px',
                        background: 'radial-gradient(circle, rgba(29, 78, 216, 0.15) 0%, rgba(2, 6, 23, 1) 60%)',
                        zIndex: 0,
                    }}
                />

                {/* Globe Grid Simulation */}
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

                {/* Center Content Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, marginTop: '-20px' }}>

                    {/* Logo Container */}
                    <div style={{ display: 'flex', width: '100px', height: '100px', marginBottom: '20px', filter: 'drop-shadow(0 0 25px rgba(37, 99, 235, 0.8))' }}>
                        <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            {/* Shield Body */}
                            <path d="M20 4L6 9.5V18C6 26.5 12 34 20 37.5C28 34 34 26.5 34 18V9.5L20 4Z" fill="#2563EB" />
                            {/* Highlight */}
                            <path d="M20 4L6 9.5V18C6 18.5 6.1 19 6.2 19.5L20 5.5L33.8 19.5C33.9 19 34 18.5 34 18V9.5L20 4Z" fill="white" fillOpacity="0.2" />
                            {/* Red Dot Group */}
                            <g transform="translate(28, 12)">
                                <circle cx="0" cy="0" r="5" fill="white" />
                                <circle cx="0" cy="0" r="3.5" fill="#dc2626" />
                            </g>
                        </svg>
                    </div>

                    {/* Text: Chrome Gradient simulated via CSS within the div since backgroundClip text is supported by Satori/ImageResponse (mostly) */}
                    <div
                        style={{
                            fontSize: '140px',
                            fontWeight: 900,
                            letterSpacing: '-6px',
                            lineHeight: 1,
                            color: 'white',
                            backgroundImage: 'linear-gradient(180deg, #FFFFFF 10%, #E2E8F0 50%, #94A3B8 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            margin: 0,
                        }}
                    >
                        NOVAI
                    </div>

                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            letterSpacing: '12px',
                            color: '#60A5FA',
                            textTransform: 'uppercase',
                            marginTop: '0px',
                            marginBottom: '40px',
                            textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
                        }}
                    >
                        Intelligence
                    </div>

                    {/* Tagline Bar */}
                    <div
                        style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '12px 32px',
                            borderRadius: '99px',
                        }}
                    >
                        <div style={{ fontSize: '24px', color: '#E2E8F0', fontWeight: 500 }}>
                            Global Intelligence for the AI Era
                        </div>
                    </div>

                </div>

                {/* Bottom Status Bar */}
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
            ],
        }
    );
}
