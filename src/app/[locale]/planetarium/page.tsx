import { useTranslations } from 'next-intl';

export default function PlanetariumPage() {
    const t = useTranslations('Navigation');
    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('planetarium')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Bu sayfa cihaz GPS lokasyonu veya manuel giriş ile canlı interaktif gökyüzü haritasını gösterecektir (Planetarium).</p>
        </div>
    );
}
