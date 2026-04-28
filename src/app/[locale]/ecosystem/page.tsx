import { getTranslations } from 'next-intl/server';
import { SPACE_ECOSYSTEM } from '@/data/space-ecosystem';
import styles from './page.module.css';

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Ecosystem' });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {t('title')} <span className="text-gradient">{t('titleStrong')}</span>
                </h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
            </header>

            <div className={styles.sections}>
                {SPACE_ECOSYSTEM.map((section) => (
                    <section key={section.id} className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2>{locale === 'tr' ? section.titleTr : section.titleEn}</h2>
                                <p>{locale === 'tr' ? section.descriptionTr : section.descriptionEn}</p>
                            </div>
                            <span className={styles.count}>{section.organizations.length}</span>
                        </div>

                        <div className={styles.grid}>
                            {section.organizations.map((org) => (
                                <article key={org.name} className={`glass-panel ${styles.card}`}>
                                    <div className={styles.cardTop}>
                                        <h3>{org.name}</h3>
                                        <span className={styles.badge}>{locale === 'tr' ? section.titleTr : section.titleEn}</span>
                                    </div>
                                    <p className={styles.description}>{locale === 'tr' ? org.roleTr : org.roleEn}</p>
                                    <a href={org.website} target="_blank" rel="noreferrer" className={styles.link}>
                                        {t('visitSite')}
                                    </a>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
