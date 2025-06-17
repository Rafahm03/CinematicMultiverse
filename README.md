# 🎬 CinematicMultiverse 🎬 - Plataforma Web de Películas :rocket:

CinematicMultiverse es una **plataforma web completa** diseñada para los amantes del cine, que combina un potente **backend (API REST)** con un **frontend dinámico (Next.js con TypeScript)**. Permite a los usuarios registrarse, explorar películas, dejar reseñas, marcar favoritos y mucho más. También incluye un robusto panel de administración para la gestión integral de usuarios y contenido cinematográfico.

---

## Arquitectura del Proyecto

Este proyecto se compone de dos partes principales que trabajan en conjunto:

1.  **Backend (API REST):**
    * Desarrollado en **Java con Spring Boot**.
    * Proporciona todos los **endpoints de la API** necesarios para la gestión de usuarios, películas, reseñas y favoritos.
    * Gestiona la seguridad (JWT), la autenticación y la persistencia de datos.

2.  **Frontend (Aplicación Web):**
    * Construido con **Next.js (React) y TypeScript (TSX)**.
    * Ofrece una **interfaz de usuario intuitiva** que consume la API del backend para interactuar con la plataforma.
    * Proporciona una experiencia de navegación y gestión de contenido fluida.

---

## Roles de Usuario

CinematicMultiverse define dos roles principales con diferentes niveles de acceso y permisos:

### 1. User (Usuario Estándar) 👤

Los usuarios estándar tienen acceso a las siguientes funcionalidades:

* **Autenticación:**
    * **Registro de cuenta**: Creación de una cuenta con verificación por correo electrónico (mediante un token de activación).
    * **Inicio de sesión**: Acceso seguro a la plataforma con usuario y contraseña.
    * **Gestión de tokens**: Uso de tokens de refresco para mantener la sesión activa sin necesidad de volver a iniciar sesión.
* **Gestión de Perfil:** Edición y actualización de sus datos personales.
* **Exploración de Películas:** Búsqueda de películas por título y visualización de sus detalles completos.
* **Favoritos:**
    * Añadir películas a su lista personal de favoritos.
    * Ver y gestionar su lista de películas favoritas.
    * Eliminar películas de favoritos.
* **Reseñas:**
    * Crear nuevas reseñas para cualquier película.
    * Editar o eliminar sus propias reseñas existentes.
    * Visualizar las reseñas de otros usuarios.

### 2. Admin (Administrador) 🔑

El rol de administrador incluye todas las funcionalidades de un usuario estándar, además de capacidades adicionales para la gestión total de la plataforma:

* **Gestión de Usuarios:**
    * Listar y visualizar todos los usuarios registrados.
    * Buscar usuarios específicos por su nombre de usuario.
    * Eliminar cuentas de usuario.
    * Editar perfiles de usuario, incluyendo la capacidad de cambiar su rol (de `User` a `Admin` o viceversa).
* **Gestión de Películas:**
    * **Crear nuevas películas**: Añadir películas a la base de datos con todos sus detalles (título, sinopsis, puntuación, duración, año, géneros) y subir la imagen de portada.
    * Listar todas las películas existentes, con opciones de paginación.
    * Buscar, editar o eliminar películas por su título.
    * Filtrar películas por diversos criterios.

---

## Funcionalidades Clave de la Plataforma 💻

### 1. Seguridad y Autenticación 🔐

* **Registro con Activación:** Proceso seguro de registro con verificación por correo electrónico mediante un token único.
* **Login Seguro:** Acceso mediante credenciales de usuario y contraseña.
* **Tokens JWT (Access y Refresh):** Implementación de JSON Web Tokens para una gestión de sesiones eficiente y segura, permitiendo refrescar el token de acceso sin necesidad de un nuevo inicio de sesión.

### 2. Gestión de Usuarios y Perfiles 👤

* **Edición de Perfil:** Los usuarios pueden mantener sus datos actualizados directamente desde la interfaz web.
* **Administración Centralizada:** Los administradores tienen control total sobre las cuentas de usuario a través del panel de administración.

### 3. Exploración y Gestión de Películas 🎥

* **Catálogo Extenso:** Los usuarios pueden ver el listado completo de películas y buscar por título.
* **Filtros Avanzados:** Filtrado de películas por género, puntuación y otros criterios para una búsqueda más precisa.
* **CRUD de Películas (Admin):** Los administradores pueden añadir, listar, editar y eliminar películas fácilmente a través de una interfaz dedicada.

### 4. Interacción con Reseñas 💬

* **Creación de Reseñas:** Los usuarios pueden compartir sus opiniones y puntuaciones sobre las películas.
* **Edición/Eliminación:** Los usuarios tienen control total sobre sus propias reseñas.
* **Visualización de Reseñas:** Consulta de todas las reseñas asociadas a una película, enriqueciendo la experiencia de otros usuarios.

### 5. Sistema de Favoritos ❤️

* **Lista Personalizada:** Los usuarios pueden crear y gestionar su propia colección de películas favoritas para un acceso rápido.
* **Gestión Sencilla:** Fácil adición y eliminación de películas de esta lista.

---

## Cómo Utilizar la Plataforma

### 1. Acceso a la Aplicación Web (Frontend)

Para interactuar con CinematicMultiverse como usuario final, simplemente navega a la URL de la aplicación web. Desde allí, podrás registrarte, iniciar sesión y comenzar a explorar, reseñar y gestionar tus películas favoritas a través de una interfaz de usuario intuitiva.

### 2. Interacción con la API (Backend)

Para desarrolladores o para pruebas directas del backend, la API REST sigue estando completamente funcional y accesible:

Puedes probar todas las funcionalidades de la API utilizando herramientas como **Postman** o explorando la documentación de **Swagger** (si está configurada). Los endpoints de la API permiten interactuar directamente con todos los recursos disponibles (usuarios, películas, reseñas, favoritos, etc.).

#### Endpoints Principales (Ejemplos):

* `POST /auth/register`: Registrar un nuevo usuario.
* `POST /auth/login`: Iniciar sesión con el usuario y la contraseña.
* `POST /auth/refresh-token`: Refrescar el token de acceso.
* `GET /pelicula`: Listar todas las películas (con paginación y filtros opcionales).
* `POST /pelicula/guardar`: Crear una nueva película (solo administrador, incluye carga de imagen).
* `GET /pelicula/{titulo}`: Obtener detalles de una película por su título.
* `PUT /pelicula/{id}`: Editar una película por su ID (solo administrador).
* `DELETE /pelicula/{titulo}`: Eliminar una película por su título (solo administrador).
* `POST /reseña`: Crear una nueva reseña.
* `GET /reseña/pelicula/{tituloPelicula}`: Obtener reseñas de una película específica.
* `PUT /reseña/{id}`: Editar una reseña por su ID.
* `DELETE /reseña/{id}`: Eliminar una reseña por su ID.
* `GET /favoritos`: Ver la lista de favoritos del usuario autenticado.
* `POST /favoritos`: Agregar una película a favoritos.
* `DELETE /favoritos/{tituloPelicula}`: Eliminar una película de favoritos por su título.
* `GET /user`: Listar usuarios (solo administrador).
* `PUT /user/admin/{id}`: Editar un usuario por su ID (solo administrador).
* `DELETE /user/{username}`: Eliminar un usuario por su nombre de usuario (solo administrador).

---

## Visualización del Diseño (Figma) :star:

Puedes explorar el diseño y la experiencia de usuario de la plataforma en Figma:

([https://www.figma.com/design/BuYIIxOgWAFcpzfKebRV0z/CinematicMultiverse?node-id=0-1&t=3dPLYFOD6zTzAm44-1](https://www.figma.com/proto/Rt6AwtHl47Qo9qiEvzm95Z/CinematicMultiverse?node-id=0-1&t=XMAxyilY4mIhZtJl-1)
