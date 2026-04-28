import 'server-only';

import { fetchJson } from './http';

export interface SpaceXLaunch {
    id: string;
    name: string;
    date_utc: string;
    upcoming: boolean;
    success: boolean | null;
    details: string | null;
    links: {
        patch: {
            small: string | null;
        };
        webcast: string | null;
    };
}

interface SpaceXPastLaunchResponse {
    docs: SpaceXLaunch[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isSpaceXLaunch(value: unknown): value is SpaceXLaunch {
    if (!isRecord(value)) {
        return false;
    }

    const links = value.links;
    const patch = isRecord(links) ? links.patch : null;

    return typeof value.id === 'string'
        && typeof value.name === 'string'
        && typeof value.date_utc === 'string'
        && typeof value.upcoming === 'boolean'
        && (typeof value.success === 'boolean' || value.success === null)
        && (typeof value.details === 'string' || value.details === null)
        && isRecord(links)
        && isRecord(patch)
        && (typeof patch.small === 'string' || patch.small === null)
        && (typeof links.webcast === 'string' || links.webcast === null);
}

function isSpaceXPastLaunchResponse(value: unknown): value is SpaceXPastLaunchResponse {
    return isRecord(value)
        && Array.isArray(value.docs)
        && value.docs.every(isSpaceXLaunch);
}

function isSpaceXLaunchArray(value: unknown): value is SpaceXLaunch[] {
    return Array.isArray(value) && value.every(isSpaceXLaunch);
}

export async function fetchSpaceXLaunches(): Promise<SpaceXLaunch[]> {
    try {
        const [pastData, upcomingData] = await Promise.all([
            fetchJson(
                'https://api.spacexdata.com/v4/launches/query',
                isSpaceXPastLaunchResponse,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: { upcoming: false },
                        options: {
                            limit: 5,
                            sort: { date_utc: 'desc' }
                        }
                    }),
                    revalidate: 3600
                }
            ),
            fetchJson(
                'https://api.spacexdata.com/v4/launches/upcoming',
                isSpaceXLaunchArray,
                { revalidate: 3600 }
            )
        ]);

        const combined = [...upcomingData.slice(0, 5), ...pastData.docs];
        return combined.sort((a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime());
    } catch (error) {
        console.error('Failed to fetch SpaceX launches:', error);
        return [];
    }
}
