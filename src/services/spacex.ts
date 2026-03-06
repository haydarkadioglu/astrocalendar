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

export async function fetchSpaceXLaunches(): Promise<SpaceXLaunch[]> {
    try {
        // We can fetch upcoming and latest past launches.
        // Let's use the v4 query endpoint to get the next 5 and last 5 launches.
        const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: {
                    upcoming: false
                },
                options: {
                    limit: 5,
                    sort: {
                        date_utc: 'desc'
                    }
                }
            }),
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        const upcomingResponse = await fetch('https://api.spacexdata.com/v4/launches/upcoming', {
            next: { revalidate: 3600 }
        });

        const pastData = await response.json();
        const upcomingData = await upcomingResponse.json();

        const pastLaunches: SpaceXLaunch[] = pastData.docs || [];
        const upcomingLaunches: SpaceXLaunch[] = (upcomingData || []).slice(0, 5);

        // Combine and sort by date descending
        const combined = [...upcomingLaunches, ...pastLaunches];
        return combined.sort((a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime());

    } catch (error) {
        console.error('Failed to fetch SpaceX launches:', error);
        return [];
    }
}
