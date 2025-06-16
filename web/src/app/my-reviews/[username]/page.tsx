// app/my-reviews/[username]/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header/Header';
import styles from './MyReviews.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { decodeToken, userHasRole } from '../../../../utils/jwt';

type Review = {
    id: string;
    puntuacion: number;
    comentario: string;
    username: string;
    userId: string;
    tituloPelicula: string;
    fechaPublicacion?: string;
};

export default function MyReviewsPage() {
    const { username: urlUsername } = useParams();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<{ id: string; userId: string; } | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const reviewsByUserUrl = `http://localhost:8080/review/myReviews/`;
    const deleteReviewUrl = `http://localhost:8080/review/eliminarReview/`;

    const getAuthToken = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }, []);

    const getLoggedInUserInfoFromToken = useCallback(() => {
        const token = getAuthToken();
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                const userId = (decoded as any).id || (decoded as any).userId || decoded.sub;
                const username = decoded.sub;
                return { userId, username };
            }
        }
        return { userId: null, username: null };
    }, [getAuthToken]);

    useEffect(() => {
        const { userId, username } = getLoggedInUserInfoFromToken();
        setLoggedInUserId(userId);
        setLoggedInUsername(username);
    }, [getLoggedInUserInfoFromToken]);

    const fetchUserReviews = useCallback(async () => {
        if (!urlUsername) {
            setLoading(false);
            setError("Nombre de usuario no proporcionado en la URL.");
            return;
        }

        setLoading(true);
        setError(null);
        setFeedbackMessage(null);

        const token = getAuthToken();

        let canAccessReviews = false;
        if (token && loggedInUsername) {
            if (loggedInUsername === urlUsername) {
                canAccessReviews = true;
            } else if (userHasRole(token, 'ADMIN')) {
                canAccessReviews = true;
            }
        }

        if (!canAccessReviews) {
            setLoading(false);
            setError("No tienes permiso para ver estas reseñas o no has iniciado sesión.");
            return;
        }

        const requestHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${reviewsByUserUrl}${urlUsername}`, {
                method: 'GET',
                headers: requestHeaders,
            });

            if (!res.ok) {
                if (res.status === 404 || res.status === 204) {
                    setReviews([]);
                    setLoading(false);
                    return;
                }
                throw new Error(`Error al cargar las reseñas: ${res.status} - ${res.statusText}`);
            }

            const data = await res.json();
            setReviews(data.content || []);
        } catch (err: any) {
            setError(err.message || "Error desconocido al cargar las reseñas.");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [urlUsername, reviewsByUserUrl, getAuthToken, loggedInUsername]);

    useEffect(() => {
        fetchUserReviews();
    }, [fetchUserReviews]);

    const handleDeleteReviewButtonClick = (reviewId: string, reviewUserId: string) => {
        if (!loggedInUserId || loggedInUserId !== reviewUserId) {
            setFeedbackMessage({ message: 'No tienes permiso para eliminar esta reseña.', type: 'error' });
            setTimeout(() => setFeedbackMessage(null), 3000);
            return;
        }
        setReviewToDelete({ id: reviewId, userId: reviewUserId });
        setShowConfirmDeleteModal(true);
    };

    const confirmDeleteReview = async () => {
        if (!reviewToDelete) return;

        const { id: reviewId } = reviewToDelete;
        const token = getAuthToken();

        if (!token) {
            setFeedbackMessage({ message: 'Debes iniciar sesión para eliminar una reseña.', type: 'error' });
            setTimeout(() => setFeedbackMessage(null), 3000);
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
            setFeedbackMessage({ message: 'Reseña eliminada con éxito.', type: 'success' });
            setTimeout(() => setFeedbackMessage(null), 3000);

        } catch (err: any) {
            setFeedbackMessage({ message: err.message || 'Error desconocido al eliminar la reseña.', type: 'error' });
            setTimeout(() => setFeedbackMessage(null), 3000);
        } finally {
            setShowConfirmDeleteModal(false);
            setReviewToDelete(null);
        }
    };

    const cancelDeleteReview = () => {
        setShowConfirmDeleteModal(false);
        setReviewToDelete(null);
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <Header />
                <div className={styles.loadingMessage}>Cargando reseñas del usuario {urlUsername}...</div>
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

    return (
        <div className={styles.pageContainer}>
            <Header />

            <main className={styles.mainContent}>
                {feedbackMessage && (
                    <div className={`${styles.feedbackMessage} ${feedbackMessage.type === 'success' ? styles.success : styles.error}`}>
                        {feedbackMessage.message}
                    </div>
                )}

                <h1 className={styles.pageTitle}>Mis Reseñas</h1>

                {reviews.length > 0 ? (
                    <div className={styles.reviewList}>
                        {reviews.map(review => (
                            <div key={review.id} className={styles.reviewCard}>
                                <div className={styles.reviewCardHeader}>
                                    <h3 className={styles.reviewMovieTitle}>
                                        <Link href={`/movie/${encodeURIComponent(review.tituloPelicula)}`}>
                                            {review.tituloPelicula}
                                        </Link>
                                    </h3>
                                    {loggedInUserId && loggedInUserId === review.userId && (
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
                    <p className={styles.noReviews}>Este usuario aún no ha publicado ninguna reseña.</p>
                )}
            </main>

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

            <footer className={styles.footer}>
                CinematicMultiverse<br/>
                Tu portal para descubrir un multiverso de películas.<br/>
                &copy; {new Date().getFullYear()} CinematicMultiverse Inc.
            </footer>
        </div>
    );
}