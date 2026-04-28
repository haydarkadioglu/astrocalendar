// Wikimedia Commons API'den uzay görselleri çeker (örnek, demo amaçlı)
export async function fetchWikimediaWallpapers(category: string, count = 8) {
  // Wikimedia Commons API: https://commons.wikimedia.org/w/api.php
  // Kategoriye göre örnek sorgu: https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Images_of_nebulae&gcmtype=file&prop=imageinfo&iiprop=url&format=json&gcmlimit=8
  const categoryMap: Record<string, string> = {
    planet: 'Images_of_planets',
    galaxy: 'Images_of_galaxies',
    nebula: 'Images_of_nebulae',
    earth: 'Images_of_Earth',
    moon: 'Images_of_the_Moon',
  };
  const cat = categoryMap[category] || 'Images_of_space';
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:${cat}&gcmtype=file&prop=imageinfo&iiprop=url&format=json&gcmlimit=${count}&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.query || !data.query.pages) return [];
  return Object.values(data.query.pages).map((item: any) => ({
    id: item.pageid,
    thumb: item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url,
    full: item.imageinfo?.[0]?.url,
    title: item.title,
    credit: 'Wikimedia Commons',
    category,
  }));
}
