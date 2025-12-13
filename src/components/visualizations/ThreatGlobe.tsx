'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';

export function ThreatGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: 300 * 2,
            height: 300 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [1, 0.1, 0.1],
            glowColor: [1, 1, 1],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <canvas
                ref={canvasRef}
                style={{ width: 300, height: 300, maxWidth: '100%', aspectRatio: '1' }}
            />
        </div>
    );
}
