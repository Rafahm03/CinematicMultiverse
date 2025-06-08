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
    { src: '/carousel1.jpg', alt: 'Imagen 1 descripción' },
    { src: '/carousel2.jpg', alt: 'Imagen 2 descripción' },
    { src: '/carousel3.jpg', alt: 'Imagen 3 descripción' },
    { src: '/carousel4.jpg', alt: 'Imagen 4 descripción' },
];

export default function Home() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const apiUrl = `http://localhost:8080/pelicula/?page=0&size=10`;

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
                    throw new Error("No se encontraron películas");
                }

                const peliculasConImagen = data.content.map(peli => ({
                    ...peli,
                    imagen: peli.imagen && peli.imagen.trim() !== '' ? peli.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image'
                }));

                setPeliculas(peliculasConImagen);
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
    }, [apiUrl]);

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
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
                <div className="logo"> CinematicMultiverse</div>
            </header>

            <main className="main-content">
                <hr/>
                <h2 className="section-title">Películas destacadas</h2>

                <div className="movie-grid">
                    {peliculas.map(peli => (
                        <article key={peli.id} className="movie-card">
                            <img src={peli.imagen} alt={`Portada de ${peli.titulo}`}/>
                            <div className="movie-info">
                                <h3>{peli.titulo}</h3>
                                <div className="movie-stats">
                                    <span> {peli.puntuacion.toFixed(1)}</span>
                                    <span> {peli.anio}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <footer className="footer">
                 CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}
