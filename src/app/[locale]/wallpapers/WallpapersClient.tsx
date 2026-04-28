"use client";
import { useState, useMemo } from 'react';
import styles from './page.module.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'planet', label: 'Planets' },
  { key: 'galaxy', label: 'Galaxies' },
  { key: 'nebula', label: 'Nebulae' },
  { key: 'earth', label: 'Earth' },
  { key: 'moon', label: 'Moon' },
];

export default function WallpapersClient({ wallpapers }: { wallpapers: any[] }) {
  const [category, setCategory] = useState('all');
  const filteredWallpapers = useMemo(() => {
    if (category === 'all') return wallpapers;
    return wallpapers.filter(wp => wp.category === category);
  }, [wallpapers, category]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Duvar Kağıtları</h1>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '1.2rem',
              background: cat.key === category ? 'linear-gradient(90deg, #00c6fb 0%, #7d2ae8 100%)' : 'rgba(255,255,255,0.07)',
              color: cat.key === category ? '#fff' : '#ccc',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
              border: 'none',
              userSelect: 'none',
              transition: 'background 0.2s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={styles.wallpaperGrid}>
        {filteredWallpapers.map((wp) => (
          <div key={wp.id} className={styles.wallpaperCard}>
            <a href={wp.full} target="_blank" rel="noopener noreferrer">
              <img src={wp.thumb} alt={wp.title} className={styles.wallpaperImg} loading="lazy" />
            </a>
            <div className={styles.wallpaperInfo}>
              <span className={styles.wallpaperTitle}>{wp.title}</span>
              <span className={styles.wallpaperCredit}>{wp.credit}</span>
              <a href={wp.full} download className={styles.downloadBtn}>İndir</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
