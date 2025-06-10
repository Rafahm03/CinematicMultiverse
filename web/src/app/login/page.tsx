'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Error al iniciar sesión. Verifica tus credenciales.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            const token = data.token;

            if (token) {
                localStorage.setItem('accessToken', token);
                console.log('Login exitoso. Token almacenado:', token);

                router.push('/');
            } else {
                setError('Login exitoso pero no se recibió el token de autenticación.');
            }

        } catch (err: any) {
            console.error('Error durante la petición de login:', err);
            setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.leftSide}></div>
            <div className={styles.rightSide}>
                <header className={styles.header}>
                    <div className={styles.logo}>CinematicMultiverse</div>
                </header>
                <h1 className={styles.loginTitle}>LOGIN</h1>
                <form onSubmit={handleLogin} className={styles.loginForm}>
                    {error && <p className={styles.loginErrorMessage}>{error}</p>}

                    <div className={styles.formGroup}>
                        <label htmlFor="username">Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={styles.loginInput}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.loginInput}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                </form>
                <p className={styles.registerLinkText}>
                    ¿No tienes cuenta? <Link href="/register" className={styles.registerLink}>Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );

}