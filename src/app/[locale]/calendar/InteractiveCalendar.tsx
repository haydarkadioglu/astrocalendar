'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import EventCard from '@/components/EventCard';
import styles from './InteractiveCalendar.module.css';
import { AstronomyCategory, AstronomyEvent } from '@/types/astronomy';

interface InteractiveCalendarProps {
    events: AstronomyEvent[];
    locale: string;
}

type CalendarFilter = 'all' | AstronomyCategory;

function getEventDayTokens(dateEn: string) {
    const datePart = dateEn.split(' ')[1];
    if (!datePart) {
        return [];
    }

    return datePart.split('/');
}

export default function InteractiveCalendar({ events, locale }: InteractiveCalendarProps) {
    const t = useTranslations('Calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<AstronomyEvent | null>(null);
    const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthLabel = new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric'
    }).format(currentDate);

    const currentMonthEvents = useMemo(() => {
        return events.filter((event) => {
            const evMonthStr = event.dateEn.split(' ')[0];
            const eventMonth = new Date(`${evMonthStr} 1 2000`).getMonth();
            const filterMatch = activeFilter === 'all' || event.category === activeFilter;
            return eventMonth === month && filterMatch;
        });
    }, [activeFilter, events, month]);

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const renderDays = () => {
        const grid = [];

        for (let i = 0; i < startOffset; i++) {
            grid.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = currentMonthEvents.filter((event) => getEventDayTokens(event.dateEn).includes(day.toString()));
            const now = new Date();
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

            grid.push(
                <div key={day} className={`${styles.day} ${isToday ? styles.today : ''}`}>
                    <span className={styles.dayNumber}>{day}</span>
                    <div className={styles.dayEvents}>
                        {dayEvents.map((event) => (
                            <button
                                key={event.id}
                                type="button"
                                className={`${styles.eventDot} ${styles[event.category]}`}
                                onClick={() => setSelectedEvent(event)}
                                title={locale === 'tr' ? event.titleTr : event.titleEn}
                            >
                                <span className={styles.eventName}>{locale === 'tr' ? event.titleTr : event.titleEn}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        return grid;
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.filterBar}>
                {(['all', 'meteor', 'eclipse', 'conjunction', 'satellite', 'moon', 'other'] as const).map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {t(`filters.${filter}`)}
                    </button>
                ))}
            </div>

            <div className={styles.calendarHeader}>
                <button type="button" onClick={prevMonth} className={styles.navBtn} aria-label={t('previousMonth')}>{'<'}</button>
                <h2 className={styles.currentMonth}>{monthLabel}</h2>
                <button type="button" onClick={nextMonth} className={styles.navBtn} aria-label={t('nextMonth')}>{'>'}</button>
            </div>

            <div className={styles.weekdays}>
                {Array.from({ length: 7 }).map((_, index) => {
                    const weekdayDate = new Date(2024, 0, index + 1);
                    return (
                        <div key={index} className={styles.weekday}>
                            {new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(weekdayDate)}
                        </div>
                    );
                })}
            </div>

            <div className={styles.grid}>
                {renderDays()}
            </div>

            <section className={styles.eventListSection}>
                <div className={styles.eventListHeader}>
                    <h3>{t('eventListTitle')}</h3>
                    <span className={styles.eventCount}>{currentMonthEvents.length}</span>
                </div>

                <div className={styles.eventList}>
                    {currentMonthEvents.length > 0 ? currentMonthEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            title={locale === 'tr' ? event.titleTr : event.titleEn}
                            date={locale === 'tr' ? event.dateTr : event.dateEn}
                            category={locale === 'tr' ? event.categoryTr : event.categoryEn}
                            categoryType={event.category}
                            description={locale === 'tr' ? event.descriptionTr : event.descriptionEn}
                            intensity={locale === 'tr' ? event.intensityTr : event.intensityEn}
                            intensityLabel={t('intensityLabel')}
                        />
                    )) : (
                        <div className={styles.emptyState}>{t('noEventsForFilter')}</div>
                    )}
                </div>
            </section>

            {selectedEvent ? (
                <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
                    <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
                        <button type="button" className={styles.closeBtn} onClick={() => setSelectedEvent(null)} aria-label={t('close')}>x</button>
                        <span className={`${styles.badge} ${styles[selectedEvent.category]}`}>
                            {locale === 'tr' ? selectedEvent.categoryTr : selectedEvent.categoryEn}
                        </span>
                        <h3>{locale === 'tr' ? selectedEvent.titleTr : selectedEvent.titleEn}</h3>
                        <p className={styles.modalDate}>{locale === 'tr' ? selectedEvent.dateTr : selectedEvent.dateEn} {year}</p>
                        <hr className={styles.divider} />
                        <p className={styles.modalDesc}>{locale === 'tr' ? selectedEvent.descriptionTr : selectedEvent.descriptionEn}</p>
                        <p className={styles.modalMeta}>
                            {t('intensityLabel')}: {locale === 'tr' ? selectedEvent.intensityTr : selectedEvent.intensityEn}
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
