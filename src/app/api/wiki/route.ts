import { NextRequest, NextResponse } from 'next/server';
import { isValidLocale } from '@/i18n/routing';
import { fetchWikiSummaryByQuery } from '@/services/wikipedia';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();
    const langParam = searchParams.get('lang') || 'tr';
    const lang = isValidLocale(langParam) ? langParam : 'tr';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (query.length > 120) {
        return NextResponse.json({ error: 'Query is too long' }, { status: 400 });
    }

    try {
        const data = await fetchWikiSummaryByQuery(query, lang);

        if (!data) {
            return NextResponse.json({ error: 'Wiki page not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Wiki API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
