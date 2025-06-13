'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header/Header';
import styles from './detail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';

type Review = {
    id: string;
    puntuacion: number;
    comentario: string;
    username: string;
    userId: string;
    tituloPelicula: string;
    fechaPublicacion?: string;
    isEdit?: boolean;
};

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
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMessage, setFavoriteMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewPuntuacion, setReviewPuntuacion] = useState(0);
    const [reviewComentario, setReviewComentario] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<{ id: string; userId: string; } | null>(null);

    const baseUrl = `http://localhost:8080/pelicula/`;
    const favoritesUrl = `http://localhost:8080/favoritos/add`;
    const reviewsByMovieUrl = `http://localhost:8080/review/buscarReviews?tituloPelicula=`;
    const createReviewUrl = `http://localhost:8080/review/crearReview`;
    const deleteReviewUrl = `http://localhost:8080/review/eliminarReview/`;

    const getUserIdFromToken = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                return payload.sub as string;
            } catch (e) {
                return null;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        const userId = getUserIdFromToken();
        setLoggedInUserId(userId);
        setIsLoggedIn(!!userId);
    }, [getUserIdFromToken]);

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
        const token = localStorage.getItem('accessToken');

        const requestHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
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
            setError(err.message || "Error desconocido al cargar los detalles.");
            setPelicula(null);
        } finally {
            setLoading(false);
        }
    }, [encodedTitulo, baseUrl]);

    const fetchMovieReviews = useCallback(async () => {
        if (!encodedTitulo) return;
        const decodedTitulo = decodeURIComponent(encodedTitulo as string);

        const token = localStorage.getItem('accessToken');
        const requestHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${reviewsByMovieUrl}${decodedTitulo}`, {
                method: 'GET',
                headers: requestHeaders,
            });

            if (!res.ok) {
                setReviews([]);
                return;
            }

            const data = await res.json();
            setReviews(data.content || []);

        } catch (err: any) {
            setReviews([]);
        }
    }, [encodedTitulo, reviewsByMovieUrl]);

    useEffect(() => {
        fetchMovieDetails();
        fetchMovieReviews();
    }, [fetchMovieDetails, fetchMovieReviews]);


    const handleAddToFavorites = async () => {
        if (!pelicula) return;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setFavoriteMessage({ message: 'Debes iniciar sesión para añadir a favoritos.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
            return;
        }

        try {
            const res = await fetch(favoritesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ titulo: pelicula.titulo }),
            });

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
            setFavoriteMessage({ message: err.message || 'Error desconocido al añadir a favoritos.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewSubmitting(true);
        setReviewError(null);

        if (reviewPuntuacion === 0) {
            setReviewError("Por favor, selecciona una puntuación.");
            setReviewSubmitting(false);
            return;
        }

        if (!pelicula) {
            setReviewError("Error: Película no cargada.");
            setReviewSubmitting(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setReviewError("Debes iniciar sesión para publicar una reseña.");
            setReviewSubmitting(false);
            return;
        }

        try {
            const res = await fetch(createReviewUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tituloPelicula: pelicula.titulo,
                    puntuacion: reviewPuntuacion,
                    comentario: reviewComentario,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || errorData.message || 'Error al publicar la reseña.');
            }

            const newReviewData: Review = await res.json();
            const newReview: Review = {
                ...newReviewData,
                id: String(newReviewData.id),
                username: newReviewData.username || 'Tu Reseña',
                userId: newReviewData.userId || loggedInUserId || 'unknown',
            };

            setReviews(prevReviews => [newReview, ...prevReviews]);

            setReviewPuntuacion(0);
            setReviewComentario('');
            setShowReviewModal(false);

            setFavoriteMessage({ message: '¡Reseña publicada con éxito!', type: 'success' });
            setTimeout(() => setFavoriteMessage(null), 3000);

        } catch (err: any) {
            setReviewError(err.message || "Error desconocido al publicar la reseña.");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleDeleteReviewButtonClick = (reviewId: string, reviewUserId: string) => {
        if (!isLoggedIn || loggedInUserId === null || loggedInUserId !== reviewUserId) {
            setFavoriteMessage({ message: 'No tienes permiso para eliminar esta reseña.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
            return;
        }
        setReviewToDelete({ id: reviewId, userId: reviewUserId });
        setShowConfirmDeleteModal(true);
    };

    const confirmDeleteReview = async () => {
        if (!reviewToDelete) return;

        const { id: reviewId, userId: reviewUserId } = reviewToDelete;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setFavoriteMessage({ message: 'Debes iniciar sesión para eliminar una reseña.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
            setShowConfirmDeleteModal(false);
            setReviewToDelete(null);
            return;
        }

        try {
            const res = await fetch(`${deleteReviewUrl}${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || errorData.message || 'Error al eliminar la reseña.');
            }

            setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
            setFavoriteMessage({ message: 'Reseña eliminada con éxito.', type: 'success' });
            setTimeout(() => setFavoriteMessage(null), 3000);

        } catch (err: any) {
            setFavoriteMessage({ message: err.message || 'Error desconocido al eliminar la reseña.', type: 'error' });
            setTimeout(() => setFavoriteMessage(null), 3000);
        } finally {
            setShowConfirmDeleteModal(false);
            setReviewToDelete(null);
        }
    };

    const cancelDeleteReview = () => {
        setShowConfirmDeleteModal(false);
        setReviewToDelete(null);
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

                <section className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <h2 className={styles.reviewsTitle}>Reseñas</h2>
                        {isLoggedIn && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className={styles.createReviewButton}
                                title="Escribir una reseña"
                            >
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                        )}
                    </div>

                    {isLoggedIn ? (
                        reviews.length > 0 ? (
                            <div className={styles.reviewList}>
                                {reviews.map(review => (
                                    <div key={review.id} className={styles.reviewCard}>
                                        <div className={styles.reviewCardHeader}>
                                            <p className={styles.reviewUser}>@{review.username}</p>
                                            {isLoggedIn && loggedInUserId === review.userId && (
                                                <button
                                                    onClick={() => handleDeleteReviewButtonClick(review.id, review.userId)}
                                                    className={styles.deleteReviewButton}
                                                    title="Eliminar reseña"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            )}
                                        </div>
                                        <p className={styles.reviewRating}>Puntuación: {review.puntuacion} / 10</p>
                                        <p className={styles.reviewComment}>{review.comentario}</p>
                                        {review.fechaPublicacion && (
                                            <p className={styles.reviewDate}>
                                                Publicado el: {new Date(review.fechaPublicacion).toLocaleDateString('es-ES')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noReviews}>Sé el primero en dejar una reseña para esta película.</p>
                        )
                    ) : (
                        <p className={styles.loginToReviewMessage}>
                            ¡Loguéate para poder ver las reseñas de esta película o añadir tu reseña!
                        </p>
                    )}
                </section>

                {showReviewModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button onClick={() => setShowReviewModal(false)} className={styles.modalCloseButton}>
                                &times;
                            </button>
                            <h2 className={styles.modalTitle}>Escribir una Reseña para "{pelicula.titulo}"</h2>
                            <form onSubmit={handleSubmitReview}>
                                <div className={styles.formGroup}>
                                    <label>Puntuación:</label>
                                    <div className={styles.ratingStars}>
                                        {[...Array(10)].map((_, index) => {
                                            const starValue = index + 1;
                                            return (
                                                <FontAwesomeIcon
                                                    key={starValue}
                                                    icon={faStar}
                                                    className={`${styles.star} ${starValue <= reviewPuntuacion ? styles.selected : ''}`}
                                                    onClick={() => setReviewPuntuacion(starValue)}
                                                />
                                            );
                                        })}
                                    </div>
                                    {reviewError && reviewError.includes("puntuación") && <p className={styles.ratingError}>{reviewError}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="comentario">Comentario:</label>
                                    <textarea
                                        id="comentario"
                                        value={reviewComentario}
                                        onChange={(e) => setReviewComentario(e.target.value)}
                                        className={styles.formTextarea}
                                        rows={5}
                                        placeholder="Comparte tu opinión sobre la película..."
                                        required
                                    ></textarea>
                                </div>
                                {reviewError && !reviewError.includes("puntuación") && <p className={styles.ratingError}>{reviewError}</p>}
                                <button
                                    type="submit"
                                    className={styles.submitReviewButton}
                                    disabled={reviewSubmitting || reviewPuntuacion === 0}
                                >
                                    {reviewSubmitting ? 'Publicando...' : 'Publicar Reseña'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {showConfirmDeleteModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2 className={styles.modalTitle}>Confirmar Eliminación</h2>
                            <p>¿Estás seguro de que quieres eliminar esta reseña?</p>
                            <div className={styles.modalActions}>
                                <button
                                    onClick={confirmDeleteReview}
                                    className={`${styles.modalButton} ${styles.confirmButton}`}
                                >
                                    Sí, eliminar
                                </button>
                                <button
                                    onClick={cancelDeleteReview}
                                    className={`${styles.modalButton} ${styles.cancelButton}`}
                                >
                                    No, cancelar
                                </button>
                            </div>
                        </div>
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