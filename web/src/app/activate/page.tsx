'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './activate.module.css';

export default function ActivatePage() {
    const router = useRouter();
    const [tokenInput, setTokenInput] = useState('');
    const [activationStatus, setActivationStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Introduce el token de activación recibido en tu correo electrónico.');

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setMessage('Activando tu cuenta...');
        setActivationStatus('idle');

        if (!tokenInput.trim()) {
            setLoading(false);
            setActivationStatus('error');
            setMessage('El token de activación no puede estar vacío!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/activate/account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: tokenInput }),
            });

            if (response.ok) {
                setActivationStatus('success');
                setMessage('¡Tu cuenta ha sido activada exitosamente! Ahora puedes iniciar sesión.');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                const errorData = await response.json();
                setActivationStatus('error');
                setMessage(errorData.detail || errorData.message || 'Error al activar la cuenta. El token puede ser inválido o haber expirado.');
            }
        } catch (err: any) {
            console.error('Error durante la petición de activación:', err);
            setActivationStatus('error');
            setMessage('No se pudo conectar con el servidor para activar la cuenta. Intenta de nuevo más tarde.');
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
                <h1 className={styles.activationTitle}>Activación de Cuenta</h1>

                <div className={styles.statusContainer}>
                    {message && (
                        <p className={
                            loading ? styles.loadingMessage :
                                activationStatus === 'success' ? styles.successMessage :
                                    activationStatus === 'error' ? styles.errorMessage :
                                        styles.infoMessage
                        }>
                            {message}
                        </p>
                    )}

                    {activationStatus !== 'success' && !loading && (
                        <form onSubmit={handleActivate} className={styles.tokenForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="token">Token de Activación:</label>
                                <input
                                    type="text"
                                    id="token"
                                    value={tokenInput}
                                    onChange={(e) => setTokenInput(e.target.value)}
                                    required
                                    className={styles.tokenInput}
                                    placeholder="Pega tu token aquí..."
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className={styles.activateButton}
                                disabled={loading}
                            >
                                {loading ? 'Activando...' : 'Activar Cuenta'}
                            </button>
                        </form>
                    )}
                </div>

                {!loading && (
                    <p className={styles.redirectText}>
                        Volver al <Link href="/login" className={styles.loginLink}>Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
}