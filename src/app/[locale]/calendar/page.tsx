import { getTranslations } from 'next-intl/server';
import EventCard from '@/components/EventCard';
import styles from './page.module.css';
import { fetchAstronomicalEvents } from '@/services/astronomy';

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calendar' });

    // Fetch dynamic astronomy events from Time And Date
    const allEvents = await fetchAstronomicalEvents();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {t('title')} <span className="text-gradient">{t('titleStrong')}</span>
                </h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                <div className={styles.controls}>
                    <div className={styles.filters}>
                        <button className={`${styles.filterBtn} ${styles.active}`}>{t('filters.all')}</button>
                        <button className={styles.filterBtn}>{t('filters.meteor')}</button>
                        <button className={styles.filterBtn}>{t('filters.eclipse')}</button>
                        <button className={styles.filterBtn}>{t('filters.conjunction')}</button>
                        <button className={styles.filterBtn}>{t('filters.satellite')}</button>
                    </div>

                    <div className={styles.viewToggle}>
                        <button className={`${styles.toggleBtn} ${styles.active}`}>
                            <span className={styles.icon}>☷</span>
                        </button>
                        <button className={styles.toggleBtn}>
                            <span className={styles.icon}>≣</span>
                        </button>
                    </div>
                </div>
            </header>

            <section className={styles.monthSection}>
                <h2 className={styles.monthTitle}>Astronomical Highlights 2026</h2>
                <div className={styles.grid}>
                    {allEvents.length > 0 ? allEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            title={locale === 'tr' ? event.titleTr : event.titleEn}
                            date={locale === 'tr' ? event.dateTr : event.dateEn}
                            category={locale === 'tr' ? event.categoryTr : event.categoryEn}
                            description={locale === 'tr' ? event.descriptionTr : event.descriptionEn}
                            intensity={locale === 'tr' ? event.intensityTr : event.intensityEn}
                            image={undefined}
                        />
                    )) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>
                            {locale === 'tr' ? 'Etkinlikler yüklenemedi...' : 'Failed to load events...'}
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
