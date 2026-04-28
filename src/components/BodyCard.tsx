import Image from 'next/image';
import styles from './BodyCard.module.css';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface BodyProps {
    id?: string;
    name: string;
    type: string;
    image: string;
    description: string;
    articleUrl?: string;
    wikiTitle: string;
}

export default function BodyCard({ id, name, type, image, description, wikiTitle }: BodyProps) {
    const t = useTranslations('Encyclopedia');
    const slug = id || wikiTitle.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`glass-panel ${styles.card}`}>
            <div className={styles.imageContainer}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                    unoptimized
                />
                <div className={styles.badge}>{type}</div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.description}>{description}</p>
                <Link
                    className={styles.exploreBtn}
                    href={`/bodies/${slug}?title=${encodeURIComponent(wikiTitle)}`}
                >
                    {t('bodyDetails.viewDetails')}
                </Link>
            </div>
        </div>
    );
}
