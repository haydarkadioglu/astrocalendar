export interface ApodData {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: string;
    date: string;
    copyright?: string;
}

export async function fetchApod(): Promise<ApodData | null> {
    try {
        // We use DEMO_KEY for initial setup. Normally, an env variable like process.env.NASA_API_KEY is used.
        const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            console.error('NASA APOD API Error:', res.statusText);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch APOD:', error);
        return null;
    }
}
