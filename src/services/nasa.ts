import 'server-only';

import { externalApiConfig } from './env';
import { fetchJson } from './http';

export interface ApodData {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    date: string;
    copyright?: string;
}

const APOD_FALLBACK: ApodData = {
    title: 'Andromeda Galaxy',
    explanation: 'A fallback APOD card shown when NASA data is temporarily unavailable.',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200',
    media_type: 'image',
    date: '1970-01-01'
};

function isApodData(value: unknown): value is ApodData {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const data = value as Record<string, unknown>;
    return typeof data.title === 'string'
        && typeof data.explanation === 'string'
        && typeof data.url === 'string'
        && typeof data.date === 'string'
        && (data.media_type === 'image' || data.media_type === 'video')
        && (data.hdurl === undefined || typeof data.hdurl === 'string')
        && (data.copyright === undefined || typeof data.copyright === 'string');
}

export async function fetchApod(): Promise<ApodData> {
    const apiKey = externalApiConfig.nasaApiKey || 'DEMO_KEY';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(apiKey)}`;

    try {
        return await fetchJson(url, isApodData, { revalidate: 3600 });
    } catch (error) {
        console.error('Failed to fetch APOD:', error);
        return APOD_FALLBACK;
    }
}
