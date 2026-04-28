'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export default function PlanetariumMap() {
    const t = useTranslations('Planetarium');
    // Default coordinates (e.g. Istanbul/London depending on preference, we use 0,0 initially or a generic view)
    const [lat, setLat] = useState<number>(41.0082); // Istanbul default
    const [lon, setLon] = useState<number>(28.9784);
    const [city, setCity] = useState('');
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

    const handleCitySearch = async () => {
        if (!city.trim()) return;
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                setLat(parseFloat(data[0].lat));
                setLon(parseFloat(data[0].lon));
            } else {
                setErrorMsg(t('cityNotFound'));
            }
        } catch (err) {
            console.error('Geocoding error:', err);
            setErrorMsg(t('error'));
        }
        setLoading(false);
    };

    const toggleFullScreen = () => {
        const mapContainer = document.getElementById('planetarium-container');
        if (!document.fullscreenElement) {
            if (mapContainer?.requestFullscreen) {
                mapContainer.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Use a stereo projection so dragging feels like panning across the sky
    // rather than rotating a polar dome around the center.
    const iframeUrl = `https://virtualsky.lco.global/embed/index.html?longitude=${lon}&latitude=${lat}&projection=stereo&width=1200&height=720&constellations=true&constellationlabels=true&meteorshowers=true&showstarlabels=true&showplanets=true&showposition=true&showdate=true&cardinalpoints=true&live=true&mouse=true`;

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

                    <div className={styles.manualLocation}>
                        <input
                            type="text"
                            className={styles.coordInput}
                            style={{ width: '150px' }}
                            placeholder={t('cityPlaceholder')}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                        />
                        <button className={styles.setBtn} onClick={handleCitySearch} disabled={loading}>
                            {t('setLocation')}
                        </button>
                    </div>

                    <button
                        className={styles.fullscreenBtn}
                        onClick={toggleFullScreen}
                    >
                        {t('fullscreenBtn')}
                    </button>
                </div>
                {errorMsg && <p className={styles.error} style={{ marginTop: '1rem' }}>{errorMsg}</p>}
            </header>

            <div className={styles.mapWrapper}>
                <div id="planetarium-container" className={styles.mapContainer}>
                    <iframe
                        src={iframeUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen
                        title="VirtualSky Interactive Planetarium"
                    />
                </div>
            </div>
        </div>
    );
}
