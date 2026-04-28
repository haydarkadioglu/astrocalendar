import 'server-only';

import { externalApiConfig } from './env';

type Validator<T> = (value: unknown) => value is T;

interface FetchOptions extends RequestInit {
    timeoutMs?: number;
    revalidate?: number;
}

export class ExternalApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ExternalApiError';
        this.status = status;
    }
}

function buildRequestInit({ timeoutMs: _timeoutMs, revalidate, next, ...init }: FetchOptions): RequestInit {
    void _timeoutMs;

    return {
        ...init,
        ...(revalidate !== undefined ? { next: { ...next, revalidate } } : next ? { next } : {})
    };
}

async function withTimeout<T>(promiseFactory: (signal: AbortSignal) => Promise<T>, timeoutMs = externalApiConfig.timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await promiseFactory(controller.signal);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ExternalApiError(`Request timed out after ${timeoutMs}ms`);
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function fetchJson<T>(
    url: string,
    validator: Validator<T>,
    options: FetchOptions = {}
): Promise<T> {
    const response = await withTimeout((signal) => fetch(url, {
        ...buildRequestInit(options),
        signal
    }), options.timeoutMs);

    if (!response.ok) {
        throw new ExternalApiError(`Request failed for ${url}`, response.status);
    }

    const data = await response.json();

    if (!validator(data)) {
        throw new ExternalApiError(`Unexpected response schema for ${url}`);
    }

    return data;
}

export async function fetchText(url: string, options: FetchOptions = {}): Promise<string> {
    const response = await withTimeout((signal) => fetch(url, {
        ...buildRequestInit(options),
        signal
    }), options.timeoutMs);

    if (!response.ok) {
        throw new ExternalApiError(`Request failed for ${url}`, response.status);
    }

    return response.text();
}
