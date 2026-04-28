export interface ObservationSnapshot {
    latitude: number;
    longitude: number;
    cloudCover: number;
    visibilityKm: number | null;
    windSpeedKph: number | null;
    temperatureC: number | null;
    isDay: boolean;
    moonIllumination: number;
    moonPhaseKey: MoonPhaseKey;
    seeingScore: number;
    seeingLabel: ObservationQuality;
    cloudLabel: ObservationQuality;
    moonObservationLabel: ObservationQuality;
    darknessWindow: {
        start: string | null;
        end: string | null;
        durationHours: number | null;
    };
    fetchedAt: string;
}

export type ObservationQuality = 'excellent' | 'good' | 'fair' | 'poor';

export type MoonPhaseKey =
    | 'newMoon'
    | 'waxingCrescent'
    | 'firstQuarter'
    | 'waxingGibbous'
    | 'fullMoon'
    | 'waningGibbous'
    | 'lastQuarter'
    | 'waningCrescent';
