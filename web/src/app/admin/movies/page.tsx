// app/admin/movies/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userHasRole } from '../../../../utils/jwt';
import styles from './AdminMovies.module.css';
import { API_BASE_URL } from '../../../../config';
import Header from '../../components/Header/Header';

interface Movie {
    id: string;
    titulo: string;
    sinopsis: string;
    puntuacion: number;
    imagen: string;
    duracion: number;
    anio: number;
    generos: string[];
}

export default function AdminMoviesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [formData, setFormData] = useState({
        titulo: '',
        sinopsis: '',
        puntuacion: '',
        imagen: '',
        duracion: '',
        anio: '',
        generos: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

    const showMessage = useCallback((message: string, isErrorMessage: boolean = false) => {
        setStatusMessage(message);
        setIsError(isErrorMessage);
        setTimeout(() => {
            setStatusMessage(null);
        }, 5000);
    }, []);

    // Función para obtener películas
    const fetchMovies = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/pelicula/?page=0&size=100&sortBy=titulo&direction=asc`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.', true);
                    router.push('/login');
                    return;
                }
                throw new Error('Fallo al obtener las películas');
            }
            const data = await response.json();
            setMovies(data.content);
        } catch (error) {
            console.error('Error al obtener películas:', error);
            showMessage('Error al cargar las películas.', true);
        }
    }, [router, showMessage]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (!userHasRole(token, 'ADMIN')) {
                router.push('/');
            } else {
                fetchMovies();
            }
            setLoading(false);
        }
    }, [router, fetchMovies]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleCreateMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            showMessage('No estás autenticado. Por favor, inicia sesión.', true);
            router.push('/login');
            return;
        }

        try {
            const movieData = {
                titulo: formData.titulo.trim(),
                sinopsis: formData.sinopsis.trim(),
                puntuacion: formData.puntuacion ? parseFloat(formData.puntuacion) : 0,
                imagen: formData.imagen.trim() || null,
                duracion: formData.duracion ? parseInt(formData.duracion) : 0,
                anio: formData.anio ? parseInt(formData.anio) : 0,
                generos: formData.generos.split(',').map(g => g.trim().toUpperCase()).filter(g => g),
            };

            const bodyPeliculaBlob = new Blob([JSON.stringify(movieData)], { type: 'application/json' });

            const form = new FormData();
            form.append('editPeliculaCmd', bodyPeliculaBlob, 'bodypelicula.json');

            if (file) {
                form.append('file', file);
            } else {
                form.append('file', new Blob([""], { type: "application/octet-stream" }), "");
            }

            const response = await fetch(`${API_BASE_URL}/pelicula/guardar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('No autorizado para crear películas. Por favor, inicia sesión con una cuenta de administrador.', true);
                    router.push('/login');
                    return;
                }
                const errorText = await response.text();
                showMessage(`Error al crear la película: ${errorText}`, true);
                throw new Error(`Fallo al crear la película: ${errorText}`);
            }

            showMessage('Película creada con éxito.', false);
            setIsCreating(false);
            setFormData({ titulo: '', sinopsis: '', puntuacion: '', imagen: '', duracion: '', anio: '', generos: '' });
            setFile(null);
            fetchMovies();
        } catch (error) {
            console.error('Error al crear la película:', error);
            if (!statusMessage) {
                showMessage(`Error al crear la película: ${error instanceof Error ? error.message : String(error)}`, true);
            }
        }
    };

    const handleEditMovie = (movie: Movie) => {
        setEditingMovie(movie);
        setFormData({
            titulo: movie.titulo,
            sinopsis: movie.sinopsis,
            puntuacion: movie.puntuacion.toString(),
            imagen: movie.imagen,
            duracion: movie.duracion.toString(),
            anio: movie.anio.toString(),
            generos: movie.generos.join(', '),
        });
        setFile(null);
    };

    const handleUpdateMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        if (!token || !editingMovie) {
            showMessage('No estás autenticado o no hay película seleccionada para editar. Por favor, inicia sesión.', true);
            router.push('/login');
            return;
        }

        try {
            const movieData = {
                titulo: formData.titulo.trim(),
                sinopsis: formData.sinopsis.trim(),
                puntuacion: formData.puntuacion ? parseFloat(formData.puntuacion) : 0,
                imagen: formData.imagen.trim() || null,
                duracion: formData.duracion ? parseInt(formData.duracion) : 0,
                anio: formData.anio ? parseInt(formData.anio) : 0,
                generos: formData.generos.split(',').map(g => g.trim().toUpperCase()).filter(g => g),
            };

            const bodyPeliculaBlob = new Blob([JSON.stringify(movieData)], { type: 'application/json' });

            const form = new FormData();
            form.append('editPeliculaCmd', bodyPeliculaBlob, 'bodypelicula.json');

            if (file) {
                form.append('file', file);
            } else {
                form.append('file', new Blob([""], { type: "application/octet-stream" }), "");
            }

            const response = await fetch(`${API_BASE_URL}/pelicula/${editingMovie.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Sesión expirada o no autorizado. Por favor, inicie sesión de nuevo.', true);
                    router.push('/login');
                    return;
                }
                const errorText = await response.text();
                showMessage(`Fallo al actualizar la película: ${errorText}`, true);
                throw new Error(`Fallo al actualizar la película: ${errorText}`);
            }

            showMessage('Película actualizada con éxito.', false);
            setEditingMovie(null);
            setFormData({ titulo: '', sinopsis: '', puntuacion: '', imagen: '', duracion: '', anio: '', generos: '' });
            setFile(null);
            fetchMovies();
        } catch (error) {
            console.error('Error al actualizar la película:', error);
            if (!statusMessage) {
                showMessage(`Error al actualizar la película: ${error instanceof Error ? error.message : String(error)}`, true);
            }
        }
    };

    const executeDeleteMovie = async (titulo: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            showMessage('No estás autenticado. Por favor, inicia sesión.', true);
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pelicula/${titulo}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('No autorizado para eliminar películas. Por favor, inicia sesión con una cuenta de administrador.', true);
                    router.push('/login');
                    return;
                }
                const errorText = await response.text();
                showMessage(`Fallo al eliminar la película: ${errorText}`, true);
                throw new Error(`Fallo al eliminar la película: ${errorText}`);
            }

            showMessage('Película eliminada con éxito.', false);
            fetchMovies();
        } catch (error) {
            console.error('Error al eliminar la película:', error);
            if (!statusMessage) {
                showMessage(`Error al eliminar la película: ${error instanceof Error ? error.message : String(error)}`, true);
            }
        }
    };

    const handleDeleteMovieClick = (titulo: string) => {
        setConfirmMessage(`¿Estás seguro de que quieres eliminar la película "${titulo}"?`);
        setConfirmAction(() => () => executeDeleteMovie(titulo));
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmMessage('');
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmMessage('');
    };


    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <h1 className={styles.title}>Gestión de Películas</h1>
                    <div className={styles.loading}>Cargando...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                {statusMessage && (
                    <div className={`${styles.statusMessage} ${isError ? styles.errorMessage : styles.successMessage}`}>
                        {statusMessage}
                    </div>
                )}

                <div className={styles.topControls}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        Volver Atrás
                    </button>
                    <h1 className={styles.title}>Gestión de Películas</h1>
                    <button className={styles.addButton} onClick={() => { setIsCreating(true); setEditingMovie(null); setFormData({ titulo: '', sinopsis: '', puntuacion: '', imagen: '', duracion: '', anio: '', generos: '' }); setFile(null); }}>
                        Crear Nueva Película
                    </button>
                </div>

                {(isCreating || editingMovie) && (
                    <div className={styles.formContainer}>
                        <h2>{editingMovie ? 'Editar Película' : 'Crear Nueva Película'}</h2>
                        <form onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="titulo">Título:</label>
                                <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="sinopsis">Sinopsis:</label>
                                <textarea id="sinopsis" name="sinopsis" value={formData.sinopsis} onChange={handleFormChange} required></textarea>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="puntuacion">Puntuación:</label>
                                <input type="number" id="puntuacion" name="puntuacion" value={formData.puntuacion} onChange={handleFormChange} step="0.1" min="0" max="10" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="imagen">URL de la Imagen:</label>
                                <input type="text" id="imagen" name="imagen" value={formData.imagen} onChange={handleFormChange} placeholder="URL de la imagen (si no subes un archivo)" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="file">Subir Nueva Imagen (Opcional):</label>
                                <input type="file" id="file" name="file" onChange={handleFileChange} accept="image/*" />
                                {file && <p className={styles.fileSelected}>Archivo seleccionado: {file.name}</p>}
                                {editingMovie?.imagen && !file && (
                                    <div className={styles.currentImagePreview}>
                                        <p>Imagen actual:</p>
                                        <img src={editingMovie.imagen} alt="Imagen actual" className={styles.currentImage} />
                                    </div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="duracion">Duración (minutos):</label>
                                <input type="number" id="duracion" name="duracion" value={formData.duracion} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="anio">Año:</label>
                                <input type="number" id="anio" name="anio" value={formData.anio} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="generos">Géneros (separados por comas):</label>
                                <input type="text" id="generos" name="generos" value={formData.generos} onChange={handleFormChange} placeholder="ACCION, DRAMA, COMEDIA" />
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.submitButton}>
                                    {editingMovie ? 'Actualizar Película' : 'Crear Película'}
                                </button>
                                <button type="button" className={styles.cancelButton} onClick={() => { setIsCreating(false); setEditingMovie(null); setFormData({ titulo: '', sinopsis: '', puntuacion: '', imagen: '', duracion: '', anio: '', generos: '' }); setFile(null); }}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className={styles.movieList}>
                    {movies.length > 0 ? (
                        movies.map(movie => (
                            <div key={movie.id} className={styles.movieCard}>
                                <img src={movie.imagen || '/placeholder-movie.jpg'} alt={movie.titulo} className={styles.movieImage} />
                                <div className={styles.movieInfo}>
                                    <h3>{movie.titulo}</h3>
                                    <p>{movie.sinopsis.substring(0, 100)}...</p>
                                    <p>Puntuación: {movie.puntuacion}</p>
                                    <p>Duración: {movie.duracion} min</p>
                                    <p>Año: {movie.anio}</p>
                                    <p>Géneros: {movie.generos.join(', ')}</p>
                                    <div className={styles.movieActions}>
                                        <button onClick={() => handleEditMovie(movie)} className={styles.editButton}>Editar</button>
                                        <button onClick={() => handleDeleteMovieClick(movie.titulo)} className={styles.deleteButton}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay películas disponibles.</p>
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Confirmar Acción</h3>
                        <p>{confirmMessage}</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirm} className={styles.confirmButton}>Confirmar</button>
                            <button onClick={handleCancelConfirm} className={styles.cancelButton}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}