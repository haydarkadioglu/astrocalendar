import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { BASE_BODIES, getBodyDefinition } from '@/data/bodies';
import { getWikiSummary } from '@/services/wikipedia';
import styles from './page.module.css';

interface BodyDetailPageProps {
    params: Promise<{ locale: string; bodyId: string }>;
    searchParams: Promise<{ title?: string }>;
}

export async function generateStaticParams() {
    return BASE_BODIES.map((body) => ({ bodyId: body.id }));
}

export default async function BodyDetailPage({ params, searchParams }: BodyDetailPageProps) {
    const [{ locale, bodyId }, query] = await Promise.all([params, searchParams]);
    const t = await getTranslations({ locale, namespace: 'Encyclopedia' });
    const definition = getBodyDefinition(bodyId);

    const requestedTitle = query.title?.trim();
    const pageTitle = definition
        ? (locale === 'tr' ? definition.wikiTitleTr : definition.wikiTitleEn)
        : requestedTitle;

    if (!pageTitle) {
        notFound();
    }

    const wikiData = await getWikiSummary(pageTitle, locale);

    if (!wikiData) {
        notFound();
    }

    const facts = definition?.facts;
    const factItems = [
        {
            label: t('bodyDetails.type'),
            value: definition ? (locale === 'tr' ? definition.typeTr : definition.typeEn) : t('searchResultType')
        },
        {
            label: t('bodyDetails.distance'),
            value: locale === 'tr' ? facts?.distanceTr : facts?.distanceEn
        },
        {
            label: t('bodyDetails.radius'),
            value: locale === 'tr' ? facts?.radiusTr : facts?.radiusEn
        },
        {
            label: t('bodyDetails.gravity'),
            value: locale === 'tr' ? facts?.gravityTr : facts?.gravityEn
        },
        {
            label: t('bodyDetails.discoverer'),
            value: locale === 'tr' ? facts?.discovererTr : facts?.discovererEn
        }
    ].filter((item) => item.value);

    const image = wikiData.originalimage?.source || wikiData.thumbnail?.source || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200';

    return (
        <div className={styles.container}>
            <div className={styles.backRow}>
                <Link href="/bodies" className={styles.backLink}>{t('bodyDetails.backToList')}</Link>
            </div>

            <section className={styles.hero}>
                <div className={styles.imageWrap}>
                    <Image
                        src={image}
                        alt={wikiData.title}
                        fill
                        className={styles.heroImage}
                        sizes="(max-width: 900px) 100vw, 50vw"
                        unoptimized
                    />
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.kicker}>{t('bodyDetails.overview')}</span>
                    <h1 className={styles.title}>{wikiData.title}</h1>
                    <p className={styles.description}>{wikiData.extract}</p>

                    <div className={styles.actions}>
                        <a href={wikiData.content_urls.desktop.page} target="_blank" rel="noreferrer" className={styles.primaryAction}>
                            {t('bodyDetails.readMore')}
                        </a>
                        <Link href="/bodies" className={styles.secondaryAction}>
                            {t('bodyDetails.backToList')}
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.factsSection}>
                <div className={styles.sectionHeader}>
                    <h2>{t('bodyDetails.quickFacts')}</h2>
                </div>

                <div className={styles.factGrid}>
                    {factItems.map((fact) => (
                        <div key={fact.label} className={styles.factCard}>
                            <span className={styles.factLabel}>{fact.label}</span>
                            <strong className={styles.factValue}>{fact.value}</strong>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
