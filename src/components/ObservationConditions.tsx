import { useTranslations } from 'next-intl';
import styles from './ObservationConditions.module.css';

export default function ObservationConditions() {
    const t = useTranslations('HomePage');

    return (
        <div className={styles.conditionsGrid}>
            <div className={styles.conditionBox}>
                <span className={styles.conditionIcon}>🌕</span>
                <h4>{t('moonPhase')}</h4>
                <p>Dolunay (%98)</p>
                <span className={styles.conditionStatus}>Derin Uzay için Kötü</span>
            </div>
            <div className={styles.conditionBox}>
                <span className={styles.conditionIcon}>☁️</span>
                <h4>{t('cloudCover')}</h4>
                <p>%15 Kapalı</p>
                <span className={`${styles.conditionStatus} ${styles.good}`}>Harika</span>
            </div>
            <div className={styles.conditionBox}>
                <span className={styles.conditionIcon}>🔭</span>
                <h4>{t('seeing')}</h4>
                <p>1.2 arcsec</p>
                <span className={`${styles.conditionStatus} ${styles.good}`}>İyi</span>
            </div>
            <div className={styles.conditionBox}>
                <span className={styles.conditionIcon}>🏙️</span>
                <h4>{t('lightPollution')}</h4>
                <p>Bortle Sınıf 4</p>
                <span className={styles.conditionStatus}>Orta</span>
            </div>
        </div>
    );
}
