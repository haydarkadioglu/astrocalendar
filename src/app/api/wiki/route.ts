import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'tr';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });

        if (!res.ok) {
            return NextResponse.json({ error: 'Wiki page not found' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Wiki API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch from Wikipedia' }, { status: 500 });
    }
}
