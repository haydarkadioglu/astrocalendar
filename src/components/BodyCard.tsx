import Image from 'next/image';
import styles from './BodyCard.module.css';
import { useTranslations } from 'next-intl';

interface BodyProps {
    name: string;
    type: string;
    image: string;
    description: string;
    articleUrl?: string;
}

export default function BodyCard({ name, type, image, description, articleUrl }: BodyProps) {
    const t = useTranslations('Encyclopedia');

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
                {articleUrl ? (
                    <a
                        className={styles.exploreBtn}
                        href={articleUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('bodyDetails.readMore')}
                    </a>
                ) : null}
            </div>
        </div>
    );
}
