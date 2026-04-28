export interface ApodData {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    date: string;
    copyright?: string;
    thumbnail_url?: string;
}

export interface NearEarthObjectSummary {
    id: string;
    name: string;
    date: string;
    hazardous: boolean;
    missDistanceKilometers: number;
    estimatedDiameterMeters: number;
    relativeVelocityKph: number;
    nasaJplUrl: string;
}

export interface DonkiEventSummary {
    id: string;
    type: 'FLR' | 'CME' | 'GST';
    title: string;
    date: string;
    source: string;
    details: string;
    link?: string;
}

export interface EpicImageSummary {
    identifier: string;
    caption: string;
    image: string;
    date: string;
    centroidCoordinates?: {
        lat: number;
        lon: number;
    };
}
