'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './registro.module.css';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [email, setEmail] = useState('');
    const [verifyEmail, setVerifyEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const validatePassword = (pass: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/;
        if (!passwordRegex.test(pass)) {
            return 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.';
        }
        return null;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);
        setFieldErrors({});
        setSuccess(null);
        setLoading(true);

        const newFieldErrors: { [key: string]: string } = {};

        if (!username.trim()) newFieldErrors.username = 'El nombre de usuario es obligatorio.';
        if (!nombre.trim()) newFieldErrors.nombre = 'El nombre es obligatorio.';
        if (!email.trim()) newFieldErrors.email = 'El email es obligatorio.';
        if (!verifyEmail.trim()) newFieldErrors.verifyEmail = 'Debes confirmar el email.';
        if (!password.trim()) newFieldErrors.password = 'La contraseña es obligatoria.';
        if (!verifyPassword.trim()) newFieldErrors.verifyPassword = 'Debes confirmar la contraseña.';

        if (password && verifyPassword && password !== verifyPassword) {
            newFieldErrors.verifyPassword = 'Las contraseñas no coinciden.';
            newFieldErrors.password = 'Las contraseñas no coinciden.';
        }

        if (email && verifyEmail && email !== verifyEmail) {
            newFieldErrors.verifyEmail = 'Los correos electrónicos no coinciden.';
            newFieldErrors.email = 'Los correos electrónicos no coinciden.';
        }

        const passwordStrengthError = validatePassword(password);
        if (passwordStrengthError) {
            newFieldErrors.password = passwordStrengthError;
        }

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            setError('Por favor, corrige los errores en el formulario.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    verifyPassword,
                    email,
                    verifyEmail,
                    nombre,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData && errorData['invalid-params'] && Array.isArray(errorData['invalid-params'])) {
                    const backendFieldErrors: { [key: string]: string } = {};
                    errorData['invalid-params'].forEach((param: any) => {
                        if (param.field) {
                            backendFieldErrors[param.field] = param.message || `Error en el campo ${param.field}.`;
                        }
                    });
                    setFieldErrors(backendFieldErrors);
                    setError(errorData.detail || 'Error de validación del servidor.');
                } else {
                    setError(errorData.message || 'Error al registrar el usuario. Intenta de nuevo.');
                }
                setLoading(false);
                return;
            }

            router.push('/activate');

        } catch (err: any) {
            console.error('Error durante la petición de registro:', err);
            setError('No se pudo conectar con el servidor. Verifica tu conexión o intenta de nuevo más tarde.');
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
                <h1 className={styles.registerTitle}>REGISTRO</h1>
                <form onSubmit={handleRegister} className={styles.registerForm}>
                    {error && <p className={styles.registerErrorMessage}>{error}</p>}

                    <div className={styles.formGroup}>
                        <label htmlFor="username">Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={`${styles.registerInput} ${fieldErrors.username ? styles.inputError : ''}`}
                            disabled={loading}
                        />
                        {fieldErrors.username && <small className={styles.fieldErrorMessage}>{fieldErrors.username}</small>}
                        <small className={styles.fieldHint}>Debe ser un nombre de usuario único.</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`${styles.registerInput} ${fieldErrors.password ? styles.inputError : ''}`}
                            disabled={loading}
                        />
                        {fieldErrors.password && <small className={styles.fieldErrorMessage}>{fieldErrors.password}</small>}
                        <small className={styles.fieldHint}>Mín. 8 caracteres, incluyendo mayúscula, minúscula y número.</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="verifyPassword">Verificar Contraseña:</label>
                        <input
                            type="password"
                            id="verifyPassword"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            required
                            className={`${styles.registerInput} ${fieldErrors.verifyPassword ? styles.inputError : ''}`}
                            disabled={loading}
                        />
                        {fieldErrors.verifyPassword && <small className={styles.fieldErrorMessage}>{fieldErrors.verifyPassword}</small>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`${styles.registerInput} ${fieldErrors.email ? styles.inputError : ''}`}
                            disabled={loading}
                        />
                        {fieldErrors.email && <small className={styles.fieldErrorMessage}>{fieldErrors.email}</small>}
                        <small className={styles.fieldHint}>Introduce un email válido.</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="verifyEmail">Verificar Email:</label>
                        <input
                            type="email"
                            id="verifyEmail"
                            value={verifyEmail}
                            onChange={(e) => setVerifyEmail(e.target.value)}
                            required
                            className={`${styles.registerInput} ${fieldErrors.verifyEmail ? styles.inputError : ''}`}
                            disabled={loading}
                        />
                        {fieldErrors.verifyEmail && <small className={styles.fieldErrorMessage}>{fieldErrors.verifyEmail}</small>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className={`${styles.registerInput} ${fieldErrors.nombre ? styles.inputError : ''}`}
                            disabled={loading}
                        />
                        {fieldErrors.nombre && <small className={styles.fieldErrorMessage}>{fieldErrors.nombre}</small>}
                        <small className={styles.fieldHint}>Tu nombre completo o preferido.</small>
                    </div>

                    <button
                        type="submit"
                        className={styles.registerButton}
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <p className={styles.loginLinkText}>
                    ¿Ya tienes cuenta? <Link href="/login" className={styles.loginLink}>Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
}