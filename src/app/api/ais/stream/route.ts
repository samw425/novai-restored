import { NextRequest, NextResponse } from 'next/server';

// Server-Sent Events endpoint for AIS vessel data
// This proxies the aisstream.io WebSocket to avoid CORS issues

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const AIS_API_KEY = process.env.AISSTREAM_API_KEY;

export async function GET(request: NextRequest) {
    if (!AIS_API_KEY) {
        return NextResponse.json(
            { error: 'AIS API key not configured' },
            { status: 500 }
        );
    }

    // Create SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            // Connect to aisstream.io WebSocket
            const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

            ws.onopen = () => {
                console.log('[AIS API] Connected to aisstream.io');

                // Subscribe to global coverage
                const subscription = {
                    APIKey: AIS_API_KEY,
                    BoundingBoxes: [[[-90, -180], [90, 180]]], // Global
                    FilterMessageTypes: ['PositionReport', 'ShipStaticData'],
                };

                ws.send(JSON.stringify(subscription));

                // Send initial connection message
                const initMessage = `data: ${JSON.stringify({ type: 'connected' })}\n\n`;
                controller.enqueue(encoder.encode(initMessage));
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    const sseMessage = `data: ${JSON.stringify(message)}\n\n`;
                    controller.enqueue(encoder.encode(sseMessage));
                } catch (error) {
                    console.error('[AIS API] Parse error:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('[AIS API] WebSocket error:', error);
                const errorMessage = `data: ${JSON.stringify({ type: 'error', message: 'WebSocket connection failed' })}\n\n`;
                controller.enqueue(encoder.encode(errorMessage));
            };

            ws.onclose = () => {
                console.log('[AIS API] WebSocket closed');
                controller.close();
            };

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                ws.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
