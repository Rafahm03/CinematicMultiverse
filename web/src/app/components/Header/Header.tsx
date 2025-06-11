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
                    <button onClick={handleLogout} className={styles.logoutButton} title="Cerrar sesión">
                        👋
                    </button>
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