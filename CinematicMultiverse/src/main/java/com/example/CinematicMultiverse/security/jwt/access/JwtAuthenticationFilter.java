// src/main/java/com/example/CinematicMultiverse/security/jwt/access/JwtAuthenticationFilter.java

package com.example.CinematicMultiverse.security.jwt.access;

import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    private static final String[] PUBLIC_URLS = {
            "/auth/login",
            "/auth/register",
            "/auth/refresh/token",
            "/error",
            "/activate/account/",
            "/activate/account/**",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/api-docs/**",
            "/h2-console/**"
    };


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // --- LOGS DE DEPURACIÓN AÑADIDOS ---
        System.out.println("\n--- JwtAuthenticationFilter ---");
        System.out.println("URL de la petición: " + request.getRequestURI());
        System.out.println("Método HTTP: " + request.getMethod());
        System.out.println("¿Debería filtrar (shouldNotFilter)? " + shouldNotFilter(request));
        // --- FIN LOGS DE DEPURACIÓN ---

        String token = getJwtAccessTokenFromRequest(request);

        // --- LOGS DE DEPURACIÓN AÑADIDOS ---
        System.out.println("Token en el encabezado de autorización: " + (token != null ? "Presente" : "Ausente"));
        // --- FIN LOGS DE DEPURACIÓN ---

        try {
            if (StringUtils.hasText(token) && jwtService.validateAccessToken(token)) {
                // --- LOGS DE DEPURACIÓN AÑADIDOS ---
                System.out.println("Token validado con éxito por JwtService.");
                // --- FIN LOGS DE DEPURACIÓN ---

                UUID id = jwtService.getUserIdFromAccessToken(token);

                Optional<Usuario> result = usuarioRepository.findById(id);

                if (result.isPresent()) {
                    Usuario usuario = result.get();
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            usuario,
                            null,
                            usuario.getAuthorities()
                    );

                    authenticationToken.setDetails(new WebAuthenticationDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    // --- LOGS DE DEPURACIÓN AÑADIDOS ---
                    System.out.println("Usuario " + usuario.getUsername() + " autenticado y contexto de seguridad establecido.");
                    System.out.println("Roles del usuario: " + usuario.getAuthorities());
                    // --- FIN LOGS DE DEPURACIÓN ---
                } else {
                    System.out.println("ADVERTENCIA: Usuario del token no encontrado en la base de datos.");
                }
            } else if (StringUtils.hasText(token) && !shouldNotFilter(request)) {
                // Si el token está presente pero la validación falla, y no es una URL pública
                System.out.println("ERROR: Token presente pero inválido o expirado (no pasó validateAccessToken).");
            } else if (!StringUtils.hasText(token) && !shouldNotFilter(request)) {
                // Si no hay token y no es una URL pública (requerirá autenticación en SecurityConfig)
                System.out.println("INFO: No se encontró token en la petición para una URL no pública. Dejar que SecurityConfig maneje la autenticación.");
            }
        } catch (JwtException ex) {
            System.err.println("ERROR JwtException en filtro: " + ex.getMessage());
            resolver.resolveException(request, response, null, ex);
            return;
        } finally {
            System.out.println("--- Fin JwtAuthenticationFilter ---\n");
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return Arrays.stream(PUBLIC_URLS)
                .anyMatch(publicUrl -> {
                    if (publicUrl.endsWith("/**")) {
                        return path.startsWith(publicUrl.substring(0, publicUrl.length() - 2));
                    }
                    return path.equals(publicUrl);
                });
    }


    private String getJwtAccessTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(JwtService.TOKEN_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(JwtService.TOKEN_PREFIX)) {
            return bearerToken.substring(JwtService.TOKEN_PREFIX.length());
        }
        return null;
    }
}
