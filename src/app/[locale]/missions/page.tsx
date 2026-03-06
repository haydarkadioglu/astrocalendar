import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';

// Static Data for Timeline (Server-Side)
const MISSIONS_DATA = [
    {
        id: 'artemis1',
        titleEn: 'Artemis I',
        titleTr: 'Artemis I',
        dateEn: 'Nov 16, 2022',
        dateTr: '16 Kas 2022',
        status: 'completed',
        type: 'uncrewed',
        descEn: 'The first flight of the Space Launch System (SLS) and the Orion spacecraft. It paved the way for future human exploration of the Moon.',
        descTr: 'Uzay Fırlatma Sistemi (SLS) ve Orion uzay aracının ilk uçuşu. Ay\'ın gelecekteki insanlı keşfi için zemin hazırladı.',
        agency: 'NASA / ESA',
        destinationEn: 'Lunar Orbit',
        destinationTr: 'Ay Yörüngesi'
    },
    {
        id: 'jwst',
        titleEn: 'James Webb Space Telescope',
        titleTr: 'James Webb Uzay Teleskobu',
        dateEn: 'Dec 25, 2021',
        dateTr: '25 Ara 2021',
        status: 'active',
        type: 'telescope',
        descEn: 'The largest optical telescope in space, designed to conduct infrared astronomy and look back to the origins of the universe.',
        descTr: 'Kızılötesi astronomi yapmak ve evrenin kökenlerine bakmak için tasarlanmış uzaydaki en büyük optik teleskop.',
        agency: 'NASA / ESA / CSA',
        destinationEn: 'Sun-Earth L2',
        destinationTr: 'Güneş-Dünya L2'
    },
    {
        id: 'perseverance',
        titleEn: 'Mars Perseverance Rover',
        titleTr: 'Mars Perseverance Aracı',
        dateEn: 'July 30, 2020',
        dateTr: '30 Tem 2020',
        status: 'active',
        type: 'robotic',
        descEn: 'A rover designed to explore the Jezero crater on Mars as part of NASA\'s Mars 2020 mission, carrying the Ingenuity helicopter.',
        descTr: 'NASA\'nın Mars 2020 görevinin bir parçası olarak Jezero kraterini keşfetmek üzere tasarlanmış, beraberinde Ingenuity helikopterini taşıyan uzay aracı.',
        agency: 'NASA',
        destinationEn: 'Mars',
        destinationTr: 'Mars'
    },
    {
        id: 'cassini',
        titleEn: 'Cassini-Huygens',
        titleTr: 'Cassini-Huygens',
        dateEn: 'Oct 15, 1997',
        dateTr: '15 Eki 1997',
        status: 'completed',
        type: 'robotic',
        descEn: 'A collaborative mission to study the planet Saturn and its system, including its rings and natural satellites.',
        descTr: 'Satürn gezegenini, halkalarını ve uydularını detaylı bir şekilde incelemek için yapılan ortak uzay görevi.',
        agency: 'NASA / ESA / ASI',
        destinationEn: 'Saturn',
        destinationTr: 'Satürn'
    },
    {
        id: 'apollo11',
        titleEn: 'Apollo 11',
        titleTr: 'Apollo 11',
        dateEn: 'July 16, 1969',
        dateTr: '16 Tem 1969',
        status: 'completed',
        type: 'crewed',
        descEn: 'The historic spaceflight that first landed humans on the Moon. Commanders Neil Armstrong and Buzz Aldrin formed the American crew.',
        descTr: 'İnsanları Ay\'a ilk indiren tarihi uzay uçuşu. Komutan Neil Armstrong ve Buzz Aldrin Amerikan mürettebatını oluşturdu.',
        agency: 'NASA',
        destinationEn: 'The Moon',
        destinationTr: 'Ay'
    }
];

export default async function MissionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // We await translations in Next 15 Server components
    const t = await getTranslations({ locale, namespace: 'Missions' });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {t('title')} <span className="text-gradient">{t('titleStrong')}</span>
                </h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                <div className={styles.filters}>
                    <button className={`${styles.filterBtn} ${styles.active}`}>{t('filters.all')}</button>
                    <button className={styles.filterBtn}>{t('filters.crewed')}</button>
                    <button className={styles.filterBtn}>{t('filters.robotic')}</button>
                    <button className={styles.filterBtn}>{t('filters.telescope')}</button>
                </div>
            </header>

            <div className={styles.timeline}>
                {MISSIONS_DATA.map((mission) => (
                    <div key={mission.id} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.cardTitle}>{locale === 'en' ? mission.titleEn : mission.titleTr}</h3>
                                    <span className={styles.cardDate}>{locale === 'en' ? mission.dateEn : mission.dateTr}</span>
                                </div>
                                <span className={`${styles.statusBadge} ${mission.status === 'completed' ? styles.statusCompleted : styles.statusActive}`}>
                                    {t(`status.${mission.status}`)}
                                </span>
                            </div>
                            <p className={styles.cardDesc}>
                                {locale === 'en' ? mission.descEn : mission.descTr}
                            </p>
                            <div className={styles.cardMeta}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>{t('details.agency')}</span>
                                    <span className={styles.metaValue}>{mission.agency}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>{t('details.destination')}</span>
                                    <span className={styles.metaValue}>{locale === 'en' ? mission.destinationEn : mission.destinationTr}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
