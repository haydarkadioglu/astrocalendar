'use client';

import { useState } from 'react';
import BodyCard from './BodyCard';
import styles from './LiveSearch.module.css';
import { useTranslations } from 'next-intl';

export default function LiveSearch({ initialBodies, locale }: { initialBodies: any[], locale: string }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>(initialBodies);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = useTranslations('Encyclopedia');

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
            // Use the Next.js API route we will create to proxy Wikipedia calls
            const res = await fetch(`/api/wiki?q=${encodeURIComponent(query)}&lang=${locale}`);

            if (!res.ok) {
                throw new Error('Cisim bulunamadı');
            }

            const data = await res.json();

            // Wikipedia summary API returns standard page format
            if (data && data.title) {
                setResults([{
                    id: data.title.toLowerCase().replace(/\s+/g, '-'),
                    name: data.title,
                    type: 'Arama Sonucu', // Default type for remote loose searches
                    image: data.thumbnail?.source || data.originalimage?.source || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
                    description: data.extract || 'Açıklama bulunamadı.'
                }]);
            } else {
                setResults([]);
                setError('Sonuç bulunamadı.');
            }

        } catch (err) {
            console.error(err);
            setResults([]);
            setError('Arama yapılırken bir hata oluştu veya cisim bulunamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSearch} className={styles.searchBar}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn} disabled={loading}>
                    {loading ? '...' : 'Ara'}
                </button>
            </form>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.grid}>
                {results.length > 0 ? (
                    results.map(body => (
                        <BodyCard
                            key={body.id}
                            id={body.id}
                            name={body.name}
                            type={body.type}
                            image={body.image}
                            description={body.description}
                        />
                    ))
                ) : (
                    !loading && <div className={styles.noResults}>Gösterilecek gök cismi yok.</div>
                )}
            </div>
        </>
    );
}
