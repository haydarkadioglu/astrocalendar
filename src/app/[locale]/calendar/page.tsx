import { getTranslations } from 'next-intl/server';
import EventCard from '@/components/EventCard';
import styles from './page.module.css';

// Using static placeholder data for the astronomical calendar
const CALENDAR_EVENTS = [
    {
        id: 1,
        titleTr: "Perseid Meteor Yağmuru",
        titleEn: "Perseid Meteor Shower",
        dateTr: "12 Ağustos 2026 - Gece Yarısı",
        dateEn: "August 12, 2026 - Midnight",
        category: "meteor",
        categoryTr: "Meteor Yağmuru",
        categoryEn: "Meteor Shower",
        descriptionTr: "Yılın en görkemli meteor yağmuru. Saatte 60-100 arası meteor bekleniyor.",
        descriptionEn: "The most spectacular meteor shower of the year. 60-100 meteors per hour are expected.",
        intensityTr: "Harika",
        intensityEn: "Excellent",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        titleTr: "Uluslararası Uzay İstasyonu (ISS) Geçişi",
        titleEn: "International Space Station (ISS) Pass",
        dateTr: "15 Ağustos 2026 - 21:45",
        dateEn: "August 15, 2026 - 21:45",
        category: "satellite",
        categoryTr: "Uydu Geçişi",
        categoryEn: "Satellite Pass",
        descriptionTr: "Kuzeybatı ufkundan yükselecek. Maksimum yükseklik: 68°, Parlaklık: -3.4 mag.",
        descriptionEn: "Will rise from the northwest horizon. Maximum elevation: 68°, Magnitude: -3.4 mag.",
        intensityTr: "Yüksek",
        intensityEn: "High"
    },
    {
        id: 3,
        titleTr: "Jüpiter ve Satürn Yakınlaşması",
        titleEn: "Jupiter and Saturn Conjunction",
        dateTr: "24 Ağustos 2026",
        dateEn: "August 24, 2026",
        category: "conjunction",
        categoryTr: "Gezegen Sıralanması",
        categoryEn: "Planetary Alignment",
        descriptionTr: "İki dev gaz gezegeni gökyüzünde çok yakın konumda izlenebilecek.",
        descriptionEn: "The two giant gas planets can be observed very closely in the sky.",
        intensityTr: "Orta",
        intensityEn: "Moderate"
    },
    {
        id: 4,
        titleTr: "Parçalı Ay Tutulması",
        titleEn: "Partial Lunar Eclipse",
        dateTr: "28 Ağustos 2026",
        dateEn: "August 28, 2026",
        category: "eclipse",
        categoryTr: "Tutulma",
        categoryEn: "Eclipse",
        descriptionTr: "Ay'ın ufak bir bölümü Dünya'nın gölgesinden geçecek. Çıplak gözle dahi rahatlıkla izlenebilir.",
        descriptionEn: "A small portion of the Moon will pass through the Earth's shadow. Easily observable with the naked eye.",
        intensityTr: "Harika",
        intensityEn: "Excellent"
    }
];

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calendar' });

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
                <h2 className={styles.monthTitle}>{t('months.august')}</h2>
                <div className={styles.grid}>
                    {CALENDAR_EVENTS.map((event) => (
                        <EventCard
                            key={event.id}
                            title={locale === 'tr' ? event.titleTr : event.titleEn}
                            date={locale === 'tr' ? event.dateTr : event.dateEn}
                            category={locale === 'tr' ? event.categoryTr : event.categoryEn}
                            description={locale === 'tr' ? event.descriptionTr : event.descriptionEn}
                            intensity={locale === 'tr' ? event.intensityTr : event.intensityEn}
                            image={event.image || undefined}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
