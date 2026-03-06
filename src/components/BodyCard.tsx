import Image from 'next/image';
import styles from './BodyCard.module.css';

interface BodyProps {
    id: string;
    name: string;
    type: string;
    image: string;
    description: string;
}

export default function BodyCard({ id, name, type, image, description }: BodyProps) {
    return (
        <div className={`glass-panel ${styles.card}`}>
            <div className={styles.imageContainer}>
                {/* Using standard img for now to easily handle external URLs without Next.js config overhead */}
                <img
                    src={image}
                    alt={name}
                    className={styles.image}
                    loading="lazy"
                />
                <div className={styles.badge}>{type}</div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.description}>{description}</p>
                <button className={styles.exploreBtn}>Makaleyi Oku</button>
            </div>
        </div>
    );
}
