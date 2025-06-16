// Header.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { userHasRole, decodeToken } from '../../../../utils/jwt';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    const checkAuthStatus = useCallback(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');

            console.log('Header: Token leído de localStorage:', token ? 'Token presente' : 'Token ausente');

            setIsLoggedIn(!!token);
            if (token) {
                const decodedToken = decodeToken(token);

                const adminStatus = userHasRole(token, 'ADMIN');

                const usernameFromToken = decodedToken ? decodedToken.sub : null;

                console.log('Header: ¿Es administrador?', adminStatus);
                console.log('Header: Nombre de usuario:', usernameFromToken);

                setIsAdmin(adminStatus);
                setUsername(usernameFromToken);
            } else {
                setIsAdmin(false);
                setUsername(null);
            }
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();

        const handleStorageChange = () => {
            console.log('Header: Evento de storage detectado. Re-verificando autenticación.');
            checkAuthStatus();
        };

        const handleWindowFocus = () => {
            console.log('Header: Ventana recuperó el foco. Re-verificando autenticación.');
            checkAuthStatus();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('focus', handleWindowFocus);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('focus', handleWindowFocus);
            }
        };
    }, [checkAuthStatus]);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUsername(null);
            router.push('/');
            checkAuthStatus();
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
                        {isAdmin && (
                            <Link href="/admin" className={styles.adminLink} title="Modo Administrador">
                                Administración
                            </Link>
                        )}
                        {username && (
                            <Link href={`/my-reviews/${username}`} className={styles.reviewsLink} title="Mis Reseñas">
                                Mis Reseñas
                            </Link>
                        )}
                        <Link href="/perfil" className={styles.profileLink} title="Mi Perfil">
                            <svg className={styles.profileIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                        </Link>
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