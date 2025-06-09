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

    const apiUrl = `http://localhost:8080/pelicula/?page=${currentPage}&size=10`;

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error(`Error del servidor: ${res.status} - ${res.statusText}`);
                }

                const data: ApiResponse = await res.json();

                if (!data.content || data.content.length === 0) {
                    if (currentPage > 0 && data.totalElements === 0) {
                        setCurrentPage(0);
                        return;
                    }
                    if (data.content.length === 0 && currentPage >= data.totalPages) {
                        setCurrentPage(Math.max(0, data.totalPages - 1)); // Si la página actual excede el total, ir a la última página válida
                        return;
                    }
                    throw new Error("No se encontraron películas");
                }

                const peliculasConImagen = data.content.map(peli => ({
                    ...peli,
                    imagen: peli.imagen && peli.imagen.trim() !== '' ? peli.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image'
                }));

                setPeliculas(peliculasConImagen);
                setTotalPages(data.totalPages);

            } catch (err: any) {
                if (err instanceof TypeError && err.message.includes("fetch")) {
                    setError("No se pudo conectar con el servidor. ¿Está el backend activo?");
                } else {
                    setError(err.message || "Error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPeliculas();
    }, [apiUrl, currentPage]);

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev + 1));
    };

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages && page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPrevPage = () => {
        goToPage(currentPage - 1);
    };

    const goToNextPage = () => {
        goToPage(currentPage + 1);
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
                <div className="logo text-white text-3xl text-center py-4">CinematicMultiverse</div>
            </header>

            <main className="main-content">
                {/* Carrusel */}
                <div className="flex justify-center mt-6">
                    <div className="relative w-[600px] h-[400px] rounded-lg overflow-hidden shadow-lg bg-black">
                        <img
                            src={carouselImages[activeIndex].src}
                            alt={carouselImages[activeIndex].alt}
                            className="w-full h-full object-cover transition duration-700 ease-in-out"
                        />
                    </div>
                </div>

                <h2 className="section-title text-white text-2xl text-center mb-4 mt-8">Películas destacadas</h2>

                {}
                <div
                    className="movie-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 mb-20">
                    {peliculas.map(peli => (
                        <article key={peli.id} className="movie-card bg-gray-900 p-2 rounded-lg shadow-lg">
                            <img
                                src={peli.imagen}
                                alt={`Portada de ${peli.titulo}`}
                                className="w-full h-[400px] object-cover rounded-md"
                            />
                            <div className="movie-info mt-2 text-white">
                                <h3 className="text-lg font-semibold truncate">{peli.titulo}</h3>
                                <div className="movie-stats flex justify-between text-sm text-gray-400 mt-1">
                                    <span>⭐ {peli.puntuacion.toFixed(1)}</span>
                                    <span>🎬 {peli.anio}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>


                {}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-16 mb-8"> {}
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 0 || loading}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-lg
                                ${currentPage === 0 || loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-red-700 hover:bg-red-800 text-white shadow-md'
                            }`}
                        >
                            Anterior
                        </button>

                        {}
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i)}
                                disabled={loading}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-lg
                                    ${i === currentPage
                                    ? 'bg-red-600 text-white shadow-lg border-2 border-white' 
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                                }`}
                            >
                                {i + 1} {}
                            </button>
                        ))}

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1 || loading}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-lg
                                ${currentPage === totalPages - 1 || loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-red-700 hover:bg-red-800 text-white shadow-md'
                            }`}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </main>

            <footer className="footer mt-10 text-center text-gray-400 text-sm py-6">
                CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}