'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import BodyCard from './BodyCard';
import styles from './LiveSearch.module.css';
import { WikiSummaryResponse } from '@/services/wikipedia';
import { CelestialBody } from '@/types/bodies';

type BodyFilter = 'all' | 'planets' | 'moons' | 'dwarf_planets' | 'galaxies';

interface LiveSearchProps {
    initialBodies: CelestialBody[];
    locale: string;
}

function matchesFilter(body: CelestialBody, filter: BodyFilter) {
    if (filter === 'all') {
        return true;
    }

    return body.group === filter;
}

export default function LiveSearch({ initialBodies, locale }: LiveSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CelestialBody[]>(initialBodies);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState<BodyFilter>('all');
    const t = useTranslations('Encyclopedia');

    const filteredResults = results.filter((body) => matchesFilter(body, activeFilter));

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) {
            setResults(initialBodies);
            setError('');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/wiki?q=${encodeURIComponent(query)}&lang=${locale}`);

            if (!res.ok) {
                throw new Error('Search request failed');
            }

            const data = await res.json() as WikiSummaryResponse;

            if (data.title) {
                setResults([{
                    id: data.title.toLowerCase().replace(/\s+/g, '-'),
                    name: data.title,
                    type: t('searchResultType'),
                    image: data.thumbnail?.source || data.originalimage?.source || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
                    description: data.extract || t('searchNoResult'),
                    articleUrl: data.content_urls?.desktop?.page,
                    group: 'search'
                }]);
            } else {
                setResults([]);
                setError(t('searchNoResult'));
            }
        } catch (err) {
            console.error(err);
            setResults([]);
            setError(t('searchError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.searchBar} style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                {(['all', 'planets', 'moons', 'dwarf_planets', 'galaxies'] as const).map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={styles.searchBtn}
                        aria-pressed={activeFilter === filter}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {t(`categories.${filter}`)}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearch} className={styles.searchBar}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn} disabled={loading}>
                    {loading ? '...' : t('searchButton')}
                </button>
            </form>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.grid}>
                {filteredResults.length > 0 ? (
                    filteredResults.map((body) => (
                        <BodyCard
                            key={body.id}
                            name={body.name}
                            type={body.type}
                            image={body.image}
                            description={body.description}
                            articleUrl={body.articleUrl}
                        />
                    ))
                ) : (
                    !loading && <div className={styles.noResults}>{t('emptyState')}</div>
                )}
            </div>
        </>
    );
}
