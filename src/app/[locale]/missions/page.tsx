import { getTranslations } from 'next-intl/server';
import { fetchSpaceXLaunches } from '@/services/spacex';
import MissionTimeline, { Mission } from './MissionTimeline';
import styles from './page.module.css';

const MISSIONS_DATA = [
    {
        id: 'artemis1',
        titleEn: 'Artemis I',
        titleTr: 'Artemis I',
        dateEn: 'Nov 16, 2022',
        dateTr: '16 Kas 2022',
        status: 'completed',
        type: 'robotic',
        descEn: 'The first flight of the Space Launch System (SLS) and the Orion spacecraft. It paved the way for future human exploration of the Moon.',
        descTr: 'Uzay Fırlatma Sistemi (SLS) ve Orion uzay aracının ilk uçuşu. Ay’ın gelecekteki insanlı keşfi için zemin hazırladı.',
        agency: 'NASA / ESA',
        destinationEn: 'Lunar Orbit',
        destinationTr: 'Ay Yörüngesi'
    },
    {
        id: 'jwst',
        titleEn: 'James Webb Space Telescope',
        titleTr: 'James Webb Uzay Teleskobu',
        dateEn: 'Dec 25, 2021',
        dateTr: '25 Ara 2021',
        status: 'active',
        type: 'telescope',
        descEn: 'The largest optical telescope in space, designed to conduct infrared astronomy and look back to the origins of the universe.',
        descTr: 'Kızılötesi astronomi yapmak ve evrenin kökenlerine bakmak için tasarlanmış uzaydaki en büyük optik teleskop.',
        agency: 'NASA / ESA / CSA',
        destinationEn: 'Sun-Earth L2',
        destinationTr: 'Güneş-Dünya L2'
    },
    {
        id: 'perseverance',
        titleEn: 'Mars Perseverance Rover',
        titleTr: 'Mars Perseverance Aracı',
        dateEn: 'July 30, 2020',
        dateTr: '30 Tem 2020',
        status: 'active',
        type: 'robotic',
        descEn: 'A rover designed to explore the Jezero crater on Mars as part of NASA\'s Mars 2020 mission, carrying the Ingenuity helicopter.',
        descTr: 'NASA’nın Mars 2020 görevinin bir parçası olarak Jezero kraterini keşfetmek üzere tasarlanmış, beraberinde Ingenuity helikopterini taşıyan uzay aracı.',
        agency: 'NASA',
        destinationEn: 'Mars',
        destinationTr: 'Mars'
    },
    {
        id: 'cassini',
        titleEn: 'Cassini-Huygens',
        titleTr: 'Cassini-Huygens',
        dateEn: 'Oct 15, 1997',
        dateTr: '15 Eki 1997',
        status: 'completed',
        type: 'robotic',
        descEn: 'A collaborative mission to study the planet Saturn and its system, including its rings and natural satellites.',
        descTr: 'Satürn gezegenini, halkalarını ve uydularını detaylı bir şekilde incelemek için yapılan ortak uzay görevi.',
        agency: 'NASA / ESA / ASI',
        destinationEn: 'Saturn',
        destinationTr: 'Satürn'
    },
    {
        id: 'apollo11',
        titleEn: 'Apollo 11',
        titleTr: 'Apollo 11',
        dateEn: 'July 16, 1969',
        dateTr: '16 Tem 1969',
        status: 'completed',
        type: 'crewed',
        descEn: 'The historic spaceflight that first landed humans on the Moon. Commanders Neil Armstrong and Buzz Aldrin formed the American crew.',
        descTr: 'İnsanları Ay’a ilk indiren tarihi uzay uçuşu. Komutan Neil Armstrong ve Buzz Aldrin Amerikan mürettebatını oluşturdu.',
        agency: 'NASA',
        destinationEn: 'The Moon',
        destinationTr: 'Ay'
    }
] as const;

export default async function MissionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Missions' });
    const spacexLaunches = await fetchSpaceXLaunches();

    const mappedSpaceX: Mission[] = spacexLaunches.map((launch) => ({
        id: launch.id,
        titleEn: launch.name,
        titleTr: launch.name,
        dateEn: new Date(launch.date_utc).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        dateTr: new Date(launch.date_utc).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
        rawDate: new Date(launch.date_utc).getTime(),
        status: launch.upcoming ? 'planned' : (launch.success ? 'completed' : 'active'),
        type: 'robotic',
        descEn: launch.details || (launch.upcoming ? 'Upcoming SpaceX mission.' : 'A SpaceX orbital launch mission.'),
        descTr: launch.details ? `(İngilizce) ${launch.details}` : (launch.upcoming ? 'Planlanan SpaceX fırlatması.' : 'SpaceX yörünge fırlatma görevi.'),
        agency: 'SpaceX',
        destinationEn: 'Earth Orbit / LEO',
        destinationTr: 'Dünya Yörüngesi',
        patch: launch.links?.patch?.small
    }));

    const mappedStatic: Mission[] = MISSIONS_DATA.map((mission) => ({
        ...mission,
        rawDate: new Date(mission.dateEn).getTime(),
        patch: null
    }));

    const allMissions = [...mappedStatic, ...mappedSpaceX].sort((a, b) => b.rawDate - a.rawDate);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {t('title')} <span className="text-gradient">{t('titleStrong')}</span>
                </h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
            </header>

            <MissionTimeline locale={locale} missions={allMissions} />
        </div>
    );
}
