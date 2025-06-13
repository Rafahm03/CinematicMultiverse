// perfil.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header/Header';
import styles from './perfil.module.css';

type Usuario = {
    id: string;
    username: string;
    nombre: string;
    email: string;
};

export default function Perfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newNombre, setNewNombre] = useState('');

    const router = useRouter();

    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                localStorage.removeItem('accessToken');
                router.push('/login');
                return;
            }

            if (!res.ok) {
                throw new Error(`Error al cargar el perfil: ${res.status} - ${res.statusText}`);
            }

            const data: Usuario = await res.json();
            setUsuario(data);
            setNewUsername(data.username);
            setNewNombre(data.nombre);
        } catch (err: any) {
            console.error("Error fetching user profile:", err);
            setError(err.message || "Error desconocido al cargar el perfil.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEditProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/user/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: newUsername,
                    nombre: newNombre,
                }),
            });

            if (res.status === 401) {
                localStorage.removeItem('accessToken');
                router.push('/login');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Error al actualizar el perfil: ${errorData.message || res.statusText}`);
            }

            const updatedUser: Usuario = await res.json();
            setUsuario(updatedUser);
            setIsEditing(false);
        } catch (err: any) {
            console.error("Error updating user profile:", err);
            setError(err.message || "Error desconocido al actualizar el perfil.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>Cargando perfil...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>
                    ⚠️ Error:<br /> {error}
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className={styles.appContainer}>
                <Header />
                <div className={styles.centeredMessage}>No se pudo cargar el perfil del usuario.</div>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            <Header />
            <main className={styles.mainContent}>
                <h1 className={styles.profileTitle}>Mi Perfil</h1>

                {!isEditing ? (
                    <div className={styles.profileDetails}>
                        <p><strong>Nombre de usuario:</strong> {usuario.username}</p>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Email:</strong> {usuario.email}</p>
                        <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                            Editar Perfil
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleEditProfile} className={styles.editForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Nombre de usuario:</label>
                            <input
                                type="text"
                                id="username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className={styles.formInput}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                value={newNombre}
                                onChange={(e) => setNewNombre(e.target.value)}
                                className={styles.formInput}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email:</label>
                            <p className={styles.nonEditableEmail}>{usuario.email}</p>
                        </div>
                        <div className={styles.formActions}>
                            <button type="submit" className={styles.saveButton} disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton} disabled={loading}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}