// Simple Unsplash fetcher for demo (public demo key, replace for production)
export async function fetchUnsplashWallpapers(count = 12) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || 'demo'; // Replace with your Unsplash key
  if (accessKey === 'demo') {
    // Fallback demo images
    return [
      {
        id: 'demo1',
        thumb: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=thumb&w=400&q=80',
        full: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
        title: 'Andromeda Galaxy',
        credit: 'Unsplash',
      },
      {
        id: 'demo2',
        thumb: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=thumb&w=400&q=80',
        full: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
        title: 'Milky Way',
        credit: 'Unsplash',
      }
    ];
  }
  const res = await fetch(`https://api.unsplash.com/search/photos?query=space&per_page=${count}&client_id=${accessKey}`);
  const data = await res.json();
  return data.results.map((item: any) => ({
    id: item.id,
    thumb: item.urls.thumb,
    full: item.urls.full,
    title: item.alt_description || 'Space Wallpaper',
    credit: item.user.name || 'Unsplash',
  }));
}
