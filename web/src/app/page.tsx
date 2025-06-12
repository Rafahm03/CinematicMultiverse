// page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Header from './components/Header/Header';
import Link from 'next/link';
import FilterNavbar from './components/navbar/FilterNavbar';

type Pelicula = {
    id: string;
    titulo: string;
    imagen: string;
    sinopsis: string;
    puntuacion: number;
    duracion: number;
    anio: number;
    generos: string[];
};

type ApiResponse = {
    content: Pelicula[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalPages: number;
    totalElements: number;
};

const carouselImages = [
    { src: '/posters/4fantasticos.png', alt: 'Los 4 Fantásticos' },
    { src: '/posters/sinners.png', alt: 'sinners' },
    { src: '/posters/starwars.png', alt: 'starwars' },
];

export default function Home() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeSearchTerm, setActiveSearchTerm] = useState("");
    const [isSearchingByTitle, setIsSearchingByTitle] = useState(false);

    const [activeGenres, setActiveGenres] = useState<string[]>([]);
    const [activeYear, setActiveYear] = useState<number | null>(null);
    const [activeRating, setActiveRating] = useState<number | null>(null);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const baseUrl = `http://localhost:8080/pelicula/`;

    const anyFilterOrSearchActive = activeSearchTerm.trim() !== "" || activeGenres.length > 0 || activeYear !== null || activeRating !== null;


    const fetchPeliculas = useCallback(async () => {
        setLoading(true);
        setError(null);

        let currentApiUrl: string;
        let fetchedPeliculas: Pelicula[] = [];
        let totalPagesFetched = 0;
        let currentPageFetched = 0;

        setIsSearchingByTitle(activeSearchTerm.trim() !== "");

        let searchQueryParts: string[] = [];
        if (activeSearchTerm.trim() !== "") {
            searchQueryParts.push(`titulo:${encodeURIComponent(activeSearchTerm)}`);
        }
        if (activeGenres.length > 0) {
            searchQueryParts.push(`generos:${activeGenres.map(g => encodeURIComponent(g)).join(',')}`);
        }
        if (activeYear !== null) {
            searchQueryParts.push(`anio:${activeYear}`);
        }
        if (activeRating !== null) {
            const minRating = activeRating;
            const maxRatingExclusive = activeRating + 1;

            searchQueryParts.push(`puntuacionMin:${minRating.toFixed(2)}`);
            searchQueryParts.push(`puntuacionLessThan:${maxRatingExclusive.toFixed(2)}`);
        }

        if (searchQueryParts.length > 0) {
            currentApiUrl = `${baseUrl}buscar?search=${searchQueryParts.join(';')}`;
        } else {
            currentApiUrl = `${baseUrl}?page=${currentPage}&size=10`;
        }

        const token = localStorage.getItem('jwtToken');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(currentApiUrl, {
                method: 'GET',
                headers: headers,
                credentials: 'include',
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError("Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.");
                } else if (res.status === 404 && anyFilterOrSearchActive) { // <--- Usamos anyFilterOrSearchActive aquí
                    fetchedPeliculas = [];
                    totalPagesFetched = 0;
                    currentPageFetched = 0;
                } else {
                    throw new Error(`Error del servidor: ${res.status} - ${res.statusText}`);
                }
            } else {
                const data = await res.json();

                if (data && typeof data === 'object' && 'content' in data && 'totalPages' in data && 'pageable' in data) {
                    const paginatedData = data as ApiResponse;
                    fetchedPeliculas = paginatedData.content || [];
                    totalPagesFetched = paginatedData.totalPages || 0;
                    currentPageFetched = paginatedData.pageable.pageNumber;

                    if (fetchedPeliculas.length === 0 && paginatedData.totalElements > 0 && currentPage >= paginatedData.totalPages) {
                        setCurrentPage(Math.max(0, paginatedData.totalPages - 1));
                        return;
                    }
                }
                else if (Array.isArray(data)) {
                    fetchedPeliculas = data as Pelicula[];
                    totalPagesFetched = fetchedPeliculas.length > 0 ? 1 : 0;
                    currentPageFetched = 0;
                } else {
                    throw new Error("Formato de respuesta de API inesperado. Se esperaba un objeto de paginación o un array.");
                }
            }

            const peliculasConImagen = fetchedPeliculas.map(peli => ({
                ...peli,
                imagen: peli.imagen && peli.imagen.trim() !== '' ? peli.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image'
            }));

            setPeliculas(peliculasConImagen);
            setTotalPages(totalPagesFetched);
            setCurrentPage(currentPageFetched);

        } catch (err: any) {
            console.error("Error fetching movies:", err);
            if (err instanceof TypeError && err.message.includes("fetch")) {
                setError("No se pudo conectar con el servidor. ¿Está el backend activo?");
            } else {
                setError(err.message || "Error desconocido");
            }
        } finally {
            setLoading(false);
        }
    }, [currentPage, activeSearchTerm, activeGenres, activeYear, activeRating, baseUrl, router, anyFilterOrSearchActive]);

    useEffect(() => {
        fetchPeliculas();
    }, [fetchPeliculas]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    }, []);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const goToPage = useCallback((page: number) => {
        if (!anyFilterOrSearchActive) { // <--- anyFilterOrSearchActive ya está definida
            if (page >= 0 && page < totalPages && page !== currentPage) {
                setCurrentPage(page);
            }
        }
    }, [anyFilterOrSearchActive, totalPages, currentPage]);

    const goToPrevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [goToPage, currentPage, loading]);

    const goToNextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [goToPage, currentPage, loading]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm !== activeSearchTerm) {
            setActiveSearchTerm(searchTerm);
            if (activeGenres.length > 0) setActiveGenres([]);
            if (activeYear !== null) setActiveYear(null);
            if (activeRating !== null) setActiveRating(null);
            if (currentPage !== 0) {
                setCurrentPage(0);
            }
        } else if (searchTerm.trim() === "" && activeSearchTerm.trim() !== "") {
            setActiveSearchTerm("");
            if (currentPage !== 0) {
                setCurrentPage(0);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearchSubmit();
        }
    };

    if (loading) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>Cargando películas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>
                    ⚠️ Error al cargar las películas:<br /> {error}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            <Header />

            <div className={styles.contentWrapper}>
                <FilterNavbar
                    activeGenres={activeGenres}
                    setActiveGenres={setActiveGenres}
                    activeYear={activeYear}
                    setActiveYear={setActiveYear}
                    activeRating={activeRating}
                    setActiveRating={setActiveRating}
                />

                <main className={styles.mainContent}>
                    <div className={styles.carouselContainer}>
                        <img
                            src={carouselImages[activeIndex].src}
                            alt={carouselImages[activeIndex].alt}
                            className={styles.carouselImage}
                        />
                    </div>

                    <div className={styles.searchBarContainer}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Buscar películas por título..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            className={styles.searchInput}
                        />
                        <button
                            onClick={handleSearchSubmit}
                            className={styles.searchButton}
                        >
                            Buscar
                        </button>
                    </div>

                    <h2 className={styles.sectionTitle}>
                        {anyFilterOrSearchActive ? "Resultados del Filtrado" : "Películas destacadas"}
                    </h2>

                    <div className={styles.movieGrid}>
                        {peliculas.length > 0 ? (
                            peliculas.map(peli => (
                                <Link key={peli.id} href={`/peliculas/${peli.titulo}`}
                                      className={styles.movieCardLink}>
                                    <article className={styles.movieCard}>
                                        <img
                                            src={peli.imagen}
                                            alt={`Portada de ${peli.titulo}`}
                                            className={styles.movieCardImg}
                                        />
                                        <div className={styles.movieInfo}>
                                            <h3>{peli.titulo}</h3>
                                            <div className={styles.movieStats}>
                                                <span>⭐ {peli.puntuacion.toFixed(1)}</span>
                                                <span>🎬 {peli.anio}</span>
                                            </div>
                                        </div>
                                        <div className={styles.movieOverlay}>
                                            <p className={styles.synopsis}>{peli.sinopsis}</p>
                                            <p className={styles.details}>
                                                Duración: {peli.duracion} min | Géneros: {peli.generos.join(', ')}
                                            </p>
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            <div className={styles.centeredMessage}>
                                {anyFilterOrSearchActive
                                    ? "No se encontraron películas con los filtros aplicados."
                                    : "No hay películas disponibles."}
                            </div>
                        )}
                    </div>

                    {!anyFilterOrSearchActive && totalPages > 1 && (
                        <div className={styles.paginationContainer}>
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 0 || loading}
                                className={`${styles.paginationButton} ${styles.prevNext} ${currentPage === 0 || loading ? styles.disabled : ''}`}
                            >
                                Anterior
                            </button>

                            {Array.from({length: totalPages}, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    disabled={loading}
                                    className={`${styles.paginationButton} ${styles.pageNumber} ${i === currentPage ? styles.active : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages - 1 || loading}
                                className={`${styles.paginationButton} ${styles.prevNext} ${currentPage === totalPages - 1 || loading ? styles.disabled : ''}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <footer className={styles.footer}>
                CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}