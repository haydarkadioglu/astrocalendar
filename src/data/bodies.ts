import { BodyGroup } from '@/types/bodies';

export interface BodyFactSet {
    distanceEn?: string;
    distanceTr?: string;
    radiusEn?: string;
    radiusTr?: string;
    gravityEn?: string;
    gravityTr?: string;
    discovererEn?: string;
    discovererTr?: string;
}

export interface BodyDefinition {
    id: string;
    wikiTitleTr: string;
    wikiTitleEn: string;
    typeEn: string;
    typeTr: string;
    group: BodyGroup;
    facts?: BodyFactSet;
}

export const BASE_BODIES: BodyDefinition[] = [
    {
        id: 'sun',
        wikiTitleTr: 'Güneş',
        wikiTitleEn: 'Sun',
        typeEn: 'Star',
        typeTr: 'Yıldız',
        group: 'stars',
        facts: {
            distanceEn: '0 AU',
            distanceTr: '0 AB',
            radiusEn: '695,700 km',
            radiusTr: '695.700 km',
            gravityEn: '274 m/s²',
            gravityTr: '274 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'mercury',
        wikiTitleTr: 'Merkür',
        wikiTitleEn: 'Mercury (planet)',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '0.39 AU',
            distanceTr: '0,39 AB',
            radiusEn: '2,440 km',
            radiusTr: '2.440 km',
            gravityEn: '3.7 m/s²',
            gravityTr: '3,7 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'venus',
        wikiTitleTr: 'Venüs',
        wikiTitleEn: 'Venus',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '0.72 AU',
            distanceTr: '0,72 AB',
            radiusEn: '6,052 km',
            radiusTr: '6.052 km',
            gravityEn: '8.87 m/s²',
            gravityTr: '8,87 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'earth',
        wikiTitleTr: 'Dünya',
        wikiTitleEn: 'Earth',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '1 AU',
            distanceTr: '1 AB',
            radiusEn: '6,371 km',
            radiusTr: '6.371 km',
            gravityEn: '9.81 m/s²',
            gravityTr: '9,81 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'mars',
        wikiTitleTr: 'Mars',
        wikiTitleEn: 'Mars',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '1.52 AU',
            distanceTr: '1,52 AB',
            radiusEn: '3,390 km',
            radiusTr: '3.390 km',
            gravityEn: '3.71 m/s²',
            gravityTr: '3,71 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'jupiter',
        wikiTitleTr: 'Jüpiter',
        wikiTitleEn: 'Jupiter',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '5.20 AU',
            distanceTr: '5,20 AB',
            radiusEn: '69,911 km',
            radiusTr: '69.911 km',
            gravityEn: '24.79 m/s²',
            gravityTr: '24,79 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'saturn',
        wikiTitleTr: 'Satürn',
        wikiTitleEn: 'Saturn',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '9.58 AU',
            distanceTr: '9,58 AB',
            radiusEn: '58,232 km',
            radiusTr: '58.232 km',
            gravityEn: '10.44 m/s²',
            gravityTr: '10,44 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'uranus',
        wikiTitleTr: 'Uranüs',
        wikiTitleEn: 'Uranus',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '19.2 AU',
            distanceTr: '19,2 AB',
            radiusEn: '25,362 km',
            radiusTr: '25.362 km',
            gravityEn: '8.69 m/s²',
            gravityTr: '8,69 m/s²',
            discovererEn: 'William Herschel',
            discovererTr: 'William Herschel'
        }
    },
    {
        id: 'neptune',
        wikiTitleTr: 'Neptün',
        wikiTitleEn: 'Neptune',
        typeEn: 'Planet',
        typeTr: 'Gezegen',
        group: 'planets',
        facts: {
            distanceEn: '30.05 AU',
            distanceTr: '30,05 AB',
            radiusEn: '24,622 km',
            radiusTr: '24.622 km',
            gravityEn: '11.15 m/s²',
            gravityTr: '11,15 m/s²',
            discovererEn: 'Le Verrier / Galle',
            discovererTr: 'Le Verrier / Galle'
        }
    },
    {
        id: 'moon',
        wikiTitleTr: 'Ay',
        wikiTitleEn: 'Moon',
        typeEn: 'Moon',
        typeTr: 'Uydu',
        group: 'moons',
        facts: {
            distanceEn: '384,400 km from Earth',
            distanceTr: 'Dünya\'ya 384.400 km',
            radiusEn: '1,737 km',
            radiusTr: '1.737 km',
            gravityEn: '1.62 m/s²',
            gravityTr: '1,62 m/s²',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    },
    {
        id: 'pluto',
        wikiTitleTr: 'Plüton',
        wikiTitleEn: 'Pluto',
        typeEn: 'Dwarf Planet',
        typeTr: 'Cüce Gezegen',
        group: 'dwarf_planets',
        facts: {
            distanceEn: '39.48 AU',
            distanceTr: '39,48 AB',
            radiusEn: '1,188 km',
            radiusTr: '1.188 km',
            gravityEn: '0.62 m/s²',
            gravityTr: '0,62 m/s²',
            discovererEn: 'Clyde Tombaugh',
            discovererTr: 'Clyde Tombaugh'
        }
    },
    {
        id: 'andromeda',
        wikiTitleTr: 'Andromeda_Galaksisi',
        wikiTitleEn: 'Andromeda_Galaxy',
        typeEn: 'Spiral Galaxy',
        typeTr: 'Sarmal Galaksi',
        group: 'galaxies',
        facts: {
            distanceEn: '2.5 million light-years',
            distanceTr: '2,5 milyon ışık yılı',
            radiusEn: '110,000 light-years',
            radiusTr: '110.000 ışık yılı',
            discovererEn: 'Known since antiquity',
            discovererTr: 'Antik çağlardan beri biliniyor'
        }
    }
];

export function getBodyDefinition(bodyId: string) {
    return BASE_BODIES.find((body) => body.id === bodyId);
}
