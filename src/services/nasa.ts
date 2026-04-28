import 'server-only';

import { externalApiConfig } from './env';
import { fetchJson } from './http';
import { ApodData, DonkiEventSummary, EpicImageSummary, NearEarthObjectSummary } from '@/types/nasa';

const NASA_API_BASE = 'https://api.nasa.gov';

const APOD_FALLBACK: ApodData = {
    title: 'Andromeda Galaxy',
    explanation: 'A fallback APOD card shown when NASA data is temporarily unavailable.',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200',
    media_type: 'image',
    date: '1970-01-01'
};

function withApiKey(url: string) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}api_key=${encodeURIComponent(externalApiConfig.nasaApiKey)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isApodData(value: unknown): value is ApodData {
    if (!isRecord(value)) {
        return false;
    }

    return typeof value.title === 'string'
        && typeof value.explanation === 'string'
        && typeof value.url === 'string'
        && typeof value.date === 'string'
        && (value.media_type === 'image' || value.media_type === 'video')
        && (value.hdurl === undefined || typeof value.hdurl === 'string')
        && (value.copyright === undefined || typeof value.copyright === 'string')
        && (value.thumbnail_url === undefined || typeof value.thumbnail_url === 'string');
}

function isApodArray(value: unknown): value is ApodData[] {
    return Array.isArray(value) && value.every(isApodData);
}

interface NeoWsFeedResponse {
    near_earth_objects: Record<string, NeoWsObject[]>;
}

interface NeoWsObject {
    id: string;
    name: string;
    nasa_jpl_url: string;
    is_potentially_hazardous_asteroid: boolean;
    estimated_diameter: {
        meters: {
            estimated_diameter_max: number;
        };
    };
    close_approach_data: Array<{
        close_approach_date: string;
        relative_velocity: {
            kilometers_per_hour: string;
        };
        miss_distance: {
            kilometers: string;
        };
    }>;
}

function isNeoWsObject(value: unknown): value is NeoWsObject {
    if (!isRecord(value)
        || !isRecord(value.estimated_diameter)
        || !isRecord(value.estimated_diameter.meters)
        || !Array.isArray(value.close_approach_data)
    ) {
        return false;
    }

    return typeof value.id === 'string'
        && typeof value.name === 'string'
        && typeof value.nasa_jpl_url === 'string'
        && typeof value.is_potentially_hazardous_asteroid === 'boolean'
        && typeof value.estimated_diameter.meters.estimated_diameter_max === 'number'
        && value.close_approach_data.every((item) =>
            isRecord(item)
            && typeof item.close_approach_date === 'string'
            && isRecord(item.relative_velocity)
            && typeof item.relative_velocity.kilometers_per_hour === 'string'
            && isRecord(item.miss_distance)
            && typeof item.miss_distance.kilometers === 'string'
        );
}

function isNeoWsFeedResponse(value: unknown): value is NeoWsFeedResponse {
    return isRecord(value)
        && isRecord(value.near_earth_objects)
        && Object.values(value.near_earth_objects).every((items) => Array.isArray(items) && items.every(isNeoWsObject));
}

interface DonkiFlare {
    flrID: string;
    beginTime: string;
    classType?: string;
    sourceLocation?: string;
    link?: string;
}

interface DonkiCme {
    activityID: string;
    startTime: string;
    sourceLocation?: string;
    note?: string;
    link?: string;
}

interface DonkiGst {
    gstID: string;
    startTime: string;
    allKpIndex?: Array<{
        kpIndex: number;
    }>;
    link?: string;
}

function isDonkiFlare(value: unknown): value is DonkiFlare {
    return isRecord(value)
        && typeof value.flrID === 'string'
        && typeof value.beginTime === 'string'
        && (value.classType === undefined || typeof value.classType === 'string')
        && (value.sourceLocation === undefined || typeof value.sourceLocation === 'string')
        && (value.link === undefined || typeof value.link === 'string');
}

function isDonkiCme(value: unknown): value is DonkiCme {
    return isRecord(value)
        && typeof value.activityID === 'string'
        && typeof value.startTime === 'string'
        && (value.sourceLocation === undefined || typeof value.sourceLocation === 'string')
        && (value.note === undefined || typeof value.note === 'string')
        && (value.link === undefined || typeof value.link === 'string');
}

function isDonkiGst(value: unknown): value is DonkiGst {
    return isRecord(value)
        && typeof value.gstID === 'string'
        && typeof value.startTime === 'string'
        && (value.link === undefined || typeof value.link === 'string')
        && (value.allKpIndex === undefined || (Array.isArray(value.allKpIndex) && value.allKpIndex.every((item) => isRecord(item) && typeof item.kpIndex === 'number')));
}

function isDonkiFlareArray(value: unknown): value is DonkiFlare[] {
    return Array.isArray(value) && value.every(isDonkiFlare);
}

function isDonkiCmeArray(value: unknown): value is DonkiCme[] {
    return Array.isArray(value) && value.every(isDonkiCme);
}

function isDonkiGstArray(value: unknown): value is DonkiGst[] {
    return Array.isArray(value) && value.every(isDonkiGst);
}

interface EpicItem {
    identifier: string;
    caption: string;
    image: string;
    date: string;
    centroid_coordinates?: {
        lat: number;
        lon: number;
    };
}

function isEpicItem(value: unknown): value is EpicItem {
    return isRecord(value)
        && typeof value.identifier === 'string'
        && typeof value.caption === 'string'
        && typeof value.image === 'string'
        && typeof value.date === 'string'
        && (
            value.centroid_coordinates === undefined
            || (isRecord(value.centroid_coordinates)
                && typeof value.centroid_coordinates.lat === 'number'
                && typeof value.centroid_coordinates.lon === 'number')
        );
}

function isEpicItemArray(value: unknown): value is EpicItem[] {
    return Array.isArray(value) && value.every(isEpicItem);
}

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function createEpicImageUrl(item: EpicItem) {
    const [datePart] = item.date.split(' ');
    const [year, month, day] = datePart.split('-');
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`;
}

export async function fetchApod(): Promise<ApodData> {
    try {
        return await fetchJson(withApiKey(`${NASA_API_BASE}/planetary/apod`), isApodData, { revalidate: 3600 });
    } catch (error) {
        console.error('Failed to fetch APOD:', error);
        return APOD_FALLBACK;
    }
}

export async function fetchApodGallery(count = 4): Promise<ApodData[]> {
    try {
        return await fetchJson(
            withApiKey(`${NASA_API_BASE}/planetary/apod?count=${Math.min(Math.max(count, 1), 8)}&thumbs=true`),
            isApodArray,
            { revalidate: 3600 }
        );
    } catch (error) {
        console.error('Failed to fetch APOD gallery:', error);
        return [APOD_FALLBACK];
    }
}

export async function fetchNearEarthObjects(): Promise<NearEarthObjectSummary[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);

    try {
        const data = await fetchJson(
            withApiKey(`${NASA_API_BASE}/neo/rest/v1/feed?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`),
            isNeoWsFeedResponse,
            { revalidate: 3600 }
        );

        return Object.values(data.near_earth_objects)
            .flat()
            .map((item) => {
                const approach = item.close_approach_data[0];
                return {
                    id: item.id,
                    name: item.name,
                    date: approach?.close_approach_date ?? startDate.toISOString(),
                    hazardous: item.is_potentially_hazardous_asteroid,
                    missDistanceKilometers: Number(approach?.miss_distance.kilometers ?? 0),
                    estimatedDiameterMeters: item.estimated_diameter.meters.estimated_diameter_max,
                    relativeVelocityKph: Number(approach?.relative_velocity.kilometers_per_hour ?? 0),
                    nasaJplUrl: item.nasa_jpl_url
                };
            })
            .sort((a, b) => a.missDistanceKilometers - b.missDistanceKilometers)
            .slice(0, 4);
    } catch (error) {
        console.error('Failed to fetch NEO feed:', error);
        return [];
    }
}

export async function fetchDonkiEvents(): Promise<DonkiEventSummary[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    const start = formatDate(startDate);

    try {
        const [flares, cmes, storms] = await Promise.all([
            fetchJson(withApiKey(`${NASA_API_BASE}/DONKI/FLR?startDate=${start}`), isDonkiFlareArray, { revalidate: 3600 }),
            fetchJson(withApiKey(`${NASA_API_BASE}/DONKI/CME?startDate=${start}`), isDonkiCmeArray, { revalidate: 3600 }),
            fetchJson(withApiKey(`${NASA_API_BASE}/DONKI/GST?startDate=${start}`), isDonkiGstArray, { revalidate: 3600 })
        ]);

        const mapped: DonkiEventSummary[] = [
            ...flares.map((item) => ({
                id: item.flrID,
                type: 'FLR' as const,
                title: item.classType ? `Solar Flare ${item.classType}` : 'Solar Flare',
                date: item.beginTime,
                source: item.sourceLocation || 'Sun',
                details: item.classType ? `Class ${item.classType} flare detected from ${item.sourceLocation || 'an unspecified region'}.` : 'Solar flare detected.',
                link: item.link
            })),
            ...cmes.map((item) => ({
                id: item.activityID,
                type: 'CME' as const,
                title: 'Coronal Mass Ejection',
                date: item.startTime,
                source: item.sourceLocation || 'Solar corona',
                details: item.note || `CME reported from ${item.sourceLocation || 'an unspecified region'}.`,
                link: item.link
            })),
            ...storms.map((item) => ({
                id: item.gstID,
                type: 'GST' as const,
                title: 'Geomagnetic Storm',
                date: item.startTime,
                source: 'Earth magnetosphere',
                details: item.allKpIndex?.length ? `Peak KP index: ${Math.max(...item.allKpIndex.map((kp) => kp.kpIndex))}.` : 'Geomagnetic storm activity detected.',
                link: item.link
            }))
        ];

        return mapped
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6);
    } catch (error) {
        console.error('Failed to fetch DONKI events:', error);
        return [];
    }
}

export async function fetchEpicImages(): Promise<EpicImageSummary[]> {
    try {
        const items = await fetchJson(withApiKey(`${NASA_API_BASE}/EPIC/api/natural`), isEpicItemArray, { revalidate: 3600 });
        return items.slice(0, 6).map((item) => ({
            identifier: item.identifier,
            caption: item.caption,
            image: createEpicImageUrl(item),
            date: item.date,
            centroidCoordinates: item.centroid_coordinates
        }));
    } catch (error) {
        console.error('Failed to fetch EPIC images:', error);
        return [];
    }
}
