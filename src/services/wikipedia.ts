import 'server-only';

import { isValidLocale, Locale } from '@/i18n/routing';
import { fetchJson } from './http';

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
        };
    };
}

interface WikiSearchItem {
    title: string;
}

interface WikiSearchResponse {
    query: {
        search: WikiSearchItem[];
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isImage(value: unknown): value is { source: string; width: number; height: number } {
    return isRecord(value)
        && typeof value.source === 'string'
        && typeof value.width === 'number'
        && typeof value.height === 'number';
}

function isWikiSummaryResponse(value: unknown): value is WikiSummaryResponse {
    if (!isRecord(value) || !isRecord(value.content_urls) || !isRecord(value.content_urls.desktop)) {
        return false;
    }

    return typeof value.title === 'string'
        && typeof value.extract === 'string'
        && typeof value.content_urls.desktop.page === 'string'
        && (value.thumbnail === undefined || isImage(value.thumbnail))
        && (value.originalimage === undefined || isImage(value.originalimage));
}

function isWikiSearchResponse(value: unknown): value is WikiSearchResponse {
    return isRecord(value)
        && isRecord(value.query)
        && Array.isArray(value.query.search)
        && value.query.search.every((item) => isRecord(item) && typeof item.title === 'string');
}

function normalizeLocale(lang: string): Locale {
    return isValidLocale(lang) ? lang : 'tr';
}

export async function getWikiSummary(pageName: string, lang = 'tr'): Promise<WikiSummaryResponse | null> {
    const locale = normalizeLocale(lang);

    try {
        return await fetchJson(
            `https://${locale}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageName)}`,
            isWikiSummaryResponse,
            { revalidate: 86400 }
        );
    } catch (error) {
        console.error(`Failed to fetch Wikipedia data for ${pageName}:`, error);
        return null;
    }
}

export async function fetchWikiSummaryByQuery(query: string, lang = 'tr'): Promise<WikiSummaryResponse | null> {
    const locale = normalizeLocale(lang);

    try {
        const searchData = await fetchJson(
            `https://${locale}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=1`,
            isWikiSearchResponse,
            { revalidate: 3600 }
        );

        const exactTitle = searchData.query.search[0]?.title;

        if (!exactTitle) {
            return null;
        }

        return await getWikiSummary(exactTitle, locale);
    } catch (error) {
        console.error(`Failed to search Wikipedia for ${query}:`, error);
        return null;
    }
}
