'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (newLocale: string) => {
        // Navigate to the same path but with the new locale
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className={styles.switcher}>
            <button
                className={`${styles.langBtn} ${locale === 'tr' ? styles.active : ''}`}
                onClick={() => handleLocaleChange('tr')}
            >
                TR
            </button>
            <span className={styles.divider}>/</span>
            <button
                className={`${styles.langBtn} ${locale === 'en' ? styles.active : ''}`}
                onClick={() => handleLocaleChange('en')}
            >
                EN
            </button>
        </div>
    );
}
