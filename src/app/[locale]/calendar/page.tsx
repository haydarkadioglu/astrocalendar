import { getTranslations } from 'next-intl/server';
import InteractiveCalendar from './InteractiveCalendar';
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

            </header>

            <section className={styles.monthSection}>
                <InteractiveCalendar events={allEvents} locale={locale} />
            </section>
        </div>
    );
}
