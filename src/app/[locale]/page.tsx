import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';
import EventCard from '@/components/EventCard';
import ObservationConditions from '@/components/ObservationConditions';
import { fetchApod } from '@/services/nasa';
import { fetchAstronomicalEvents } from '@/services/astronomy';
import { Link } from '@/i18n/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  // Fetch dynamic NASA APOD mapping
  const apodData = await fetchApod();
  const apodImage = apodData?.media_type === 'image' ? (apodData.url || apodData.hdurl) : 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200';
  const apodTitle = apodData?.title || 'Andromeda Galaksisi';
  const apodDesc = apodData?.explanation || 'M31 olarak da bilinen bu dev sarmal galaksi, bize en yakın büyük galaksidir.';

  // Fetch upcoming astronomical events (take first 4)
  const allEvents = await fetchAstronomicalEvents();
  const upcomingEvents = allEvents.slice(0, 4);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t('title')} <br />
            <span className="text-gradient">{t('titleStrong')}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {t('subtitle')}
          </p>
          <div className={styles.heroButtons}>
            <Link href="/calendar" className={styles.primaryButton}>{t('buttonTonight')}</Link>
            <Link href="/planetarium" className={styles.secondaryButton}>{t('buttonPlan')}</Link>
          </div>
        </div>

        {/* APOD Dynamic Component */}
        <div className={`glass-panel ${styles.apodCard}`}>
          <div className={styles.apodImageWrapper} style={{ backgroundImage: `url(${apodImage})` }}>
            {/* Use background image to fit */}
            {apodData?.media_type === 'video' && (
              <iframe src={apodData.url} title={apodTitle} style={{ width: '100%', height: '100%', border: 'none' }} />
            )}
          </div>
          <div className={styles.apodInfo}>
            <span className={styles.apodTag}>{t('apodTag')}</span>
            <h3 className={styles.apodTitleText}>{apodTitle}</h3>
            <p className={styles.apodDescText}>{apodDesc.length > 150 ? apodDesc.substring(0, 150) + '...' : apodDesc}</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{t('upcomingEvents')} <span className="text-gradient">{t('upcomingEventsStrong')}</span></h2>
          <Link href="/calendar" className={styles.viewAll}>{t('viewAll')}</Link>
        </div>

        <div className={styles.grid}>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                title={locale === 'tr' ? event.titleTr : event.titleEn}
                date={locale === 'tr' ? event.dateTr : event.dateEn}
                category={locale === 'tr' ? event.categoryTr : event.categoryEn}
                categoryType={event.category}
                description={locale === 'tr' ? event.descriptionTr : event.descriptionEn}
                intensity={locale === 'tr' ? event.intensityTr : event.intensityEn}
                intensityLabel={locale === 'tr' ? 'Gozlem Sansi' : 'Observation Quality'}
              />
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>
              {locale === 'tr' ? 'Yaklaşan etkinlik bulunamadı.' : 'No upcoming events found.'}
            </p>
          )}
        </div>
      </section>

      {/* Observation Conditions Snapshot */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{t('observationConditions')} <span className="text-gradient">{t('observationConditionsStrong')}</span></h2>
        </div>
        <ObservationConditions />
      </section>
    </div>
  );
}
