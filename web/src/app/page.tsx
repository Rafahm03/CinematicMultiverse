'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Header from './components/Header/Header';
import Link from 'next/link';

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
    const [isSearching, setIsSearching] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const baseUrl = `http://localhost:8080/pelicula/`;

    const fetchPeliculas = useCallback(async () => {
        setLoading(true);
        setError(null);

        let currentApiUrl: string;
        let fetchedPeliculas: Pelicula[] = [];
        let totalPagesFetched = 0;

        const searching = activeSearchTerm.trim() !== "";
        setIsSearching(searching);

        if (searching) {
            currentApiUrl = `${baseUrl}buscar?search=titulo:${encodeURIComponent(activeSearchTerm)},`;
        } else {
            currentApiUrl = `${baseUrl}?page=${currentPage}&size=10`;
        }

        try {
            const res = await fetch(currentApiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!res.ok) {
                if (res.status === 404 && searching) {
                    fetchedPeliculas = [];
                    totalPagesFetched = 0;
                } else {
                    throw new Error(`Error del servidor: ${res.status} - ${res.statusText}`);
                }
            } else {
                const data = await res.json();

                if (searching) {
                    if (Array.isArray(data)) {
                        fetchedPeliculas = data as Pelicula[];
                        totalPagesFetched = fetchedPeliculas.length > 0 ? 1 : 0;
                    } else {
                        throw new Error("Formato de respuesta de búsqueda inesperado. Se esperaba un array de películas.");
                    }
                } else {
                    if (data && typeof data === 'object' && 'content' in data && 'totalPages' in data) {
                        const paginatedData = data as ApiResponse;
                        fetchedPeliculas = paginatedData.content || [];
                        totalPagesFetched = paginatedData.totalPages || 0;

                        if (fetchedPeliculas.length === 0 && paginatedData.totalElements > 0 && currentPage >= paginatedData.totalPages) {
                            setCurrentPage(Math.max(0, paginatedData.totalPages - 1));
                            return;
                        }
                    } else {
                        throw new Error("Formato de respuesta de paginación inesperado. Se esperaba un objeto con 'content' y 'totalPages'.");
                    }
                }

                if (fetchedPeliculas.length === 0 && !searching) {
                    if (data && 'totalElements' in data && data.totalElements === 0 && currentPage === 0) {

                    }
                    if (currentPage > 0 && totalPagesFetched > 0 && currentPage >= totalPagesFetched) {
                        setCurrentPage(Math.max(0, totalPagesFetched - 1));
                        return;
                    }
                }
            }

            const peliculasConImagen = fetchedPeliculas.map(peli => ({
                ...peli,
                imagen: peli.imagen && peli.imagen.trim() !== '' ? peli.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image'
            }));

            setPeliculas(peliculasConImagen);
            setTotalPages(totalPagesFetched);

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
    }, [currentPage, activeSearchTerm, baseUrl]);

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

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const goToPrevPage = () => {
        goToPage(currentPage - 1);
    };

    const goToNextPage = () => {
        goToPage(currentPage + 1);
    };

    // --- Lógica de Búsqueda ---
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm !== activeSearchTerm) {
            setActiveSearchTerm(searchTerm);
            if (currentPage !== 0) {
                setCurrentPage(0);
            }
        }
        if (searchTerm.trim() === "" && activeSearchTerm.trim() !== "") {
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
                    {isSearching ? "Resultados de la búsqueda" : "Películas destacadas"}
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
                            {isSearching && activeSearchTerm.trim() !== ""
                                ? "No se encontraron películas con ese título."
                                : "No hay películas disponibles."}
                        </div>
                    )}
                </div>

                {!isSearching && totalPages > 1 && (
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

            <footer className={styles.footer}>
                CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}