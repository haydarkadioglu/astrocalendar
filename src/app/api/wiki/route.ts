import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'tr';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        // Step 1: Use Wikipedia Search API to find the exact page title
        // This makes the search forgiving of typos and casing
        const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`;
        const searchRes = await fetch(searchUrl);

        if (!searchRes.ok) {
            return NextResponse.json({ error: 'Wiki search request failed' }, { status: searchRes.status });
        }

        const searchData = await searchRes.json();
        const searchResults = searchData.query?.search;

        if (!searchResults || searchResults.length === 0) {
            return NextResponse.json({ error: 'Wiki page not found' }, { status: 404 });
        }

        // Step 2: Fetch the summary using the exact title of the first search result
        const exactTitle = searchResults[0].title;

        const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(exactTitle)}`;
        const summaryRes = await fetch(summaryUrl, { next: { revalidate: 3600 } });

        if (!summaryRes.ok) {
            return NextResponse.json({ error: 'Wiki summary not found' }, { status: summaryRes.status });
        }

        const data = await summaryRes.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Wiki API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
