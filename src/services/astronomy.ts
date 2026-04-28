import 'server-only';

import * as cheerio from 'cheerio';
import { AstronomyCategory, AstronomyEvent } from '@/types/astronomy';
import { fetchText } from './http';

interface EventCategoryInfo {
    category: AstronomyCategory;
    categoryEn: string;
    categoryTr: string;
    intensityEn: string;
    intensityTr: string;
}

const FALLBACK_EVENTS: AstronomyEvent[] = [
    {
        id: 'fallback-perseids',
        titleEn: 'Perseid Meteor Shower Peak',
        titleTr: 'Perseid Meteor Yagmuru Zirvesi',
        dateEn: 'Aug 12/13',
        dateTr: '12/13 Agu',
        category: 'meteor',
        categoryEn: 'Meteor Shower',
        categoryTr: 'Meteor Yagmuru',
        descriptionEn: 'One of the most reliable annual meteor showers, often producing bright and frequent meteors.',
        descriptionTr: 'Her yil guvenilir sekilde gozlenen, parlak ve sik meteorlar uretebilen yillik meteor yagmurlarindan biridir.',
        intensityEn: 'High',
        intensityTr: 'Yuksek',
        rawDate: new Date(`${new Date().getFullYear()}-08-12T00:00:00Z`).getTime()
    },
    {
        id: 'fallback-geminids',
        titleEn: 'Geminid Meteor Shower Peak',
        titleTr: 'Geminid Meteor Yagmuru Zirvesi',
        dateEn: 'Dec 13/14',
        dateTr: '13/14 Ara',
        category: 'meteor',
        categoryEn: 'Meteor Shower',
        categoryTr: 'Meteor Yagmuru',
        descriptionEn: 'The Geminids are typically among the strongest meteor showers of the year.',
        descriptionTr: 'Geminidler genellikle yilin en guclu meteor yagmurlarindan biri olarak kabul edilir.',
        intensityEn: 'High',
        intensityTr: 'Yuksek',
        rawDate: new Date(`${new Date().getFullYear()}-12-13T00:00:00Z`).getTime()
    }
];

function categorizeEvent(title: string): EventCategoryInfo {
    const normalized = title.toLowerCase();

    if (normalized.includes('meteor')) {
        return {
            category: 'meteor',
            categoryEn: 'Meteor Shower',
            categoryTr: 'Meteor Yagmuru',
            intensityEn: 'High',
            intensityTr: 'Yuksek'
        };
    }

    if (normalized.includes('eclipse')) {
        return {
            category: 'eclipse',
            categoryEn: 'Eclipse',
            categoryTr: 'Tutulma',
            intensityEn: 'Excellent',
            intensityTr: 'Harika'
        };
    }

    if (normalized.includes('moon') || normalized.includes('earthshine')) {
        return {
            category: 'moon',
            categoryEn: 'Moon Event',
            categoryTr: 'Ay Olayi',
            intensityEn: 'Good',
            intensityTr: 'Iyi'
        };
    }

    if (
        normalized.includes('conjunction')
        || normalized.includes('opposition')
        || normalized.includes('elongation')
        || normalized.includes('perihelion')
        || normalized.includes('equinox')
        || normalized.includes('solstice')
    ) {
        return {
            category: 'conjunction',
            categoryEn: 'Planetary Event',
            categoryTr: 'Gezegen Olayi',
            intensityEn: 'Moderate',
            intensityTr: 'Orta'
        };
    }

    return {
        category: 'other',
        categoryEn: 'Astronomy Event',
        categoryTr: 'Gokyuzu Olayi',
        intensityEn: 'Varies',
        intensityTr: 'Degisken'
    };
}

function translateDateInfo(dateStr: string): string {
    const months: Record<string, string> = {
        Jan: 'Oca',
        Feb: 'Sub',
        Mar: 'Mar',
        Apr: 'Nis',
        May: 'May',
        Jun: 'Haz',
        Jul: 'Tem',
        Aug: 'Agu',
        Sep: 'Eyl',
        Oct: 'Eki',
        Nov: 'Kas',
        Dec: 'Ara'
    };

    let result = dateStr;
    Object.keys(months).forEach((enMonth) => {
        result = result.replace(enMonth, months[enMonth]);
    });
    return result;
}

function parseEventDate(dateStr: string, year: number): Date {
    const cleanDate = dateStr.split('/')[0].trim();
    return new Date(`${cleanDate} ${year}`);
}

function normalizeToNextOccurrence(dateStr: string, now: Date) {
    const currentYear = now.getFullYear();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let eventDate = parseEventDate(dateStr, currentYear);

    if (eventDate.getTime() < today.getTime()) {
        eventDate = parseEventDate(dateStr, currentYear + 1);
    }

    return eventDate;
}

function buildFallbackEvents() {
    return [...FALLBACK_EVENTS].sort((a, b) => a.rawDate - b.rawDate);
}

export async function fetchAstronomicalEvents(): Promise<AstronomyEvent[]> {
    try {
        const html = await fetchText('https://www.timeanddate.com/astronomy/sights-to-see.html', {
            revalidate: 86400
        });

        const $ = cheerio.load(html);
        const events: AstronomyEvent[] = [];
        const now = new Date();

        $('article h2, article h3, .article__content h2, .article__content h3').each((i, el) => {
            const rawText = $(el).text().trim();
            if (!rawText.includes(':')) {
                return;
            }

            const [datePart, ...titleParts] = rawText.split(':');
            const title = titleParts.join(':').trim();
            const dateEn = datePart.trim();
            const nextParagraph = $(el).nextUntil('h2, h3').filter('p').first().text().trim();

            if (!title || !nextParagraph) {
                return;
            }

            const categoryInfo = categorizeEvent(title);
            const eventDate = normalizeToNextOccurrence(dateEn, now);

            events.push({
                id: `event-${i}`,
                titleEn: title,
                titleTr: title,
                dateEn,
                dateTr: translateDateInfo(dateEn),
                descriptionEn: nextParagraph,
                descriptionTr: nextParagraph,
                rawDate: eventDate.getTime(),
                ...categoryInfo
            });
        });

        if (events.length === 0) {
            return buildFallbackEvents();
        }

        return events.sort((a, b) => a.rawDate - b.rawDate);
    } catch (error) {
        console.error('Failed to fetch astronomical events:', error);
        return buildFallbackEvents();
    }
}
