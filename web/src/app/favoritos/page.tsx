'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Header from '../components/Header/Header';
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

export default function FavoritesPage() {
    const [favoriteMovies, setFavoriteMovies] = useState<Pelicula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const router = useRouter();

    const fetchFavoriteMovies = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const token = localStorage.getItem('accessToken');

        if (!token) {
            setMessage('Debes iniciar sesión para ver tus favoritos.');
            setLoading(false);
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/favoritos/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 404 && errorData.detail && errorData.detail.includes("tu lista de Favoritos está vacía")) {
                    setFavoriteMovies([]);
                    setMessage(errorData.detail);
                } else {

                    setError(errorData.detail || errorData.message || `Error del servidor: ${res.status} - ${res.statusText}`);
                }
            } else {
                const data: Pelicula[] = await res.json();

                const peliculasConImagen = data.map(peli => ({
                    ...peli,
                    imagen: peli.imagen && peli.imagen.trim() !== '' ? peli.imagen : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Image'
                }));

                setFavoriteMovies(peliculasConImagen);

                if (peliculasConImagen.length === 0) {
                    setMessage('Todavía no tienes películas favoritas. ¡Explora y añade algunas!');
                }
            }

        } catch (err: any) {
            console.error("Error fetching favorite movies:", err);
            setError(err.message || "Error desconocido al cargar favoritos.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromFavorites = async (tituloPelicula: string) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setMessage('Debes iniciar sesión para eliminar favoritos.');
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/favoritos/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ titulo: tituloPelicula }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al eliminar de favoritos');
            }

            await fetchFavoriteMovies();
            setMessage(`"${tituloPelicula}" eliminada de tus favoritos.`);
            setTimeout(() => setMessage(null), 3000);

        } catch (err: any) {
            console.error("Error removing from favorites:", err);
            setMessage(err.message || 'Error desconocido al eliminar de favoritos.');
            setTimeout(() => setMessage(null), 3000);
        }
    };


    useEffect(() => {
        fetchFavoriteMovies();
    }, []);

    if (loading) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>Cargando tus películas favoritas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>
                    ⚠️ Error al cargar tus favoritos:<br /> {error}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            <Header />

            <main className={styles.mainContent}>
                <h2 className={styles.sectionTitle}>Mis Películas Favoritas</h2>

                {message && (
                    <div className={styles.infoMessage}>
                        {message}
                    </div>
                )}

                {favoriteMovies.length > 0 ? (
                    <div className={styles.movieGrid}>
                        {favoriteMovies.map(peli => (
                            <article key={peli.id} className={styles.movieCard}>
                                <Link href={`/peliculas/${encodeURIComponent(peli.titulo)}`} className={styles.movieCardLink}>
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

                                </Link>
                                <button
                                    onClick={() => handleRemoveFromFavorites(peli.titulo)}
                                    className={styles.removeFromFavoritesButton}
                                    aria-label={`Eliminar "${peli.titulo}" de favoritos`}
                                >
                                    💔 Eliminar de Favoritos
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (

                    !message && (
                        <div className={styles.centeredMessage}>
                            Aún no tienes películas favoritas. ¡Descubre nuevas y añádelas a tu lista!
                        </div>
                    )
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