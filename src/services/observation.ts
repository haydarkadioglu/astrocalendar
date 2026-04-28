import 'server-only';

import { fetchJson } from './http';
import { MoonPhaseKey, ObservationQuality, ObservationSnapshot } from '@/types/observation';

interface OpenMeteoResponse {
    current: {
        cloud_cover: number;
        visibility?: number;
        wind_speed_10m?: number;
        temperature_2m?: number;
        is_day?: number;
        time: string;
    };
    daily: {
        sunrise: string[];
        sunset: string[];
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isOpenMeteoResponse(value: unknown): value is OpenMeteoResponse {
    return isRecord(value)
        && isRecord(value.current)
        && typeof value.current.cloud_cover === 'number'
        && typeof value.current.time === 'string'
        && (value.current.visibility === undefined || typeof value.current.visibility === 'number')
        && (value.current.wind_speed_10m === undefined || typeof value.current.wind_speed_10m === 'number')
        && (value.current.temperature_2m === undefined || typeof value.current.temperature_2m === 'number')
        && (value.current.is_day === undefined || typeof value.current.is_day === 'number')
        && isRecord(value.daily)
        && isStringArray(value.daily.sunrise)
        && isStringArray(value.daily.sunset);
}

function getMoonPhase(date: Date) {
    const synodicMonth = 29.53058867;
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
    const daysSince = (date.getTime() - knownNewMoon) / 86400000;
    const cycle = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
    const phase = cycle / synodicMonth;
    const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);

    let phaseKey: MoonPhaseKey;
    if (phase < 0.03 || phase >= 0.97) {
        phaseKey = 'newMoon';
    } else if (phase < 0.22) {
        phaseKey = 'waxingCrescent';
    } else if (phase < 0.28) {
        phaseKey = 'firstQuarter';
    } else if (phase < 0.47) {
        phaseKey = 'waxingGibbous';
    } else if (phase < 0.53) {
        phaseKey = 'fullMoon';
    } else if (phase < 0.72) {
        phaseKey = 'waningGibbous';
    } else if (phase < 0.78) {
        phaseKey = 'lastQuarter';
    } else {
        phaseKey = 'waningCrescent';
    }

    return { illumination, phaseKey };
}

function getQualityFromCloud(cloudCover: number): ObservationQuality {
    if (cloudCover <= 15) {
        return 'excellent';
    }
    if (cloudCover <= 35) {
        return 'good';
    }
    if (cloudCover <= 60) {
        return 'fair';
    }
    return 'poor';
}

function getMoonObservationQuality(illumination: number): ObservationQuality {
    if (illumination <= 20) {
        return 'excellent';
    }
    if (illumination <= 45) {
        return 'good';
    }
    if (illumination <= 70) {
        return 'fair';
    }
    return 'poor';
}

function getSeeingScore(cloudCover: number, visibilityKm: number | null, windSpeedKph: number | null) {
    const visibilityPenalty = visibilityKm === null ? 10 : Math.max(0, 25 - Math.min(25, visibilityKm)) * 1.8;
    const windPenalty = windSpeedKph === null ? 8 : Math.min(windSpeedKph, 40) * 0.9;
    const cloudPenalty = cloudCover * 0.65;
    return Math.max(0, Math.min(100, Math.round(100 - cloudPenalty - visibilityPenalty - windPenalty)));
}

function getSeeingLabel(score: number): ObservationQuality {
    if (score >= 80) {
        return 'excellent';
    }
    if (score >= 65) {
        return 'good';
    }
    if (score >= 45) {
        return 'fair';
    }
    return 'poor';
}

function hoursBetween(startIso: string | null, endIso: string | null) {
    if (!startIso || !endIso) {
        return null;
    }

    const diffMs = new Date(endIso).getTime() - new Date(startIso).getTime();
    if (!Number.isFinite(diffMs) || diffMs <= 0) {
        return null;
    }

    return Math.round((diffMs / 3600000) * 10) / 10;
}

export async function fetchObservationSnapshot(latitude: number, longitude: number): Promise<ObservationSnapshot> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,wind_speed_10m,visibility,is_day&daily=sunrise,sunset&timezone=auto&forecast_days=2`;
    const fallbackDate = new Date();
    const moon = getMoonPhase(fallbackDate);

    try {
        const data = await fetchJson(url, isOpenMeteoResponse, { revalidate: 900 });
        const currentTime = new Date(data.current.time);
        const moonPhase = getMoonPhase(currentTime);
        const visibilityKm = data.current.visibility ? Math.round((data.current.visibility / 1000) * 10) / 10 : null;
        const windSpeedKph = data.current.wind_speed_10m ?? null;
        const seeingScore = getSeeingScore(data.current.cloud_cover, visibilityKm, windSpeedKph);

        return {
            latitude,
            longitude,
            cloudCover: data.current.cloud_cover,
            visibilityKm,
            windSpeedKph,
            temperatureC: data.current.temperature_2m ?? null,
            isDay: data.current.is_day === 1,
            moonIllumination: moonPhase.illumination,
            moonPhaseKey: moonPhase.phaseKey,
            seeingScore,
            seeingLabel: getSeeingLabel(seeingScore),
            cloudLabel: getQualityFromCloud(data.current.cloud_cover),
            moonObservationLabel: getMoonObservationQuality(moonPhase.illumination),
            darknessWindow: {
                start: data.daily.sunset[0] ?? null,
                end: data.daily.sunrise[1] ?? data.daily.sunrise[0] ?? null,
                durationHours: hoursBetween(data.daily.sunset[0] ?? null, data.daily.sunrise[1] ?? data.daily.sunrise[0] ?? null)
            },
            fetchedAt: data.current.time
        };
    } catch (error) {
        console.error('Failed to fetch observation snapshot:', error);
        return {
            latitude,
            longitude,
            cloudCover: 45,
            visibilityKm: null,
            windSpeedKph: null,
            temperatureC: null,
            isDay: false,
            moonIllumination: moon.illumination,
            moonPhaseKey: moon.phaseKey,
            seeingScore: 52,
            seeingLabel: 'fair',
            cloudLabel: 'fair',
            moonObservationLabel: getMoonObservationQuality(moon.illumination),
            darknessWindow: {
                start: null,
                end: null,
                durationHours: null
            },
            fetchedAt: fallbackDate.toISOString()
        };
    }
}
