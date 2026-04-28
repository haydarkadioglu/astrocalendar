/**
 * Service to interact with the Wikipedia REST API for fetching celestial body information.
 */

export interface WikiSummaryResponse {
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    originalimage?: {
        source: string;
        width: number;
        height: number;
    };
    content_urls: {
        desktop: {
            page: string;
        }
    };
}

/**
 * Fetches a summary paragraph and primary image from Wikipedia.
 * 
 * @param pageName The exact Wikipedia article title (e.g., "Güneş", "Jüpiter")
 * @param lang The language code (default 'tr')
 */
export async function getWikiSummary(pageName: string, lang = 'tr'): Promise<WikiSummaryResponse | null> {
    try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageName)}`;
        const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours

        if (!res.ok) {
            console.warn(`Wikipedia page not found: ${pageName}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch Wikipedia data for ${pageName}:`, error);
        return null;
    }
}
