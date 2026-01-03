'use client';

import { useState, useEffect, useCallback } from 'react';
import { LiveVessel, parseAISMessage } from '@/lib/ais-stream';
import { getCountryFromMMSI, KNOWN_MILITARY_VESSELS } from '@/lib/naval-vessels';

interface UseAISStreamOptions {
    enabled?: boolean;
    onVesselUpdate?: (vessel: LiveVessel) => void;
}

export function useAISStream(options: UseAISStreamOptions = {}) {
    const { enabled = true, onVesselUpdate } = options;
    const [vessels, setVessels] = useState<Map<string, LiveVessel>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        if (!enabled) return;

        let eventSource: EventSource | null = null;

        const connect = () => {
            try {
                eventSource = new EventSource('/api/ais/stream');

                eventSource.onopen = () => {
                    setIsConnected(true);
                    setError(null);
                    console.log('[AIS Hook] Connected to stream');
                };

                eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.type === 'connected') {
                            console.log('[AIS Hook] Stream initialized');
                            return;
                        }

                        if (data.type === 'error') {
                            setError(data.message);
                            return;
                        }

                        // Parse the AIS message
                        const vessel = parseAISMessage(data);

                        if (vessel) {
                            // Only keep vessels from top naval powers
                            const topPowers = ['US', 'CN', 'RU', 'UK', 'JP', 'FR', 'IN', 'KR', 'IT', 'AU'];
                            if (topPowers.includes(vessel.country) || vessel.isKnownMilitary) {
                                setVessels(prev => {
                                    const updated = new Map(prev);
                                    updated.set(vessel.mmsi, vessel);
                                    return updated;
                                });
                                setLastUpdate(new Date());
                                onVesselUpdate?.(vessel);
                            }
                        }
                    } catch (parseError) {
                        console.error('[AIS Hook] Parse error:', parseError);
                    }
                };

                eventSource.onerror = (err) => {
                    console.error('[AIS Hook] Stream error:', err);
                    setIsConnected(false);
                    setError('Connection lost. Reconnecting...');

                    // Reconnect after 5 seconds
                    setTimeout(() => {
                        if (eventSource) {
                            eventSource.close();
                        }
                        connect();
                    }, 5000);
                };
            } catch (connectError) {
                console.error('[AIS Hook] Connection error:', connectError);
                setError('Failed to connect to AIS stream');
            }
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [enabled, onVesselUpdate]);

    // Convert vessels to array and sort by last update
    const vesselArray = Array.from(vessels.values()).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Get vessels by country
    const getVesselsByCountry = useCallback((country: string) => {
        return vesselArray.filter(v => v.country === country);
    }, [vesselArray]);

    // Get vessel counts by country
    const vesselCountsByCountry = useCallback(() => {
        const counts: Record<string, number> = {};
        vesselArray.forEach(v => {
            counts[v.country] = (counts[v.country] || 0) + 1;
        });
        return counts;
    }, [vesselArray]);

    return {
        vessels: vesselArray,
        isConnected,
        error,
        lastUpdate,
        getVesselsByCountry,
        vesselCountsByCountry: vesselCountsByCountry(),
        vesselCount: vesselArray.length,
    };
}
