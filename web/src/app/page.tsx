'use client';

import { useEffect, useState } from "react";

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
    const [currentSearchQuery, setCurrentSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const baseUrl = `http://localhost:8080/pelicula/`;

    useEffect(() => {
        const loadPeliculas = async () => {
            setLoading(true);
            setError(null);

            let apiUrl = '';
            const isSearchingNow = currentSearchQuery.trim() !== "";
            setIsSearching(isSearchingNow);

            if (isSearchingNow) {
                apiUrl = `${baseUrl}buscar?search=titulo:${encodeURIComponent(currentSearchQuery)},`;
            } else {
                apiUrl = `${baseUrl}?page=${currentPage}&size=10`;
            }

            try {
                const res = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!res.ok) {
                    if (res.status === 404 && isSearchingNow) {
                        setPeliculas([]);
                        setTotalPages(0);
                    } else {
                        throw new Error(`Error del servidor: ${res.status} - ${res.statusText}`);
                    }
                } else {
                    const data = await res.json();

                    let fetchedContent: Pelicula[] = [];
                    let totalPagesFromApi = 0;

                    if (isSearchingNow) {
                        if (Array.isArray(data)) {
                            fetchedContent = data as Pelicula[];
                            totalPagesFromApi = fetchedContent.length > 0 ? 1 : 0; // Para búsqueda, solo hay una "página" de resultados
                        } else {
                            throw new Error("Formato de respuesta de búsqueda inesperado.");
                        }
                    } else {
                        if (data && typeof data === 'object' && 'content' in data && 'totalPages' in data) {
                            const paginatedData = data as ApiResponse;
                            fetchedContent = paginatedData.content || [];
                            totalPagesFromApi = paginatedData.totalPages || 0;

                            if (fetchedContent.length === 0 && paginatedData.totalElements > 0 && currentPage >= paginatedData.totalPages) {
                                setCurrentPage(Math.max(0, paginatedData.totalPages - 1));
                                return;
                            }
                        } else {
                            throw new Error("Formato de respuesta de paginación inesperado.");
                        }
                    }

                    const peliculasConImagen = fetchedContent.map(peli => ({
                        ...peli,
                        imagen: peli.imagen && peli.imagen.trim() !== '' ? peli.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image'
                    }));

                    setPeliculas(peliculasConImagen);
                    setTotalPages(totalPagesFromApi);
                }
            } catch (err: any) {
                console.error("Error cargando películas:", err);
                if (err instanceof TypeError && err.message.includes("fetch")) {
                    setError("No se pudo conectar con el servidor. ¿Está el backend activo?");
                } else {
                    setError(err.message || "Error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        loadPeliculas();
    }, [currentPage, currentSearchQuery, baseUrl]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselImages.length]);

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

    // Manejo del input de búsqueda
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm !== currentSearchQuery) {
            setCurrentSearchQuery(searchTerm);
            if (currentPage !== 0) {
                setCurrentPage(0);
            }
        } else if (searchTerm.trim() === "" && currentSearchQuery.trim() !== "") {
            setCurrentSearchQuery("");
            if (currentPage !== 0) {
                setCurrentPage(0);
            }
        }
    };

    const handleKeyDownInSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearchSubmit();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
                <div className="text-white text-xl">Cargando películas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
                <div className="text-red-500 text-xl text-center p-4 rounded-lg bg-gray-800 shadow-lg">
                    ⚠️ Error al cargar las películas:<br /> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">CinematicMultiverse</div>
            </header>

            <main className="main-content">
                <div className="carousel-container">
                    <div className="carousel-image-wrapper">
                        <img
                            src={carouselImages[activeIndex].src}
                            alt={carouselImages[activeIndex].alt}
                            className="carousel-image"
                        />
                    </div>
                </div>

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Buscar películas por título..."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDownInSearch}
                        className="search-input"
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="search-button"
                    >
                        Buscar
                    </button>
                </div>

                <h2 className="section-title">
                    {isSearching ? "Resultados de la búsqueda" : "Películas destacadas"}
                </h2>

                <div className="movie-grid">
                    {peliculas.length > 0 ? (
                        peliculas.map(peli => (
                            <article key={peli.id} className="movie-card">
                                <img
                                    src={peli.imagen}
                                    alt={`Portada de ${peli.titulo}`}
                                    className="movie-card-image"
                                />
                                <div className="movie-info">
                                    <h3 className="movie-title">{peli.titulo}</h3>
                                    <div className="movie-stats">
                                        <span>⭐ {peli.puntuacion.toFixed(1)}</span>
                                        <span>🎬 {peli.anio}</span>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="no-movies-message">
                            {isSearching && currentSearchQuery.trim() !== "" ? "No se encontraron películas con ese título." : "No hay películas disponibles."}
                        </div>
                    )}
                </div>

                {!isSearching && totalPages > 1 && (
                    <div className="pagination-container">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 0 || loading}
                            className={`pagination-button prev-next ${currentPage === 0 || loading ? 'disabled' : ''}`}
                        >
                            Anterior
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i)}
                                disabled={loading}
                                className={`pagination-button page-number ${i === currentPage ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1 || loading}
                            className={`pagination-button prev-next ${currentPage === totalPages - 1 || loading ? 'disabled' : ''}`}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </main>

            <footer className="footer">
                CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}