

import { fetchApodGallery, fetchEpicImages } from '@/services/nasa';
import { fetchUnsplashWallpapers } from '@/services/unsplash';
import { fetchWikimediaWallpapers } from '@/services/wikimedia';
import WallpapersClient from './WallpapersClient';

function guessCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('planet') || t.includes('mars') || t.includes('jupiter') || t.includes('venus') || t.includes('saturn')) return 'planet';
  if (t.includes('galaxy')) return 'galaxy';
  if (t.includes('nebula')) return 'nebula';
  if (t.includes('earth')) return 'earth';
  if (t.includes('moon') || t.includes('lunar')) return 'moon';
  return 'other';
}

export default async function WallpapersPage() {
  // Wikimedia
  const CATEGORIES = ['planet', 'galaxy', 'nebula', 'earth', 'moon'];
  const wikimediaResults = await Promise.all(
    CATEGORIES.map(cat => fetchWikimediaWallpapers(cat, 8))
  );
  const wikimediaWallpapers = wikimediaResults.flat();
  // NASA/Unsplash
  const [apod, epic, unsplash] = await Promise.all([
    fetchApodGallery(8),
    fetchEpicImages(),
    fetchUnsplashWallpapers(12)
  ]);
  const allWallpapers = [
    ...apod.filter((w: any) => w.media_type === 'image').map((w: any) => ({
      id: w.url,
      thumb: w.thumbnail_url || w.url,
      full: w.hdurl || w.url,
      title: w.title,
      credit: 'NASA APOD',
      category: guessCategory(w.title),
    })),
    ...epic.map((w: any) => ({
      id: w.identifier,
      thumb: w.image,
      full: w.image,
      title: w.caption,
      credit: 'NASA EPIC',
      category: guessCategory(w.caption),
    })),
    ...unsplash.map((w: any) => ({ ...w, category: 'galaxy' })),
    ...wikimediaWallpapers
  ];
  return <WallpapersClient wallpapers={allWallpapers} />;
}
