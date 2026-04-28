import { getTranslations } from 'next-intl/server';
import LiveSearch from '@/components/LiveSearch';
import { getWikiSummary } from '@/services/wikipedia';
import { CelestialBody } from '@/types/bodies';
import styles from './page.module.css';

const BASE_BODIES = [
    { id: 'sun', wikiTitleTr: 'Güneş', wikiTitleEn: 'Sun', typeEn: 'Star', typeTr: 'Yıldız', group: 'stars' },
    { id: 'mercury', wikiTitleTr: 'Merkür', wikiTitleEn: 'Mercury (planet)', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'venus', wikiTitleTr: 'Venüs', wikiTitleEn: 'Venus', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'earth', wikiTitleTr: 'Dünya', wikiTitleEn: 'Earth', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'mars', wikiTitleTr: 'Mars', wikiTitleEn: 'Mars', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'jupiter', wikiTitleTr: 'Jüpiter', wikiTitleEn: 'Jupiter', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'saturn', wikiTitleTr: 'Satürn', wikiTitleEn: 'Saturn', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'uranus', wikiTitleTr: 'Uranüs', wikiTitleEn: 'Uranus', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'neptune', wikiTitleTr: 'Neptün', wikiTitleEn: 'Neptune', typeEn: 'Planet', typeTr: 'Gezegen', group: 'planets' },
    { id: 'moon', wikiTitleTr: 'Ay', wikiTitleEn: 'Moon', typeEn: 'Moon', typeTr: 'Uydu', group: 'moons' },
    { id: 'pluto', wikiTitleTr: 'Plüton', wikiTitleEn: 'Pluto', typeEn: 'Dwarf Planet', typeTr: 'Cüce Gezegen', group: 'dwarf_planets' },
    { id: 'andromeda', wikiTitleTr: 'Andromeda_Galaksisi', wikiTitleEn: 'Andromeda_Galaxy', typeEn: 'Spiral Galaxy', typeTr: 'Sarmal Galaksi', group: 'galaxies' }
] as const;

export default async function BodiesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Encyclopedia' });

    const bodiesWithData: CelestialBody[] = await Promise.all(
        BASE_BODIES.map(async (body) => {
            const pageName = locale === 'tr' ? body.wikiTitleTr : body.wikiTitleEn;
            const type = locale === 'tr' ? body.typeTr : body.typeEn;
            const wikiData = await getWikiSummary(pageName, locale);

            return {
                id: body.id,
                name: wikiData?.title || pageName.replace(/_/g, ' '),
                type,
                image: wikiData?.thumbnail?.source || wikiData?.originalimage?.source || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
                description: wikiData?.extract || 'Açıklama yüklenemedi / No description available.',
                articleUrl: wikiData?.content_urls?.desktop?.page,
                group: body.group
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
            </header>

            <LiveSearch initialBodies={bodiesWithData} locale={locale} />
        </div>
    );
}
