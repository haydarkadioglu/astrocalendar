import styles from './EventCard.module.css';

interface EventProps {
    title: string;
    date: string;
    category: 'Meteor Yağmuru' | 'Tutulma' | 'Gezegen Sıralanması' | 'Fırlatma' | 'Uydu Geçişi';
    description: string;
    intensity?: 'Düşük' | 'Orta' | 'Yüksek' | 'Harika';
    image?: string;
}

export default function EventCard({ title, date, category, description, intensity, image }: EventProps) {
    // Define badge color based on category
    const getBadgeClass = () => {
        switch (category) {
            case 'Meteor Yağmuru': return styles.badgePurple;
            case 'Tutulma': return styles.badgeOrange;
            case 'Gezegen Sıralanması': return styles.badgeBlue;
            case 'Fırlatma': return styles.badgeRed;
            case 'Uydu Geçişi': return styles.badgeGreen;
            default: return styles.badgeBlue;
        }
    };

    return (
        <div className={`glass-panel ${styles.card}`}>
            {image && <div className={styles.imageOverlay} style={{ backgroundImage: `url(${image})` }} />}

            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={`${styles.badge} ${getBadgeClass()}`}>{category}</span>
                    <span className={styles.date}>{date}</span>
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                {intensity && (
                    <div className={styles.footer}>
                        <span className={styles.label}>Gözlem Şansı:</span>
                        <span className={styles.intensity}>{intensity}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
