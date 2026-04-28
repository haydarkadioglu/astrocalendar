export type AstronomyCategory =
    | 'meteor'
    | 'eclipse'
    | 'conjunction'
    | 'satellite'
    | 'moon'
    | 'other';

export interface AstronomyEvent {
    id: string;
    titleEn: string;
    titleTr: string;
    dateEn: string;
    dateTr: string;
    category: AstronomyCategory;
    categoryEn: string;
    categoryTr: string;
    descriptionEn: string;
    descriptionTr: string;
    intensityEn: string;
    intensityTr: string;
    rawDate: number;
}
