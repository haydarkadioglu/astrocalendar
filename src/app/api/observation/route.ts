import { NextRequest, NextResponse } from 'next/server';
import { fetchObservationSnapshot } from '@/services/observation';

const DEFAULT_LATITUDE = 41.0082;
const DEFAULT_LONGITUDE = 28.9784;

function parseCoordinate(value: string | null, fallback: number, min: number, max: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const latitude = parseCoordinate(searchParams.get('lat'), DEFAULT_LATITUDE, -90, 90);
    const longitude = parseCoordinate(searchParams.get('lon'), DEFAULT_LONGITUDE, -180, 180);

    try {
        const snapshot = await fetchObservationSnapshot(latitude, longitude);
        return NextResponse.json(snapshot);
    } catch (error) {
        console.error('Observation API error:', error);
        return NextResponse.json({ error: 'Unable to load observation data' }, { status: 500 });
    }
}
