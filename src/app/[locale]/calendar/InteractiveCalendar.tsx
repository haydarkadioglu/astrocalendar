'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './InteractiveCalendar.module.css';
import { AstronomyEvent } from '@/services/astronomy';

interface InteractiveCalendarProps {
    events: AstronomyEvent[];
    locale: string;
}

export default function InteractiveCalendar({ events, locale }: InteractiveCalendarProps) {
    const t = useTranslations('Calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<AstronomyEvent | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // JS getDay() returns 0 for Sunday, 1 for Monday. Let's adjust to make Monday = 0
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Simple filter to get events for current month/year
    const currentMonthEvents = events.filter(e => {
        // e.dateEn is like "Jan 3" or "Mar 19/20"
        const cleanDate = e.dateEn.split('/')[0].trim();
        const eventDate = new Date(`${cleanDate} ${year}`);
        // But what if the event is actually from the original scraped year?
        // Relying on month string matching is safer for this specific timeanddate format
        const evMonthStr = e.dateEn.split(' ')[0]; // "Jan"
        const monthMatch = new Date(`${evMonthStr} 1 2000`).getMonth() === month;
        return monthMatch;
    });

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const renderDays = () => {
        const grid = [];

        // Empty cells before the 1st
        for (let i = 0; i < startOffset; i++) {
            grid.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            // Check if there are events on this day
            const dayEvents = currentMonthEvents.filter(e => {
                const datePart = e.dateEn.split(' ')[1]; // e.g. "3" or "19/20"
                if (!datePart) return false;
                const ranges = datePart.split('/'); // ["19", "20"]
                return ranges.includes(day.toString());
            });

            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            grid.push(
                <div key={day} className={`${styles.day} ${isToday ? styles.today : ''}`}>
                    <span className={styles.dayNumber}>{day}</span>
                    <div className={styles.dayEvents}>
                        {dayEvents.map(ev => (
                            <div
                                key={ev.id}
                                className={`${styles.eventDot} ${styles[ev.category]}`}
                                onClick={() => setSelectedEvent(ev)}
                                title={locale === 'tr' ? ev.titleTr : ev.titleEn}
                            >
                                <span className={styles.eventName}>{locale === 'tr' ? ev.titleTr : ev.titleEn}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return grid;
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
                <button onClick={prevMonth} className={styles.navBtn}>❮</button>
                <h2 className={styles.currentMonth}>{monthNames[month]} {year}</h2>
                <button onClick={nextMonth} className={styles.navBtn}>❯</button>
            </div>

            <div className={styles.weekdays}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className={styles.weekday}>{day}</div>
                ))}
            </div>

            <div className={styles.grid}>
                {renderDays()}
            </div>

            {selectedEvent && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedEvent(null)}>×</button>
                        <span className={`${styles.badge} ${styles[selectedEvent.category]}`}>
                            {locale === 'tr' ? selectedEvent.categoryTr : selectedEvent.categoryEn}
                        </span>
                        <h3>{locale === 'tr' ? selectedEvent.titleTr : selectedEvent.titleEn}</h3>
                        <p className={styles.modalDate}>{locale === 'tr' ? selectedEvent.dateTr : selectedEvent.dateEn} {year}</p>
                        <hr className={styles.divider} />
                        <p className={styles.modalDesc}>{locale === 'tr' ? selectedEvent.descriptionTr : selectedEvent.descriptionEn}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Intensity: {locale === 'tr' ? selectedEvent.intensityTr : selectedEvent.intensityEn}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
