// Header.tsx
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
            const token = localStorage.getItem('accessToken');
            setIsLoggedIn(!!token);
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
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
                        <Link href="/perfil" className={styles.profileLink} title="Mi Page">
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