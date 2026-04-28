import 'server-only';

function parseNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const externalApiConfig = {
    timeoutMs: parseNumber(process.env.EXTERNAL_API_TIMEOUT_MS, 8000),
    nasaApiKey: process.env.NASA_API_KEY?.trim() || 'DEMO_KEY'
};
