// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userHasRole } from '../../../utils/jwt';
import styles from './AdminHome.module.css';
import Header from '../components/Header/Header';

export default function AdminHomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (!userHasRole(token, 'ADMIN')) {
                router.push('/');
            }
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <div className={styles.loading}>Cargando...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Panel de Administración</h1>
                <p className={styles.description}>
                    Bienvenido al modo administrador. Aquí puedes gestionar las películas y los usuarios de la plataforma.
                </p>

                <div className={styles.sections}>
                    <Link href="/admin/movies" className={styles.sectionButton}>
                        Gestión de Películas
                    </Link>
                    <Link href="/admin/users" className={styles.sectionButton}>
                        Gestión de Usuarios
                    </Link>
                </div>
            </div>
        </>
    );
}
