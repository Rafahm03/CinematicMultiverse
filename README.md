# 🎬 CinematicMultiverse 🎬 - API REST :rocket:

CinematicMultiverse es una API REST diseñada para gestionar una plataforma de películas, donde los usuarios pueden registrarse, agregar reseñas, marcar películas como favoritas, y más. La plataforma también cuenta con un panel de administración para gestionar usuarios y películas.

## Roles de Usuario

### 1. User (Usuario)

El usuario tiene los siguientes permisos:
- **Registrar una cuenta**: Al registrarse, se enviará un correo electrónico con un token de activación.
- **Iniciar sesión**: Después de activar la cuenta, el usuario podrá iniciar sesión con su usuario y contraseña. Si el token de sesión caduca, se podrá utilizar un token de refresco.
- **Editar su perfil**: El usuario puede actualizar sus datos personales.
- **Favoritos**: El usuario puede agregar películas a su lista de favoritos, ver su lista y eliminar películas de ella.
- **Reseñas**: El usuario puede crear reseñas para las películas, editar sus reseñas existentes o eliminarlas. También puede ver las reseñas de otras películas.
- **Buscar películas**: El usuario puede buscar películas por título y ver los detalles de cada una.

### 2. Admin (Administrador)

El administrador tiene todos los permisos de un usuario, además de los siguientes:
- **Gestión de usuarios**:
  - Listar todos los usuarios registrados.
  - Buscar usuarios por su nombre de usuario.
  - Eliminar usuarios.
  - Editar usuarios, incluido el cambio de su rol (de User a Admin o viceversa).
  
- **Gestión de películas**:
  - **Guardar una nueva película**: El administrador puede añadir películas proporcionando un JSON con la información de la película y la imagen de la portada.
  - **Listar todas las películas** con paginación.
  - **Buscar, editar o eliminar una película** por su título.
  - **Filtrar películas** por diferentes criterios.

## Funcionalidades 💻

### 1. Funcionalidades de Seguridad 🔐
- **Registro**: El usuario podrá registrarse proporcionando sus datos personales. Un correo de activación con un token será enviado a la dirección de correo proporcionada. El usuario deberá ingresar el token para activar su cuenta.
- **Inicio de sesión**: Una vez activada la cuenta, el usuario podrá iniciar sesión con su usuario y contraseña.
- **Token de Refresco**: Si el token de acceso caduca, se podrá utilizar un token de refresco para obtener uno nuevo sin necesidad de volver a iniciar sesión.

### 2. Funcionalidades del Usuario 👤
- Los usuarios pueden **editar su perfil** personal.
- Los usuarios pueden **agregar películas a sus favoritos** y ver su lista de favoritos.
- Los usuarios pueden **crear reseñas** para películas, **editar o eliminar** sus reseñas, y ver las reseñas de otras películas.

### 3. Funcionalidades del Administrador 🔑
- **Gestión de usuarios**: El administrador puede listar, buscar, editar y eliminar usuarios. Además, puede cambiar el rol de un usuario (por ejemplo, de User a Admin).
- **Gestión de películas**: El administrador puede agregar nuevas películas, listar las existentes (con paginación), buscar, editar o eliminar películas por su título. También puede filtrar las películas según diferentes criterios.

### 4. Funcionalidades de Películas 🎥 
- **Agregar una película**: El administrador puede agregar una película proporcionando los detalles de la película en formato JSON y una imagen de portada.
- **Listar películas**: El administrador puede ver todas las películas registradas con paginación.
- **Buscar películas**: El administrador puede buscar películas por título.
- **Filtrar películas**: Los usuarios pueden buscar películas filtrando por género, puntuación o cualquier otro criterio disponible.

### 5. Funcionalidades de Reseñas 💬
- Los usuarios pueden **crear una reseña** para una película.
- Los usuarios pueden **editar o eliminar** sus reseñas.
- Los usuarios pueden ver las **reseñas de una película específica**.

### 6. Funcionalidades de Favoritos ❤️
- Los usuarios pueden **agregar películas a su lista de favoritos**.
- Los usuarios pueden **ver su lista de favoritos**.
- Los usuarios pueden **eliminar películas de su lista de favoritos**.

## Cómo Probar la API

Puedes probar todas las funcionalidades de la API utilizando herramientas como **Postman** o **Swagger**. Los endpoints de la API permiten interactuar con todos los recursos disponibles, como usuarios, películas, reseñas y más.

### Endpoints disponibles:

- **POST /register**: Registrar un nuevo usuario.
- **POST /login**: Iniciar sesión con el usuario y la contraseña.
- **POST /refresh-token**: Refrescar el token de acceso.
- **GET /movies**: Listar todas las películas.
- **POST /movies**: Crear una nueva película (solo administrador).
- **GET /movies/{titulo}**: Obtener detalles de una película.
- **PUT /movies/{titulo}**: Editar una película (solo administrador).
- **DELETE /movies/{titulo}**: Eliminar una película (solo administrador).
- **GET /reviews**: Listar todas las reseñas de un usuario.
- **POST /reviews**: Crear una nueva reseña.
- **PUT /reviews/{id}**: Editar una reseña.
- **DELETE /reviews/{id}**: Eliminar una reseña.
- **GET /favorites**: Ver la lista de favoritos de un usuario.
- **POST /favorites**: Agregar una película a favoritos.
- **DELETE /favorites/{titulo}**: Eliminar una película de favoritos.

## Visualización de la Api Rest con FIGMA :star:
https://www.figma.com/design/BuYIIxOgWAFcpzfKebRV0z/CinematicMultiverse?node-id=0-1&t=3dPLYFOD6zTzAm44-1
