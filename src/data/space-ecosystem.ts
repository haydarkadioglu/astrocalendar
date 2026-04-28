export interface SpaceOrg {
    name: string;
    category: string;
    roleEn: string;
    roleTr: string;
    website: string;
}

export interface SpaceOrgCategory {
    id: string;
    titleEn: string;
    titleTr: string;
    descriptionEn: string;
    descriptionTr: string;
    organizations: SpaceOrg[];
}

export const SPACE_ECOSYSTEM: SpaceOrgCategory[] = [
    {
        id: 'agencies',
        titleEn: 'Agencies',
        titleTr: 'Ajanslar',
        descriptionEn: 'Public space agencies shaping exploration, science, and national programs.',
        descriptionTr: 'Keşif, bilim ve ulusal programları yönlendiren kamu uzay ajansları.',
        organizations: [
            { name: 'NASA', category: 'agency', roleEn: 'The United States civil space agency; Moon, Mars, and deep space missions.', roleTr: 'ABD’nin sivil uzay ajansı; Ay, Mars ve derin uzay görevleri.', website: 'https://www.nasa.gov/' },
            { name: 'ESA', category: 'agency', roleEn: 'Europe’s joint space agency.', roleTr: 'Avrupa’nın ortak uzay ajansı.', website: 'https://www.esa.int/' },
            { name: 'Roscosmos', category: 'agency', roleEn: 'Russia’s state space agency.', roleTr: 'Rusya’nın uzay ajansı.', website: 'https://www.roscosmos.ru/' },
            { name: 'CNSA', category: 'agency', roleEn: 'China’s national space program.', roleTr: 'Çin’in ulusal uzay programı.', website: 'https://www.cnsa.gov.cn/' },
            { name: 'ISRO', category: 'agency', roleEn: 'India’s space agency, known for cost-efficient missions.', roleTr: 'Hindistan’ın uzay ajansı; düşük maliyetli görevleriyle tanınır.', website: 'https://www.isro.gov.in/' },
            { name: 'JAXA', category: 'agency', roleEn: 'Japan’s aerospace exploration agency.', roleTr: 'Japonya’nın uzay ajansı.', website: 'https://global.jaxa.jp/' }
        ]
    },
    {
        id: 'launch',
        titleEn: 'Launch and Rockets',
        titleTr: 'Fırlatma ve Roket',
        descriptionEn: 'Launch providers and rocket builders opening access to orbit and beyond.',
        descriptionTr: 'Yörüngeye ve ötesine erişimi sağlayan fırlatma şirketleri ve roket üreticileri.',
        organizations: [
            { name: 'SpaceX', category: 'launch', roleEn: 'Reusable rockets, Starlink, crew and cargo missions.', roleTr: 'Yeniden kullanılabilir roketler, Starlink, mürettebat ve kargo görevleri.', website: 'https://www.spacex.com/' },
            { name: 'Blue Origin', category: 'launch', roleEn: 'Launch systems, lunar ambitions, and human spaceflight.', roleTr: 'Fırlatma sistemleri, Ay hedefleri ve insanlı uzay uçuşları.', website: 'https://www.blueorigin.com/' },
            { name: 'Rocket Lab', category: 'launch', roleEn: 'Small launch, spacecraft platforms, and space systems.', roleTr: 'Küçük uydu fırlatma, uzay aracı platformları ve uzay sistemleri.', website: 'https://www.rocketlabusa.com/' },
            { name: 'Relativity Space', category: 'launch', roleEn: 'Launch systems with a strong additive manufacturing focus.', roleTr: 'Katmanlı üretim odağıyla geliştirilen fırlatma sistemleri.', website: 'https://www.relativityspace.com/' },
            { name: 'Firefly Aerospace', category: 'launch', roleEn: 'Launch vehicles, lunar services, and responsive space capabilities.', roleTr: 'Fırlatma araçları, Ay hizmetleri ve hızlı uzay erişimi kabiliyeti.', website: 'https://fireflyspace.com/' },
            { name: 'Arianespace', category: 'launch', roleEn: 'European launch operator for Ariane and Vega families.', roleTr: 'Ariane ve Vega aileleri için Avrupa’nın fırlatma operatörü.', website: 'https://www.arianespace.com/' },
            { name: 'Virgin Galactic', category: 'launch', roleEn: 'Suborbital spaceflight focused on private astronaut experiences.', roleTr: 'Özel astronot deneyimlerine odaklanan suborbital uzay uçuşu şirketi.', website: 'https://www.virgingalactic.com/' }
        ]
    },
    {
        id: 'infrastructure',
        titleEn: 'Satellites and Space Infrastructure',
        titleTr: 'Uydu ve Uzay Altyapısı',
        descriptionEn: 'Operators and infrastructure companies powering Earth observation and connectivity.',
        descriptionTr: 'Dünya gözlemi ve bağlantı altyapısını sağlayan operatörler ve şirketler.',
        organizations: [
            { name: 'Planet Labs', category: 'infrastructure', roleEn: 'Earth observation through large-scale small satellite fleets.', roleTr: 'Büyük ölçekli küçük uydu filolarıyla Dünya gözlemi.', website: 'https://www.planet.com/' },
            { name: 'Maxar Technologies', category: 'infrastructure', roleEn: 'Satellite imagery, geospatial intelligence, and spacecraft systems.', roleTr: 'Uydu görüntüleri, jeo-uzamsal istihbarat ve uzay aracı sistemleri.', website: 'https://www.maxar.com/' },
            { name: 'OneWeb', category: 'infrastructure', roleEn: 'Low Earth orbit broadband satellite network.', roleTr: 'Alçak Dünya yörüngesi geniş bant uydu ağı.', website: 'https://www.oneweb.net/' },
            { name: 'Iridium Communications', category: 'infrastructure', roleEn: 'Global satellite communications and resilient network services.', roleTr: 'Küresel uydu iletişimi ve dayanıklı ağ hizmetleri.', website: 'https://www.iridium.com/' },
            { name: 'SES', category: 'infrastructure', roleEn: 'Satellite communications across GEO and MEO constellations.', roleTr: 'GEO ve MEO takımyıldızları üzerinden uydu iletişimi.', website: 'https://www.ses.com/' }
        ]
    },
    {
        id: 'lunar',
        titleEn: 'Moon, Mining, and Future Ventures',
        titleTr: 'Ay, Madencilik ve Gelecek Girişimleri',
        descriptionEn: 'Commercial teams targeting lunar logistics, exploration, and resource development.',
        descriptionTr: 'Ay lojistiği, keşif ve kaynak geliştirmeye odaklanan ticari ekipler.',
        organizations: [
            { name: 'Intuitive Machines', category: 'lunar', roleEn: 'Commercial lunar delivery and surface operations.', roleTr: 'Ticari Ay teslimatı ve yüzey operasyonları.', website: 'https://www.intuitivemachines.com/' },
            { name: 'Astrobotic', category: 'lunar', roleEn: 'Lunar payload delivery and Moon logistics.', roleTr: 'Ay yük teslimatı ve Ay lojistiği.', website: 'https://www.astrobotic.com/' },
            { name: 'ispace', category: 'lunar', roleEn: 'Lunar transportation and cis-lunar economy efforts.', roleTr: 'Ay taşımacılığı ve Dünya-Ay ekonomisine odaklanan girişim.', website: 'https://ispace-inc.com/' },
            { name: 'AstroForge', category: 'lunar', roleEn: 'Space resource extraction with asteroid-mining ambitions.', roleTr: 'Asteroit madenciliği hedefiyle uzay kaynak çıkarımı.', website: 'https://www.astroforge.io/' }
        ]
    },
    {
        id: 'defense',
        titleEn: 'Defense and Prime Contractors',
        titleTr: 'Savunma ve Büyük Ana Yükleniciler',
        descriptionEn: 'Large aerospace and defense firms deeply involved in government space programs.',
        descriptionTr: 'Devlet uzay programlarında yoğun rol alan büyük havacılık ve savunma şirketleri.',
        organizations: [
            { name: 'Lockheed Martin', category: 'defense', roleEn: 'Major prime contractor across deep space, defense, and spacecraft systems.', roleTr: 'Derin uzay, savunma ve uzay aracı sistemlerinde büyük ana yüklenici.', website: 'https://www.lockheedmartin.com/' },
            { name: 'Boeing', category: 'defense', roleEn: 'Launch, crew systems, satellites, and defense aerospace programs.', roleTr: 'Fırlatma, mürettebat sistemleri, uydular ve savunma havacılık programları.', website: 'https://www.boeing.com/' },
            { name: 'Northrop Grumman', category: 'defense', roleEn: 'Space systems, habitats, national security, and propulsion.', roleTr: 'Uzay sistemleri, yaşam modülleri, ulusal güvenlik ve itki sistemleri.', website: 'https://www.northropgrumman.com/' },
            { name: 'Airbus Defence and Space', category: 'defense', roleEn: 'European defense-space prime for satellites and exploration systems.', roleTr: 'Uydular ve keşif sistemleri için Avrupa merkezli savunma-uzay ana yüklenicisi.', website: 'https://www.airbus.com/en/products-services/defence-space' },
            { name: 'Thales Alenia Space', category: 'defense', roleEn: 'Satellites, modules, telecom, navigation, and exploration hardware.', roleTr: 'Uydular, modüller, telekom, navigasyon ve keşif donanımları.', website: 'https://www.thalesaleniaspace.com/' },
            { name: 'L3Harris', category: 'defense', roleEn: 'Mission systems, payloads, sensors, and defense-space electronics.', roleTr: 'Görev sistemleri, faydalı yükler, sensörler ve savunma-uzay elektroniği.', website: 'https://www.l3harris.com/' }
        ]
    }
];
