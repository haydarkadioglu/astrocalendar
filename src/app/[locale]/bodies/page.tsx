import { getTranslations } from 'next-intl/server';
import LiveSearch from '@/components/LiveSearch';
import { BASE_BODIES } from '@/data/bodies';
import { getWikiSummary } from '@/services/wikipedia';
import { CelestialBody } from '@/types/bodies';
import styles from './page.module.css';

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
                description: wikiData?.extract || 'Description is temporarily unavailable.',
                articleUrl: wikiData?.content_urls?.desktop?.page,
                wikiTitle: wikiData?.title || pageName.replace(/_/g, ' '),
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
