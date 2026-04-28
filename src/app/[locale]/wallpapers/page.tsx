import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';

const WALLPAPERS = [
  {
    url: 'https://apod.nasa.gov/apod/image/1901/IC405_Abolfath_3952.jpg',
    title: 'IC 405: The Flaming Star Nebula',
    credit: 'NASA APOD',
  },
  {
    url: 'https://apod.nasa.gov/apod/image/2301/NGC2244_HaLRGBpugh1024.jpg',
    title: 'NGC 2244: A Star Cluster in the Rosette Nebula',
    credit: 'NASA APOD',
  },
  {
    url: 'https://epic.gsfc.nasa.gov/archive/natural/2023/01/01/png/epic_1b_20230101000000.png',
    title: 'Earth from DSCOVR EPIC',
    credit: 'NASA EPIC',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/STS-132_Atlantis_launch.jpg',
    title: 'STS-132 Atlantis Launch',
    credit: 'NASA/Wikipedia',
  },
];

export default async function WallpapersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Wallpapers' });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <div className={styles.wallpaperGrid}>
        {WALLPAPERS.map((wp) => (
          <div key={wp.url} className={styles.wallpaperCard}>
            <a href={wp.url} download target="_blank" rel="noopener noreferrer">
              <img src={wp.url} alt={wp.title} className={styles.wallpaperImg} />
            </a>
            <div className={styles.wallpaperInfo}>
              <span className={styles.wallpaperTitle}>{wp.title}</span>
              <span className={styles.wallpaperCredit}>{wp.credit}</span>
              <a href={wp.url} download className={styles.downloadBtn}>{t('download')}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
