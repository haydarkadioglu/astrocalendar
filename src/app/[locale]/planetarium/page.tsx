import PlanetariumMap from './PlanetariumMap';

export default async function PlanetariumPage({ params }: { params: Promise<{ locale: string }> }) {
    // Next.js 15 requires awaiting params
    const { locale } = await params;

    return <PlanetariumMap />;
}
