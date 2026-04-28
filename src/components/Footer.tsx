import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navigation');

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.brand}>
                    <span className="text-gradient">Astro</span>Calendar
                    <p className={styles.tagline}>{t('tagline')}</p>
                </div>

                <div className={styles.links}>
                    <h4>{t('explore')}</h4>
                    <Link href="/calendar">{tNav('calendar')}</Link>
                    <Link href="/planetarium">{tNav('planetarium')}</Link>
                    <Link href="/bodies">{tNav('encyclopedia')}</Link>
                    <Link href="/missions">{tNav('archive')}</Link>
                    <Link href="/ecosystem">{tNav('ecosystem')}</Link>
                </div>

                <div className={styles.links}>
                    <h4>{t('dataSources')}</h4>
                    <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">NASA Open APIs</a>
                    <a href="https://api.nasa.gov/#apod" target="_blank" rel="noreferrer">NASA APOD / NEO / DONKI / EPIC</a>
                    <a href="https://thespacedevs.com/llapi" target="_blank" rel="noreferrer">Launch Library</a>
                    <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
                    <a href="https://www.timeanddate.com/" target="_blank" rel="noreferrer">Time and Date</a>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} AstroCalendar. {t('rights')}</p>
            </div>
        </footer>
    );
}
