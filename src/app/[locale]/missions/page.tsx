import { useTranslations } from 'next-intl';

export default function MissionsPage() {
    const t = useTranslations('Navigation');
    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('archive')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Bu sayfa tarihi Apollo, Voyager, Cassini ve yeni James Webb teleskobu görevlerinin zaman çizelgesini barındıracaktır.</p>
        </div>
    );
}
