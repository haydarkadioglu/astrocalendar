import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const t = useTranslations('Navigation');

    return (
        <nav className={`${styles.navbar} glass-panel`}>
            <div className={styles.logoContainer}>
                <Link href="/" className={styles.logo}>
                    <span className="text-gradient">Astro</span>Calendar
                </Link>
            </div>

            <div className={styles.navLinks}>
                <Link href="/" className={styles.link}>{t('home')}</Link>
                <Link href="/calendar" className={styles.link}>{t('calendar')}</Link>
                <Link href="/planetarium" className={styles.link}>{t('planetarium')}</Link>
                <Link href="/bodies" className={styles.link}>{t('encyclopedia')}</Link>
                <Link href="/missions" className={styles.link}>{t('archive')}</Link>
                <Link href="/ecosystem" className={styles.link}>{t('ecosystem')}</Link>
                <Link href="/wallpapers" className={styles.link}>{t('wallpapers') || 'Wallpapers'}</Link>

                <div className={styles.switcherContainer}>
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
