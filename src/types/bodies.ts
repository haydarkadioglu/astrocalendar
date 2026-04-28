export type BodyGroup =
    | 'planets'
    | 'moons'
    | 'dwarf_planets'
    | 'galaxies'
    | 'stars'
    | 'search';

export interface CelestialBody {
    id: string;
    name: string;
    type: string;
    image: string;
    description: string;
    articleUrl?: string;
    group: BodyGroup;
}
