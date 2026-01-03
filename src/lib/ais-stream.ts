import { getCountryFromMMSI, getKnownVessel, MilitaryVessel, KNOWN_MILITARY_VESSELS } from './naval-vessels';

export interface LiveVessel {
    mmsi: string;
    name: string;
    country: string;
    type: MilitaryVessel['type'] | 'unknown';
    lat: number;
    lng: number;
    speed: number; // knots
    heading: number; // degrees
    course: number; // COG
    timestamp: string;
    class?: string;
    hullNumber?: string;
    destination?: string;
    isKnownMilitary: boolean;
}

// Parse AIS message from aisstream.io
export function parseAISMessage(message: Record<string, unknown>): LiveVessel | null {
    try {
        const messageType = message.MessageType as string;
        const metaData = message.MetaData as Record<string, unknown>;
        const positionReport = message.Message as Record<string, unknown>;

        if (!metaData || !positionReport) return null;

        const mmsi = String(metaData.MMSI || '');
        if (!mmsi) return null;

        // Get position data
        let lat = 0, lng = 0, speed = 0, heading = 0, course = 0;

        if (messageType === 'PositionReport') {
            const report = positionReport.PositionReport as Record<string, unknown>;
            if (report) {
                lat = report.Latitude as number || 0;
                lng = report.Longitude as number || 0;
                speed = report.Sog as number || 0;
                heading = report.TrueHeading as number || 0;
                course = report.Cog as number || 0;
            }
        } else if (messageType === 'StandardClassBPositionReport' || messageType === 'ExtendedClassBPositionReport') {
            const report = positionReport[messageType] as Record<string, unknown>;
            if (report) {
                lat = report.Latitude as number || 0;
                lng = report.Longitude as number || 0;
                speed = report.Sog as number || 0;
                heading = report.TrueHeading as number || 0;
                course = report.Cog as number || 0;
            }
        }

        // Skip invalid positions
        if (lat === 0 && lng === 0) return null;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

        // Check if known military vessel
        const knownVessel = getKnownVessel(mmsi);
        const country = knownVessel?.country || getCountryFromMMSI(mmsi);

        const vessel: LiveVessel = {
            mmsi,
            name: knownVessel?.name || (metaData.ShipName as string) || `Unknown (${mmsi})`,
            country,
            type: knownVessel?.type || 'unknown',
            lat,
            lng,
            speed,
            heading,
            course,
            timestamp: new Date().toISOString(),
            class: knownVessel?.class,
            hullNumber: knownVessel?.hullNumber,
            destination: metaData.Destination as string,
            isKnownMilitary: !!knownVessel,
        };

        return vessel;
    } catch (error) {
        console.error('Failed to parse AIS message:', error);
        return null;
    }
}

// Get all known military vessel MMSIs for filtering
export function getMilitaryMMSIs(): string[] {
    return KNOWN_MILITARY_VESSELS.map(v => v.mmsi);
}

// WebSocket connection manager for client-side
export class AISStreamClient {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private onVesselUpdate: (vessel: LiveVessel) => void;
    private reconnectAttempts = 0;
    private maxReconnects = 5;

    constructor(apiKey: string, onVesselUpdate: (vessel: LiveVessel) => void) {
        this.apiKey = apiKey;
        this.onVesselUpdate = onVesselUpdate;
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        this.ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

        this.ws.onopen = () => {
            console.log('[AIS] Connected to aisstream.io');
            this.reconnectAttempts = 0;

            // Subscribe to global coverage with military MMSI filter
            const subscription = {
                APIKey: this.apiKey,
                BoundingBoxes: [[[-90, -180], [90, 180]]], // Global
                FilterMessageTypes: ['PositionReport', 'StandardClassBPositionReport', 'ExtendedClassBPositionReport', 'ShipStaticData'],
                // Optionally filter by known military MMSIs
                // FiltersShipMMSI: getMilitaryMMSIs(),
            };

            this.ws?.send(JSON.stringify(subscription));
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                const vessel = parseAISMessage(message);

                if (vessel) {
                    // Only pass through vessels from top 10 naval powers
                    const topPowers = ['US', 'CN', 'RU', 'UK', 'JP', 'FR', 'IN', 'KR', 'IT', 'AU'];
                    if (topPowers.includes(vessel.country) || vessel.isKnownMilitary) {
                        this.onVesselUpdate(vessel);
                    }
                }
            } catch (error) {
                console.error('[AIS] Parse error:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('[AIS] WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('[AIS] Connection closed');
            if (this.reconnectAttempts < this.maxReconnects) {
                this.reconnectAttempts++;
                setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
            }
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
