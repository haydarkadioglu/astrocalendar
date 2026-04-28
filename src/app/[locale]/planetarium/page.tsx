import PlanetariumMap from './PlanetariumMap';

export default async function PlanetariumPage({ params }: { params: Promise<{ locale: string }> }) {
    await params;

    return <PlanetariumMap />;
}
