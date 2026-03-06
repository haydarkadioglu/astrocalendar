import * as cheerio from 'cheerio';

export interface AstronomyEvent {
    id: string;
    titleEn: string;
    titleTr: string;
    dateEn: string;
    dateTr: string;
    category: 'meteor' | 'eclipse' | 'conjunction' | 'satellite' | 'moon' | 'other';
    categoryEn: string;
    categoryTr: string;
    descriptionEn: string;
    descriptionTr: string;
    intensityEn: string;
    intensityTr: string;
    rawDate: number;
}

// Simple categorization helper
function categorizeEvent(title: string): Partial<AstronomyEvent> {
    const t = title.toLowerCase();

    if (t.includes('meteor')) {
        return {
            category: 'meteor',
            categoryEn: 'Meteor Shower',
            categoryTr: 'Meteor Yağmuru',
            intensityEn: 'High',
            intensityTr: 'Yüksek'
        };
    }
    if (t.includes('eclipse')) {
        return {
            category: 'eclipse',
            categoryEn: 'Eclipse',
            categoryTr: 'Tutulma',
            intensityEn: 'Excellent',
            intensityTr: 'Harika'
        };
    }
    if (t.includes('moon') || t.includes('earthshine')) {
        return {
            category: 'moon',
            categoryEn: 'Moon Event',
            categoryTr: 'Ay Olayı',
            intensityEn: 'Good',
            intensityTr: 'İyi'
        };
    }
    if (t.includes('conjunction') || t.includes('opposition') || t.includes('elongation') || t.includes('perihelion') || t.includes('equinox') || t.includes('solstice')) {
        return {
            category: 'conjunction',
            categoryEn: 'Planetary Event',
            categoryTr: 'Gezegen Olayı',
            intensityEn: 'Moderate',
            intensityTr: 'Orta'
        };
    }

    return {
        category: 'other',
        categoryEn: 'Astronomy Event',
        categoryTr: 'Gökyüzü Olayı',
        intensityEn: 'Varies',
        intensityTr: 'Değişken'
    };
}

// Date translation helper (very naive for demonstration)
function translateDateInfo(dateStr: string): string {
    const months: Record<string, string> = {
        'Jan': 'Oca', 'Feb': 'Şub', 'Mar': 'Mar', 'Apr': 'Nis',
        'May': 'May', 'Jun': 'Haz', 'Jul': 'Tem', 'Aug': 'Ağu',
        'Sep': 'Eyl', 'Oct': 'Eki', 'Nov': 'Kas', 'Dec': 'Ara'
    };

    let result = dateStr;
    Object.keys(months).forEach(enMonth => {
        result = result.replace(enMonth, months[enMonth]);
    });
    return result;
}

// Parse "Jan 3" or "Jan 3/4" into a valid Date object for the current year
function parseEventDate(dateStr: string, year: number): Date {
    const cleanDate = dateStr.split('/')[0].trim();
    return new Date(`${cleanDate} ${year}`);
}

export async function fetchAstronomicalEvents(): Promise<AstronomyEvent[]> {
    try {
        const res = await fetch('https://www.timeanddate.com/astronomy/sights-to-see.html', {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch events, status: ${res.status}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);
        const events: AstronomyEvent[] = [];
        const currentYear = new Date().getFullYear();

        $('article h2, article h3, .article__content h2, .article__content h3').each((i, el) => {
            const rawText = $(el).text().trim();
            // Expected format: "Jan 3: Wolf Moon" or "Jan 3/4: Quadrantid Meteor Shower"
            if (!rawText.includes(':')) return;

            const [datePart, ...titleParts] = rawText.split(':');
            const title = titleParts.join(':').trim();
            const dateEn = datePart.trim();

            const nextP = $(el).nextUntil('h2, h3').filter('p').first().text().trim();

            if (title && nextP) {
                const categoryInfo = categorizeEvent(title);
                const eventDate = parseEventDate(dateEn, currentYear);

                events.push({
                    id: `event-${i}`,
                    titleEn: title,
                    titleTr: title,
                    dateEn: dateEn,
                    dateTr: translateDateInfo(dateEn),
                    descriptionEn: nextP,
                    descriptionTr: nextP,
                    rawDate: eventDate.getTime(),
                    ...(categoryInfo as any)
                });
            }
        });

        // Sort chronologically
        events.sort((a, b) => a.rawDate - b.rawDate);

        return events;
    } catch (error) {
        console.error('Scraping error:', error);
        return [];
    }
}
