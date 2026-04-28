import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import EventCard from '@/components/EventCard';
import ObservationConditions from '@/components/ObservationConditions';
import { fetchAstronomicalEvents } from '@/services/astronomy';
import { fetchApod, fetchApodGallery, fetchDonkiEvents, fetchEpicImages, fetchNearEarthObjects } from '@/services/nasa';
import styles from './page.module.css';

function clampText(text: string, length: number) {
    return text.length > length ? `${text.slice(0, length)}...` : text;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'HomePage' });

    const [apodData, apodGallery, allEvents, neoObjects, donkiEvents, epicImages] = await Promise.all([
        fetchApod(),
        fetchApodGallery(4),
        fetchAstronomicalEvents(),
        fetchNearEarthObjects(),
        fetchDonkiEvents(),
        fetchEpicImages()
    ]);

    const apodImage = apodData.media_type === 'image'
        ? (apodData.hdurl || apodData.url)
        : (apodData.thumbnail_url || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200');
    const upcomingEvents = allEvents.slice(0, 4);
    const featuredEpic = epicImages[0];

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        {t('title')} <br />
                        <span className="text-gradient">{t('titleStrong')}</span>
                    </h1>
                    <p className={styles.heroSubtitle}>{t('subtitle')}</p>
                    <div className={styles.heroButtons}>
                        <Link href="/calendar" className={styles.primaryButton}>{t('buttonTonight')}</Link>
                        <Link href="/planetarium" className={styles.secondaryButton}>{t('buttonPlan')}</Link>
                    </div>
                </div>

                <div className={`glass-panel ${styles.apodCard}`}>
                    <div className={styles.apodImageWrapper} style={{ backgroundImage: `url(${apodImage})` }}>
                        {apodData.media_type === 'video' ? (
                            <iframe src={apodData.url} title={apodData.title} style={{ width: '100%', height: '100%', border: 'none' }} />
                        ) : null}
                    </div>
                    <div className={styles.apodInfo}>
                        <div className={styles.apodMetaRow}>
                            <span className={styles.apodTag}>{t('apodTag')}</span>
                            <span className={styles.apodDate}>{apodData.date}</span>
                        </div>
                        <h3 className={styles.apodTitleText}>{apodData.title}</h3>
                        <p className={styles.apodDescText}>{clampText(apodData.explanation, 180)}</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{t('nasaToday')} <span className="text-gradient">{t('nasaTodayStrong')}</span></h2>
                </div>

                <div className={styles.featureGrid}>
                    <div className={`glass-panel ${styles.galleryPanel}`}>
                        <div className={styles.panelHeader}>
                            <h3>{t('apodGalleryTitle')}</h3>
                            <span>{apodGallery.length}</span>
                        </div>
                        <div className={styles.galleryGrid}>
                            {apodGallery.map((item) => {
                                const imageUrl = item.media_type === 'image'
                                    ? (item.url || item.hdurl)
                                    : (item.thumbnail_url || apodImage);
                                return (
                                    <div key={`${item.date}-${item.title}`} className={styles.galleryCard}>
                                        <a
                                            href={imageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.galleryThumb}
                                            style={{ backgroundImage: `url(${imageUrl})` }}
                                            title={item.title}
                                        />
                                        <div className={styles.galleryBody}>
                                            <strong>{item.title}</strong>
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`glass-panel ${styles.sidePanel}`}>
                        <div className={styles.panelHeader}>
                            <h3>{t('epicTitle')}</h3>
                            <span>{featuredEpic ? featuredEpic.date.slice(0, 10) : '--'}</span>
                        </div>
                        {featuredEpic ? (
                            <a
                                href={featuredEpic.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.epicHero}
                                style={{ backgroundImage: `url(${featuredEpic.image})` }}
                                title={featuredEpic.caption}
                            />
                        ) : (
                            <p className={styles.panelCopy}>{t('emptyEpic')}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{t('upcomingEvents')} <span className="text-gradient">{t('upcomingEventsStrong')}</span></h2>
                    <Link href="/calendar" className={styles.viewAll}>{t('viewAll')}</Link>
                </div>

                <div className={styles.grid}>
                    {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            title={locale === 'tr' ? event.titleTr : event.titleEn}
                            date={locale === 'tr' ? event.dateTr : event.dateEn}
                            category={locale === 'tr' ? event.categoryTr : event.categoryEn}
                            categoryType={event.category}
                            description={locale === 'tr' ? event.descriptionTr : event.descriptionEn}
                            intensity={locale === 'tr' ? event.intensityTr : event.intensityEn}
                            intensityLabel={t('observationQualityLabel')}
                        />
                    )) : (
                        <p className={styles.emptyCopy}>{t('emptyEvents')}</p>
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{t('observationConditions')} <span className="text-gradient">{t('observationConditionsStrong')}</span></h2>
                </div>
                <ObservationConditions />
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{t('neoTitle')} <span className="text-gradient">{t('neoTitleStrong')}</span></h2>
                    <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer" className={styles.viewAll}>{t('sourceLabel')}</a>
                </div>

                <div className={styles.dataGrid}>
                    {neoObjects.length > 0 ? neoObjects.map((item) => (
                        <article key={item.id} className={`glass-panel ${styles.dataCard}`}>
                            <div className={styles.cardTopRow}>
                                <span className={`${styles.pill} ${item.hazardous ? styles.pillAlert : styles.pillOk}`}>
                                    {item.hazardous ? t('hazardous') : t('notHazardous')}
                                </span>
                                <span className={styles.dataDate}>{item.date}</span>
                            </div>
                            <h3>{item.name}</h3>
                            <dl className={styles.metricList}>
                                <div>
                                    <dt>{t('missDistance')}</dt>
                                    <dd>{Math.round(item.missDistanceKilometers).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')} km</dd>
                                </div>
                                <div>
                                    <dt>{t('diameter')}</dt>
                                    <dd>{Math.round(item.estimatedDiameterMeters)} m</dd>
                                </div>
                                <div>
                                    <dt>{t('velocity')}</dt>
                                    <dd>{Math.round(item.relativeVelocityKph).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')} km/h</dd>
                                </div>
                            </dl>
                            <a href={item.nasaJplUrl} target="_blank" rel="noreferrer" className={styles.inlineLink}>{t('readSource')}</a>
                        </article>
                    )) : (
                        <p className={styles.emptyCopy}>{t('emptyNeo')}</p>
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>{t('donkiTitle')} <span className="text-gradient">{t('donkiTitleStrong')}</span></h2>
                    <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer" className={styles.viewAll}>{t('sourceLabel')}</a>
                </div>

                <div className={styles.dataGrid}>
                    {donkiEvents.length > 0 ? donkiEvents.map((event) => (
                        <article key={event.id} className={`glass-panel ${styles.dataCard}`}>
                            <div className={styles.cardTopRow}>
                                <span className={styles.pill}>{event.type}</span>
                                <span className={styles.dataDate}>{new Date(event.date).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')}</span>
                            </div>
                            <h3>{event.title}</h3>
                            <p className={styles.panelCopy}>{event.details}</p>
                            <p className={styles.sourceRow}>{t('sourceField')}: {event.source}</p>
                            {event.link ? (
                                <a href={event.link} target="_blank" rel="noreferrer" className={styles.inlineLink}>{t('readSource')}</a>
                            ) : null}
                        </article>
                    )) : (
                        <p className={styles.emptyCopy}>{t('emptyDonki')}</p>
                    )}
                </div>
            </section>
        </div>
    );
}
