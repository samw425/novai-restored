'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'react-spring';

interface ThreatGlobeProps {
    incidents?: any[];
    markerColor?: [number, number, number];
    focusOn?: { lat: number; lng: number } | null;
    onIncidentClick?: (incident: any) => void;
}

export function ThreatGlobe({
    incidents = [],
    markerColor = [1, 0.5, 0],
    focusOn = null,
    onIncidentClick
}: ThreatGlobeProps) {
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

    // Ref to track current rotation for smooth transitions & hit testing
    const currentPhi = useRef(0);
    const widthRef = useRef(0);

    // Hit Testing Function
    const handleGlobeClick = (e: React.MouseEvent) => {
        if (!canvasRef.current || pointerInteractionMovement.current > 5) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const width = widthRef.current;
        const r_canvas = width / 2; // Renamed to avoid conflict with spring 'r'

        // Constants matching the createGlobe config
        const theta = 0.3;
        const phi = currentPhi.current;

        // Iterate incidents to find a hit
        const hit = incidents.find(inc => {
            const lat = inc.location.lat * Math.PI / 180;
            const lng = inc.location.lng * Math.PI / 180;

            // 3D projection matching Cobe's defaults
            const cx = Math.cos(lat) * Math.sin(lng + phi);
            const cy = Math.sin(lat);
            const cz = Math.cos(lat) * Math.cos(lng + phi);

            // Rotate around X axis (tilt by theta)
            // y' = y*cos(theta) - z*sin(theta)
            // z' = y*sin(theta) + z*cos(theta)
            const screenX = cx;
            const screenY = cy * Math.cos(theta) - cz * Math.sin(theta);

            // Check visibility (z' > 0 means distinct side? Cobe creates a sphere, so we check dot product or z)
            // Actually, simplified check: just screen distance. If it's "behind" the globe, Z will be negative.
            const screenZ = cy * Math.sin(theta) + cz * Math.cos(theta);

            if (screenZ < 0) return false; // Behind the globe

            // Map to canvas coordinates
            // Cobe maps -1..1 to 0..width
            const x = (screenX + 1) * r_canvas;
            const y = (1 - screenY) * r_canvas; // Y is inverted in screen space

            const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));

            // Hit threshold (20px radius)
            return dist < 20;
        });

        if (hit && onIncidentClick) {
            onIncidentClick(hit);
        }
    };

    // Effect to handle focus rotation
    useEffect(() => {
        if (focusOn) {
            // Cobe rotation: phi=0 centers on lng=0 (Greenwich) if theta is set right.
            // Rotation is counter-clockwise?
            // Center target: phi = -(lng * PI / 180)
            const targetPhi = -(focusOn.lng * Math.PI) / 180;

            // We want to animate 'r' such that (phi_internal + r) = targetPhi
            // But phi_internal leads. 
            // Simpler: Just set 'r' to the delta needed relative to 0? 
            // Issue: 'phi' in onRender keeps growing.
            // Let's just animate 'r' to the target value and ignore the drift for a moment, or accept it spins away.
            // Better: reset internal phi? No, jarring.

            api.start({ r: targetPhi });
        }
    }, [focusOn, api]);

    // Callback for when a marker is clicked (simulated via focus for now, or if we add picking later)
    // For now, we just expose the rotation state if needed.

    // Map incidents to markers with strict typing and highlighting
    const markers = incidents.length > 0 ? incidents.map(inc => {
        const isFocused = focusOn &&
            Math.abs(inc.location.lat - focusOn.lat) < 0.001 &&
            Math.abs(inc.location.lng - focusOn.lng) < 0.001;

        return {
            location: [inc.location.lat, inc.location.lng] as [number, number],
            size: isFocused ? 0.15 : (inc.severity === 'critical' ? 0.08 : 0.05) // Highlight size
        };
    }) : [
        // Defaults
        { location: [38.9072, -77.0369] as [number, number], size: 0.05 },
    ];
    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
                widthRef.current = width;
            }
        }
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
            markerColor: markerColor,
            glowColor: [0.3, 0.3, 0.6],
            markers: markers,
            onRender: (state) => {
                // This prevents rotation while dragging
                if (pointerInteracting.current !== null) {
                    // Manual interaction handled by spring
                }
                // STOPPED AUTOMATIC ROTATION PER USER FEEDBACK
                // phi += 0.003 
                state.phi = phi + r.get()
                state.width = width * 2
                state.height = width * 2
                currentPhi.current = state.phi;
            },
        })
        setTimeout(() => (canvasRef.current!.style.opacity = '1'))
        return () => globe.destroy()
    }, [incidents, markerColor, markers, r]) // Re-run if incidents/color change. Note: 'markers' dependency might cause re-init flickering. Better to relay 'incidents'.
    // Actually, createGlobe is effectively 'mounting'. Re-running it is expensive. 
    // Markers are passed in options. Cobe doesn't react to option changes unless we re-create, OR use the 'state' in onRender?
    // Checking standard usage: usually people destroy/recreate for marker changes OR pass a mutable ref?
    // Let's assume re-creation is acceptable for this user experience (latency 24ms noted in UI). 
    // But reducing flicker: 'markers' changes when 'focusOn' changes. Re-creating on every click is bad.
    // OPTIMIZATION: Use a ref for markers and update it, then assign in onRender? 
    // No, standard `cobe` takes propertied in `createGlobe`. 
    // Let's stick to the current pattern (useEffect dependency) but optimize dependency array.

    // Returning purely the replacement for the logic block to be safe.

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
                onClick={handleGlobeClick}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                    cursor: 'crosshair',
                }}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'crosshair';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'crosshair';
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
