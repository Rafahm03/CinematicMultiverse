// components/navbar/FilterNavbar.tsx
'use client';

import React from 'react';
import styles from './FilterNavbar.module.css';

interface FilterNavbarProps {
    activeGenres: string[];
    setActiveGenres: (genres: string[]) => void;
    activeYear: number | null;
    setActiveYear: (year: number | null) => void;
    activeRating: number | null;
    setActiveRating: (rating: number | null) => void;
}

const genresOptions = [
    { display: "Acción", value: "ACCION" },
    { display: "Comedia", value: "COMEDIA" },
    { display: "Ciencia Ficción", value: "CIENCIA_FICCION" },
    { display: "Fantasía", value: "FANTASIA" },
    { display: "Thriller", value: "THRILLER" },
    { display: "Horror", value: "TERROR" },
    { display: "Bélico", value: "BELICO" },
    { display: "Aventura", value: "AVENTURA" },
    { display: "Crimen", value: "CRIMEN" },
    { display: "Romance", value: "ROMANCE" },
    { display: "Drama", value: "DRAMA" },
    { display: "Anime", value: "ANIME" },
    { display: "Animación", value: "ANIMACION" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

const FilterNavbar: React.FC<FilterNavbarProps> = ({
                                                       activeGenres,
                                                       setActiveGenres,
                                                       activeYear,
                                                       setActiveYear,
                                                       activeRating,
                                                       setActiveRating,
                                                   }) => {

    const handleGenreClick = (genreValue: string) => {
        if (activeGenres.includes(genreValue)) {
            setActiveGenres(activeGenres.filter(g => g !== genreValue));
        } else {
            setActiveGenres([...activeGenres, genreValue]);
        }
    };

    const handleYearClick = (year: number) => {
        if (activeYear === year) {
            setActiveYear(null);
        } else {
            setActiveYear(year);
        }
    };

    const handleRatingClick = (rating: number) => {
        if (activeRating === rating) {
            setActiveRating(null);
        } else {
            setActiveRating(rating);
        }
    };

    return (
        <nav className={styles.filterNavbar}>
            <h3 className={styles.navbarTitle}>Filtrado</h3>

            <div className={styles.filterSection}>
                <h4 className={styles.sectionTitle}>Géneros</h4>
                <div className={styles.buttonGrid}>
                    {genresOptions.map(genre => (
                        <button
                            key={genre.value}
                            className={`${styles.filterButton} ${activeGenres.includes(genre.value) ? styles.active : ''}`}
                            onClick={() => handleGenreClick(genre.value)}
                        >
                            {genre.display}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterSection}>
                <h4 className={styles.sectionTitle}>Año</h4>
                <div className={styles.buttonGrid}>
                    {years.map(year => (
                        <button
                            key={year}
                            className={`${styles.filterButton} ${activeYear === year ? styles.active : ''}`}
                            onClick={() => handleYearClick(year)}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterSection}>
                <h4 className={styles.sectionTitle}>Puntuación</h4>
                <div className={styles.buttonGrid}>
                    {ratings.map(rating => (
                        <button
                            key={rating}
                            className={`${styles.filterButton} ${activeRating === rating ? styles.active : ''}`}
                            onClick={() => handleRatingClick(rating)}
                        >
                            {rating}
                        </button>
                    ))}
                </div>
            </div>

            {(activeGenres.length > 0 || activeYear !== null || activeRating !== null) && (
                <button
                    onClick={() => {
                        setActiveGenres([]);
                        setActiveYear(null);
                        setActiveRating(null);
                    }}
                    className={styles.clearFiltersButton}
                >
                    Limpiar Filtros
                </button>
            )}
        </nav>
    );
};

export default FilterNavbar;