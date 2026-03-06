'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export default function PlanetariumMap() {
    const t = useTranslations('Planetarium');
    // Default coordinates (e.g. Istanbul/London depending on preference, we use 0,0 initially or a generic view)
    const [lat, setLat] = useState<number>(41.0082); // Istanbul default
    const [lon, setLon] = useState<number>(28.9784);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const requestLocation = () => {
        setLoading(true);
        setErrorMsg('');

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLon(position.coords.longitude);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error obtaining location', error);
                    setErrorMsg(t('error'));
                    setLoading(false);
                }
            );
        } else {
            setErrorMsg(t('error'));
            setLoading(false);
        }
    };

    // The virtual sky iframe URL
    const iframeUrl = `https://virtualsky.lco.global/embed/index.html?longitude=${lon}&latitude=${lat}&projection=stereo&constellations=true&constellationlabels=true&meteorshowers=true&showstarlabels=true&showplanets=true&live=true&az=180`;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {t('title')} <span className="text-gradient">{t('titleStrong')}</span>
                </h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                <div className={styles.controls}>
                    <button
                        className={styles.locationBtn}
                        onClick={requestLocation}
                        disabled={loading}
                    >
                        {loading ? t('detecting') : t('locationBtn')}
                    </button>
                    {errorMsg && <p className={styles.error}>{errorMsg}</p>}
                </div>
            </header>

            <div className={styles.mapWrapper}>
                <div className={styles.mapContainer}>
                    <iframe
                        src={iframeUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        title="VirtualSky Interactive Planetarium"
                    />
                </div>
            </div>
        </div>
    );
}
