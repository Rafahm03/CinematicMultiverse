'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Asegúrate de que usamos 'accessToken' aquí, igual que en el login
            const token = localStorage.getItem('accessToken');
            setIsLoggedIn(!!token);
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken'); // Asegúrate de que usamos 'accessToken' para remover
            setIsLoggedIn(false);
            router.push('/');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href="/" className={styles.logoLink}>
                    CinematicMultiverse
                </Link>
            </div>
            <div className={styles.authLinksContainer}>
                {isLoggedIn ? (
                    <>
                        {/* Nuevo Link e icono de corazón para Favoritos */}
                        <Link href="/favoritos" className={styles.favoritesLink} title="Mis Favoritos">
                            <svg className={styles.heartIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path fillRule="evenodd" d="M9.627 19.114L8.47 18.005c-4.057-3.618-7.44-6.627-7.44-10.347C1.03 3.71 4.093 1 8 1c1.745 0 3.466.768 4.793 2.057L10 5.25l2.793 2.293C15.907 5.068 18.97 7.71 18.97 10.658c0 3.72-3.383 6.73-7.44 10.347L9.627 19.114z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <button onClick={handleLogout} className={styles.logoutButton} title="Cerrar sesión">
                            👋
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className={styles.authLink}>Login</Link>
                        <span className={styles.authSeparator}>|</span>
                        <Link href="/registro" className={styles.authLink}>Registrarse</Link>
                    </>
                )}
            </div>
        </header>
    );
}