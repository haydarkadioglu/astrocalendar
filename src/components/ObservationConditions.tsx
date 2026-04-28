'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from './ObservationConditions.module.css';
import { ObservationQuality, ObservationSnapshot } from '@/types/observation';

const DEFAULT_LOCATION = { lat: 41.0082, lon: 28.9784 };

function formatClock(dateString: string | null, locale: string) {
    if (!dateString) {
        return '--';
    }

    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
}

export default function ObservationConditions() {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const [data, setData] = useState<ObservationSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [usingDeviceLocation, setUsingDeviceLocation] = useState(false);
    const [coords, setCoords] = useState(DEFAULT_LOCATION);

    const loadSnapshot = async (nextCoords = DEFAULT_LOCATION) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/observation?lat=${nextCoords.lat}&lon=${nextCoords.lon}`);
            if (!response.ok) {
                throw new Error('Observation request failed');
            }

            const snapshot = await response.json() as ObservationSnapshot;
            setData(snapshot);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSnapshot(DEFAULT_LOCATION);
    }, []);

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUsingDeviceLocation(true);
                const nextCoords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                setCoords(nextCoords);
                void loadSnapshot(nextCoords);
            },
            () => {
                setUsingDeviceLocation(false);
                setCoords(DEFAULT_LOCATION);
                void loadSnapshot(DEFAULT_LOCATION);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const qualityClass = (quality: ObservationQuality) => {
        if (quality === 'excellent' || quality === 'good') {
            return `${styles.conditionStatus} ${styles.good}`;
        }
        if (quality === 'fair') {
            return `${styles.conditionStatus} ${styles.fair}`;
        }
        return styles.conditionStatus;
    };

    const qualityLabel = (quality: ObservationQuality) => t(`observation.quality.${quality}`);

    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <p className={styles.meta}>
                    {usingDeviceLocation ? t('observation.usingCurrentLocation') : t('observation.usingDefaultLocation')}
                </p>
                <div className={styles.actions}>
                    <button type="button" className={styles.actionBtn} onClick={() => void loadSnapshot(coords)}>{t('observation.refresh')}</button>
                    <button type="button" className={styles.actionBtn} onClick={useCurrentLocation}>{t('observation.useMyLocation')}</button>
                </div>
            </div>

            {loading && !data ? (
                <div className={styles.loadingBox}>{t('observation.loading')}</div>
            ) : null}

            {data ? (
                <div className={styles.conditionsGrid}>
                    <div className={styles.conditionBox}>
                        <span className={styles.conditionIcon}>MP</span>
                        <h4>{t('moonPhase')}</h4>
                        <p>{t(`observation.moonPhases.${data.moonPhaseKey}`)} ({data.moonIllumination}%)</p>
                        <span className={qualityClass(data.moonObservationLabel)}>{qualityLabel(data.moonObservationLabel)}</span>
                    </div>

                    <div className={styles.conditionBox}>
                        <span className={styles.conditionIcon}>CC</span>
                        <h4>{t('cloudCover')}</h4>
                        <p>%{data.cloudCover}</p>
                        <span className={qualityClass(data.cloudLabel)}>{qualityLabel(data.cloudLabel)}</span>
                    </div>

                    <div className={styles.conditionBox}>
                        <span className={styles.conditionIcon}>SQ</span>
                        <h4>{t('seeing')}</h4>
                        <p>{data.seeingScore}/100</p>
                        <span className={qualityClass(data.seeingLabel)}>{qualityLabel(data.seeingLabel)}</span>
                        <small className={styles.detailLine}>
                            {t('observation.visibility')}: {data.visibilityKm ? `${data.visibilityKm} km` : '--'}
                        </small>
                    </div>

                    <div className={styles.conditionBox}>
                        <span className={styles.conditionIcon}>NW</span>
                        <h4>{t('observation.darknessWindow')}</h4>
                        <p>{formatClock(data.darknessWindow.start, locale)} - {formatClock(data.darknessWindow.end, locale)}</p>
                        <span className={qualityClass(data.darknessWindow.durationHours && data.darknessWindow.durationHours >= 8 ? 'good' : 'fair')}>
                            {data.darknessWindow.durationHours
                                ? `${data.darknessWindow.durationHours.toFixed(1)} ${t('observation.hours')}`
                                : t('observation.unavailable')}
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
