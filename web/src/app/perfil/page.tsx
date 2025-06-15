// app/perfil/page.tsx (o el path que uses, asumo que es perfil.tsx)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header/Header';
import styles from './perfil.module.css';
import { API_BASE_URL } from '../../../config'; // Asegúrate de que esta ruta sea correcta o define API_BASE_URL aquí

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
            // Usar API_BASE_URL para que se beneficie del rewrite de Next.js
            const res = await fetch(`${API_BASE_URL}/me`, {
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
                const errorText = await res.text();
                let errorMessage = `Error al cargar el perfil: ${res.status} - ${res.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.detail || errorJson.message || errorText;
                } catch (e) {
                    // No era un JSON, se usa el texto
                }
                throw new Error(errorMessage);
            }

            // Antes de intentar parsear como JSON, verifica el Content-Type y lee como texto para depurar
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data: Usuario = await res.json(); // Esto solo se llama si es JSON
                setUsuario(data);
                setNewUsername(data.username);
                setNewNombre(data.nombre);
            } else {
                const textResponse = await res.text();
                console.error("Received non-JSON response for /me:", textResponse);
                throw new Error("Respuesta inesperada del servidor al cargar el perfil. No es JSON.");
            }

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
            // Usar API_BASE_URL para que se beneficie del rewrite de Next.js
            const res = await fetch(`${API_BASE_URL}/user/perfil`, {
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
                const errorText = await res.text();
                let errorMessage = `Error al actualizar el perfil: ${res.status} - ${res.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.detail || errorJson.message || errorText;
                } catch (e) {
                    // Si no es JSON, usa el texto bruto
                }
                throw new Error(errorMessage);
            }

            // --- PASO DE DEPURACIÓN CRÍTICO ---
            // Primero, lee la respuesta como texto para ver su contenido EXACTO.
            const responseText = await res.text();
            console.log("Raw response text from PUT /user/perfil:", responseText);

            let updatedUser: Usuario;
            // Luego, intenta parsear ese texto como JSON
            try {
                updatedUser = JSON.parse(responseText);
            } catch (jsonParseError: any) {
                // Si falla el parseo, muestra un error detallado con el texto problemático
                console.error("JSON Parse Error for /user/perfil:", jsonParseError);
                console.error("Problematic JSON string:", responseText); // Esto te mostrará el JSON exacto recibido
                throw new Error(`Error de formato de datos al actualizar el perfil. Recibido: '${responseText.substring(0, 200)}'`);
            }
            // --- FIN PASO DE DEPURACIÓN CRÍTICO ---

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
