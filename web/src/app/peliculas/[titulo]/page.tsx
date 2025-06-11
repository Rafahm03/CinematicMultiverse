'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header/Header';
import styles from './detail.module.css';

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

export default function MovieDetailPage() {
    const { titulo: encodedTitulo } = useParams();
    const [pelicula, setPelicula] = useState<Pelicula | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMessage, setFavoriteMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const baseUrl = `http://localhost:8080/pelicula/`;
    const favoritesUrl = `http://localhost:8080/favoritos/add`;

    const fetchMovieDetails = useCallback(async () => {
        if (!encodedTitulo) {
            setLoading(false);
            setError("Título de película no proporcionado.");
            return;
        }

        setLoading(true);
        setError(null);
        setFavoriteMessage(null);

        const decodedTitulo = decodeURIComponent(encodedTitulo as string);

        let accessToken: string | null = null;
        if (typeof window !== 'undefined') {
            accessToken = localStorage.getItem('accessToken');
        }

        const requestHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (accessToken) {
            requestHeaders['Authorization'] = `Bearer ${accessToken}`;
        }

        try {
            const movieRes = await fetch(`${baseUrl}${decodedTitulo}`, {
                method: 'GET',
                headers: requestHeaders,
                credentials: 'include',
            });

            if (!movieRes.ok) {
                if (movieRes.status === 403) {
                    throw new Error("Acceso denegado. Por favor, inicie sesión para ver los detalles de la película o verifique sus permisos.");
                }
                if (movieRes.status === 404) {
                    setPelicula(null);
                    throw new Error("Película no encontrada.");
                }
                throw new Error(`Error al cargar detalles de la película: ${movieRes.status} - ${movieRes.statusText}`);
            }
            const movieData: Pelicula = await movieRes.json();
            movieData.imagen = movieData.imagen && movieData.imagen.trim() !== '' ? movieData.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image';
            setPelicula(movieData);

        } catch (err: any) {
            console.error("Error fetching movie details:", err);
            setError(err.message || "Error desconocido al cargar los detalles.");
            setPelicula(null);
        } finally {
            setLoading(false);
        }
    }, [encodedTitulo, baseUrl ]);

    useEffect(() => {
        fetchMovieDetails();
    }, [fetchMovieDetails]);

    const handleAddToFavorites = async () => {
        console.log("handleAddToFavorites: Función llamada.");

        if (!pelicula) {
            console.log("handleAddToFavorites: Película no cargada, saliendo.");
            return;
        }

        console.log("handleAddToFavorites: Película disponible:", pelicula.titulo);

        const token = localStorage.getItem('accessToken');

        console.log("handleAddToFavorites: Token obtenido de localStorage:", token);

        if (!token) {
            setFavoriteMessage({ message: 'Debes iniciar sesión para añadir a favoritos.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
            console.log("handleAddToFavorites: No hay token, saliendo.");
            return;
        }

        console.log("handleAddToFavorites: Token presente, intentando añadir a favoritos...");

        try {
            const res = await fetch(favoritesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ titulo: pelicula.titulo }),
            });

            console.log("handleAddToFavorites: Petición fetch completada. Estado de respuesta:", res.status);

            if (!res.ok) {
                const errorData = await res.json();
                if (errorData.detail && errorData.detail.includes("ya está en tu lista de favoritos")) {
                    setFavoriteMessage({ message: `"${pelicula.titulo}" ya está en tus favoritos.`, type: 'error' });
                } else {
                    throw new Error(errorData.detail || errorData.message || 'Error al añadir a favoritos');
                }
            } else {
                setFavoriteMessage({ message: `"${pelicula.titulo}" añadida a tus favoritos.`, type: 'success' });
            }

            setTimeout(() => setFavoriteMessage(null), 3000);

        } catch (err: any) {
            console.error("handleAddToFavorites: Error adding to favorites:", err);
            setFavoriteMessage({ message: err.message || 'Error desconocido al añadir a favoritos.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
        }
    };


    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <Header />
                <div className={styles.loadingMessage}>Cargando detalles de la película...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <Header />
                <div className={styles.errorMessage}>
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    if (!pelicula) {
        return (
            <div className={styles.pageContainer}>
                <Header />
                <div className={styles.errorMessage}>
                    No se encontró la película.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Header />

            <main className={styles.mainContent}>
                {favoriteMessage && (
                    <div className={`${styles.feedbackMessage} ${favoriteMessage.type === 'success' ? styles.success : styles.error}`}>
                        {favoriteMessage.message}
                    </div>
                )}

                <section className={styles.movieDetailHeader}>
                    <div className={styles.moviePosterContainer}>
                        <img src={pelicula.imagen} alt={`Poster de ${pelicula.titulo}`} className={styles.moviePoster} />
                        <button
                            onClick={handleAddToFavorites}
                            className={styles.addToFavoritesButton}
                            aria-label={`Añadir "${pelicula.titulo}" a favoritos`}
                        >
                            ❤️
                        </button>
                    </div>
                    <div className={styles.movieInfoBlock}>
                        <div className={styles.titleRatingContainer}>
                            <h1 className={styles.movieTitle}>{pelicula.titulo.toUpperCase()} ({pelicula.anio})</h1>
                            <span className={styles.movieRating}>{pelicula.puntuacion.toFixed(1)}</span>
                        </div>
                        <p className={styles.movieSynopsis}>{pelicula.sinopsis}</p>
                        <div className={styles.movieMeta}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaIcon}>📅</span>
                                <span className={styles.metaText}>Año: {pelicula.anio}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaIcon}>🕒</span>
                                <span className={styles.metaText}>Duración: {formatDuration(pelicula.duracion)}</span>
                            </div>
                        </div>
                        <div className={styles.movieGenres}>
                            {pelicula.generos.map(genre => (
                                <span key={genre} className={styles.genreTag}>{genre}</span>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}