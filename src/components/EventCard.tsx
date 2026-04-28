import styles from './EventCard.module.css';
import { AstronomyCategory } from '@/types/astronomy';

interface EventProps {
    title: string;
    date: string;
    category: string;
    categoryType?: AstronomyCategory;
    description: string;
    intensity?: string;
    intensityLabel?: string;
    image?: string;
}

export default function EventCard({ title, date, category, categoryType, description, intensity, intensityLabel, image }: EventProps) {
    const getBadgeClass = () => {
        switch (categoryType) {
            case 'meteor':
                return styles.badgePurple;
            case 'eclipse':
                return styles.badgeOrange;
            case 'satellite':
                return styles.badgeGreen;
            case 'moon':
                return styles.badgeRed;
            case 'conjunction':
            case 'other':
            default:
                return styles.badgeBlue;
        }
    };

    return (
        <div className={`glass-panel ${styles.card}`}>
            {image ? <div className={styles.imageOverlay} style={{ backgroundImage: `url(${image})` }} /> : null}

            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={`${styles.badge} ${getBadgeClass()}`}>{category}</span>
                    <span className={styles.date}>{date}</span>
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                {intensity ? (
                    <div className={styles.footer}>
                        <span className={styles.label}>{intensityLabel || 'Observation Quality'}</span>
                        <span className={styles.intensity}>{intensity}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
