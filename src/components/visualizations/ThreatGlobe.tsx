'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'react-spring';

export function ThreatGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
        window.addEventListener('resize', onResize)
        onResize()

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.1, 0.1, 0.2],
            markerColor: [0.1, 0.8, 1], // Cyan for generic markers
            glowColor: [0.3, 0.3, 0.6],
            markers: [
                // Hotspots: DC, London, Beijing, Moscow, Tel Aviv, Silicon Valley
                { location: [38.9072, -77.0369], size: 0.05 }, // Washington DC
                { location: [51.5074, -0.1278], size: 0.05 }, // London
                { location: [39.9042, 116.4074], size: 0.05 }, // Beijing
                { location: [55.7558, 37.6173], size: 0.05 }, // Moscow
                { location: [32.0853, 34.7818], size: 0.05 }, // Tel Aviv
                { location: [37.3875, -122.0575], size: 0.05 }, // Silicon Valley
            ],
            onRender: (state) => {
                // This prevents rotation while dragging
                if (!pointerInteracting.current) {
                    // Called on every animation frame.
                    // `state` will be an empty object, return updated params.
                    phi += 0.005
                }
                state.phi = phi + r.get()
                state.width = width * 2
                state.height = width * 2
            },
        })
        setTimeout(() => (canvasRef.current!.style.opacity = '1'))
        return () => globe.destroy()
    }, [])

    return (
        <div style={{
            width: '100%',
            maxWidth: 600,
            aspectRatio: 1,
            margin: 'auto',
            position: 'relative',
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                }}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 200,
                        });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 100,
                        });
                    }
                }}
            />
        </div>
    );
}
