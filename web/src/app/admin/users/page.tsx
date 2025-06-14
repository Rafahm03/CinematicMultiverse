// app/admin/users/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userHasRole } from '../../../../utils/jwt';
import styles from './AdminUsers.module.css';
import { API_BASE_URL } from '../../../../config';
import Header from '../../components/Header/Header';

interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    nombre?: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        verifyPassword: '',
        roles: '',
        nombre: '',
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

    const showMessage = useCallback((message: string, isErrorMessage: boolean = false) => {
        setStatusMessage(message);
        setIsError(isErrorMessage);
        setTimeout(() => {
            setStatusMessage(null);
        }, 5000);
    }, []);

    // Función para obtener usuarios
    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/user/?page=0&size=100&sortBy=username&direction=asc`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Sesión expirada o no autorizada. Por favor, inicie sesión de nuevo.', true);
                    router.push('/login');
                    return;
                }
                throw new Error('Fallo al obtener los usuarios');
            }
            const data = await response.json();
            const processedUsers: User[] = data.content.map((user: any) => ({
                ...user,
                roles: user.roles || []
            }));
            setUsers(processedUsers);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            showMessage('Error al cargar los usuarios.', true);
        }
    }, [router, showMessage]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (!userHasRole(token, 'ADMIN')) {
                router.push('/');
            } else {
                fetchUsers();
            }
            setLoading(false);
        }
    }, [router, fetchUsers]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password' && !editingUser) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(value) && value.length > 0) {
                setPasswordError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.');
            } else {
                setPasswordError(null);
            }
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            showMessage('No estás autenticado. Por favor, inicia sesión.', true);
            router.push('/login');
            return;
        }

        if (formData.password !== formData.verifyPassword) {
            showMessage('Las contraseñas no coinciden.', true);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setPasswordError('La contraseña no cumple con los requisitos de seguridad. Debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.');
            return;
        }


        try {
            const userData = {
                username: formData.username,
                password: formData.password,
                verifyPassword: formData.verifyPassword,
                email: formData.email,
                verifyEmail: formData.email,
                nombre: formData.nombre,
                roles: formData.roles.split(',').map(r => r.trim().toUpperCase()).filter(r => r),
            };

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('No autorizado para crear usuarios. Por favor, inicia sesión con una cuenta de administrador.', true);
                    router.push('/login');
                    return;
                }
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.invalid_params && errorJson.invalid_params.length > 0) {
                        showMessage(`Error al crear el usuario: ${errorJson.invalid_params[0].message}`, true);
                    } else {
                        showMessage(`Error al crear el usuario: ${errorJson.detail || errorText}`, true);
                    }
                } catch (jsonError) {
                    showMessage(`Error al crear el usuario: ${errorText}`, true);
                }
                throw new Error(`Fallo al crear el usuario: ${errorText}`);
            }

            showMessage('Usuario creado con éxito.', false);
            setIsCreating(false);
            setFormData({ username: '', email: '', password: '', verifyPassword: '', roles: '', nombre: '' });
            setPasswordError(null);
            fetchUsers();
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            if (!(error instanceof Error && error.message.startsWith('Fallo al crear el usuario:'))) {
                showMessage(`Error al crear el usuario: ${error instanceof Error ? error.message : String(error)}`, true);
            }
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            verifyPassword: '',
            roles: user.roles ? user.roles.join(', ') : '',
            nombre: user.nombre || '',
        });
        setPasswordError(null);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token || !editingUser) {
            showMessage('No estás autenticado o no hay usuario seleccionado para editar. Por favor, inicia sesión.', true);
            router.push('/login');
            return;
        }

        try {
            const userData = {
                username: formData.username,
                email: formData.email,
                nombre: formData.nombre,
                roles: formData.roles.split(',').map(r => r.trim().toUpperCase()).filter(r => r),
            };

            const response = await fetch(`${API_BASE_URL}/user/admin/${editingUser.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Sesión expirada o no autorizado. Por favor, inicie sesión de nuevo.', true);
                    router.push('/login');
                    return;
                }
                const errorText = await response.text();
                showMessage(`Fallo al actualizar el usuario: ${errorText}`, true);
                throw new Error(`Fallo al actualizar el usuario: ${errorText}`);
            }

            showMessage('Usuario actualizado con éxito.', false);
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', verifyPassword: '', roles: '', nombre: '' });
            setPasswordError(null);
            fetchUsers();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            if (!statusMessage) {
                showMessage(`Error al actualizar el usuario: ${error instanceof Error ? error.message : String(error)}`, true);
            }
        }
    };

    const executeDeleteUser = async (username: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            showMessage('No estás autenticado. Por favor, inicia sesión.', true);
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user/${username}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('No autorizado para eliminar usuarios. Por favor, inicia sesión con una cuenta de administrador.', true);
                    router.push('/login');
                    return;
                }
                const errorText = await response.text();
                showMessage(`Fallo al eliminar el usuario: ${errorText}`, true);
                throw new Error(`Fallo al eliminar el usuario: ${errorText}`);
            }

            showMessage('Usuario eliminado con éxito.', false);
            fetchUsers();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            if (!statusMessage) {
                showMessage(`Error al eliminar el usuario: ${error instanceof Error ? error.message : String(error)}`, true);
            }
        }
    };

    // Función que activa el modal de confirmación (reemplaza window.confirm)
    const handleDeleteUserClick = (username: string) => {
        setConfirmMessage(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`);
        setConfirmAction(() => () => executeDeleteUser(username)); // Usamos un closure para pasar el username
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmMessage('');
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmMessage('');
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <h1 className={styles.title}>Gestión de Usuarios</h1>
                    <div className={styles.loading}>Cargando...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                {statusMessage && (
                    <div className={`${styles.statusMessage} ${isError ? styles.errorMessage : styles.successMessage}`}>
                        {statusMessage}
                    </div>
                )}

                <div className={styles.topControls}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        Volver Atrás
                    </button>
                    <h1 className={styles.title}>Gestión de Usuarios</h1>
                    <button className={styles.addButton} onClick={() => { setIsCreating(true); setEditingUser(null); setFormData({ username: '', email: '', password: '', verifyPassword: '', roles: '', nombre: '' }); setPasswordError(null); }}>
                        Crear Nuevo Usuario
                    </button>
                </div>

                {(isCreating || editingUser) && (
                    <div className={styles.formContainer}>
                        <h2>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Nombre de Usuario:</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="nombre">Nombre Completo:</label>
                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleFormChange} />
                            </div>
                            {!editingUser && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="password">Contraseña:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleFormChange}
                                            required
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                                            title="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número."
                                        />
                                        {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="verifyPassword">Repetir Contraseña:</label>
                                        <input type="password" id="verifyPassword" name="verifyPassword" value={formData.verifyPassword} onChange={handleFormChange} required />
                                    </div>
                                </>
                            )}
                            <div className={styles.formGroup}>
                                <label htmlFor="roles">Roles (separados por comas, ej: USER,ADMIN):</label>
                                <input type="text" id="roles" name="roles" value={formData.roles} onChange={handleFormChange} placeholder="USER, ADMIN" />
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.submitButton}>
                                    {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                                </button>
                                <button type="button" className={styles.cancelButton} onClick={() => { setIsCreating(false); setEditingUser(null); setFormData({ username: '', email: '', password: '', verifyPassword: '', roles: '', nombre: '' }); setPasswordError(null); }}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className={styles.userList}>
                    {users.length > 0 ? (
                        <table className={styles.userTable}>
                            <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles && user.roles.join(', ')}</td>
                                    <td>
                                        <button onClick={() => handleEditUser(user)} className={styles.editButton}>Editar</button>
                                        <button onClick={() => handleDeleteUserClick(user.username)} className={styles.deleteButton}>Eliminar</button> {/* CAMBIO AQUÍ */}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay usuarios disponibles.</p>
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Confirmar Acción</h3>
                        <p>{confirmMessage}</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirm} className={styles.confirmButton}>Confirmar</button>
                            <button onClick={handleCancelConfirm} className={styles.cancelButton}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
