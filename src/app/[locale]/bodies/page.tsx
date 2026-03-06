import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';
import { getWikiSummary } from '@/services/wikipedia';
import LiveSearch from '@/components/LiveSearch';

// The base list of bodies we want to track.
const BASE_BODIES = [
    { id: 'sun', wikiTitleTr: 'Güneş', wikiTitleEn: 'Sun', typeEn: 'Star', typeTr: 'Yıldız' },
    { id: 'mercury', wikiTitleTr: 'Merkür', wikiTitleEn: 'Mercury (planet)', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'venus', wikiTitleTr: 'Venüs', wikiTitleEn: 'Venus', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'earth', wikiTitleTr: 'Dünya', wikiTitleEn: 'Earth', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'mars', wikiTitleTr: 'Mars', wikiTitleEn: 'Mars', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'jupiter', wikiTitleTr: 'Jüpiter', wikiTitleEn: 'Jupiter', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'saturn', wikiTitleTr: 'Satürn', wikiTitleEn: 'Saturn', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'uranus', wikiTitleTr: 'Uranüs', wikiTitleEn: 'Uranus', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'neptune', wikiTitleTr: 'Neptün', wikiTitleEn: 'Neptune', typeEn: 'Planet', typeTr: 'Gezegen' },
    { id: 'moon', wikiTitleTr: 'Ay', wikiTitleEn: 'Moon', typeEn: 'Moon', typeTr: 'Uydu' },
    { id: 'pluto', wikiTitleTr: 'Plüton', wikiTitleEn: 'Pluto', typeEn: 'Dwarf Planet', typeTr: 'Cüce Gezegen' },
    { id: 'andromeda', wikiTitleTr: 'Andromeda_Galaksisi', wikiTitleEn: 'Andromeda_Galaxy', typeEn: 'Spiral Galaxy', typeTr: 'Sarmal Galaksi' }
];

export default async function BodiesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Encyclopedia' });

    // Fetch initial base data on server side
    const bodiesWithData = await Promise.all(
        BASE_BODIES.map(async (body) => {
            const pageName = locale === 'tr' ? body.wikiTitleTr : body.wikiTitleEn;
            const type = locale === 'tr' ? body.typeTr : body.typeEn;

            const wikiData = await getWikiSummary(pageName, locale);

            return {
                id: body.id,
                name: wikiData?.title || body.wikiTitleTr.replace(/_/g, ' '),
                type: type,
                // Fallback to a placeholder if wikipedia has no main image
                image: wikiData?.thumbnail?.source || wikiData?.originalimage?.source || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
                description: wikiData?.extract || 'Açıklama yüklenemedi / No description available.',
            };
        })
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {t('title')} <span className="text-gradient">{t('titleStrong')}</span>
                </h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                <div className={styles.filters}>
                    <button className={`${styles.filterBtn} ${styles.active}`}>{t('categories.all')}</button>
                    <button className={styles.filterBtn}>{t('categories.planets')}</button>
                    <button className={styles.filterBtn}>{t('categories.moons')}</button>
                    <button className={styles.filterBtn}>{t('categories.galaxies')}</button>
                </div>
            </header>

            {/* Hand off the pre-fetched data and locale string to client component */}
            <LiveSearch initialBodies={bodiesWithData} locale={locale} />
        </div>
    );
}
