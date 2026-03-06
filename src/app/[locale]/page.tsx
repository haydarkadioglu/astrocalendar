import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import EventCard from '@/components/EventCard';
import ObservationConditions from '@/components/ObservationConditions';

export default function Home() {
  const t = useTranslations('HomePage');

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
            <button className={styles.primaryButton}>{t('buttonTonight')}</button>
            <button className={styles.secondaryButton}>{t('buttonPlan')}</button>
          </div>
        </div>

        {/* APOD Placeholder Component */}
        <div className={`glass-panel ${styles.apodCard}`}>
          <div className={styles.apodImageWrapper}>
            <div className={styles.apodPlaceholder}>{t('apodLoading')}</div>
          </div>
          <div className={styles.apodInfo}>
            <span className={styles.apodTag}>{t('apodTag')}</span>
            <h3>Andromeda Galaksisi</h3>
            <p>M31 olarak da bilinen bu dev sarmal galaksi, bize en yakın büyük galaksidir.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{t('upcomingEvents')} <span className="text-gradient">{t('upcomingEventsStrong')}</span></h2>
          <button className={styles.viewAll}>{t('viewAll')}</button>
        </div>

        <div className={styles.grid}>
          <EventCard
            title="Perseid Meteor Yağmuru"
            date="12 Ağustos 2026 - Gece Yarısı"
            category="Meteor Yağmuru"
            description="Yılın en görkemli meteor yağmuru. Saatte 60-100 arası meteor bekleniyor."
            intensity="Harika"
            image="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
          />
          <EventCard
            title="Uluslararası Uzay İstasyonu (ISS)"
            date="Bugün - 21:45"
            category="Uydu Geçişi"
            description="Kuzeybatı ufkundan yükselecek. Maksimum yükseklik: 68°, Parlaklık: -3.4 mag."
            intensity="Yüksek"
          />
          <EventCard
            title="Jüpiter ve Satürn Yakınlaşması"
            date="24 Ağustos 2026"
            category="Gezegen Sıralanması"
            description="İki dev gaz gezegeni gökyüzünde çok yakın konumda izlenebilecek."
            intensity="Orta"
          />
          <EventCard
            title="SpaceX Falcon Heavy"
            date="Eylül 2026"
            category="Fırlatma"
            description="Europa Clipper sondasını Jüpiter'in uydusuna gönderecek tarihi görev."
          />
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
