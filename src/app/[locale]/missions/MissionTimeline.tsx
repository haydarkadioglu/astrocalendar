'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

type MissionFilter = 'all' | 'crewed' | 'robotic' | 'telescope';
type MissionStatus = 'completed' | 'active' | 'planned';

export interface Mission {
    id: string;
    titleEn: string;
    titleTr: string;
    dateEn: string;
    dateTr: string;
    rawDate: number;
    status: MissionStatus;
    type: string;
    descEn: string;
    descTr: string;
    agency: string;
    destinationEn: string;
    destinationTr: string;
    patch: string | null;
}

interface MissionTimelineProps {
    locale: string;
    missions: Mission[];
}

export default function MissionTimeline({ locale, missions }: MissionTimelineProps) {
    const [activeFilter, setActiveFilter] = useState<MissionFilter>('all');
    const t = useTranslations('Missions');

    const filteredMissions = useMemo(() => (
        missions.filter((mission) => activeFilter === 'all' || mission.type === activeFilter)
    ), [activeFilter, missions]);

    return (
        <>
            <div className={styles.filters}>
                {(['all', 'crewed', 'robotic', 'telescope'] as const).map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`}
                        aria-pressed={activeFilter === filter}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {t(`filters.${filter}`)}
                    </button>
                ))}
            </div>

            <div className={styles.timeline}>
                {filteredMissions.length > 0 ? filteredMissions.map((mission) => (
                    <div key={mission.id} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineCard}>
                            <div className={styles.cardHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {mission.patch ? (
                                        <Image
                                            src={mission.patch}
                                            alt="Mission patch"
                                            width={45}
                                            height={45}
                                            style={{ objectFit: 'contain' }}
                                            unoptimized
                                        />
                                    ) : null}
                                    <div>
                                        <h3 className={styles.cardTitle}>{locale === 'en' ? mission.titleEn : mission.titleTr}</h3>
                                        <span className={styles.cardDate}>{locale === 'en' ? mission.dateEn : mission.dateTr}</span>
                                    </div>
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
                )) : (
                    <div className={styles.timelineCard} style={{ width: '100%' }}>
                        <p className={styles.cardDesc}>{t('emptyState')}</p>
                    </div>
                )}
            </div>
        </>
    );
}
