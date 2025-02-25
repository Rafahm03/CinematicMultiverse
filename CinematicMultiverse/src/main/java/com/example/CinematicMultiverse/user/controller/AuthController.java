package com.example.CinematicMultiverse.user.controller;

import com.example.CinematicMultiverse.security.jwt.access.JwtService;
import com.example.CinematicMultiverse.security.jwt.refresh.RefreshToken;
import com.example.CinematicMultiverse.security.jwt.refresh.RefreshTokenRequest;
import com.example.CinematicMultiverse.security.jwt.refresh.RefreshTokenService;
import com.example.CinematicMultiverse.user.dto.ActivatedAccountRequest;
import com.example.CinematicMultiverse.user.dto.CreateUserRequest;
import com.example.CinematicMultiverse.user.dto.LoginRequest;
import com.example.CinematicMultiverse.user.dto.UserResponse;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import com.example.CinematicMultiverse.user.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Tag(name = "Usuario", description = "El controlador de usuario para gestionar todas las operaciones relacionadas con esta entidad")
public class AuthController {
    private final UsuarioService userService;
    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioService usuarioService;

    @Operation(
            summary = "Registrar un nuevo usuario",
            description = "Crea un usuario en la plataforma con los datos proporcionados."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario registrado con éxito"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada incorrectos")
    })
    @PostMapping("/auth/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid CreateUserRequest createUserRequest) {
        Usuario usuario = usuarioService.createUser(createUserRequest);
        UserResponse response = UserResponse.of(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica a un usuario y devuelve un token de acceso y un token de refresco."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Inicio de sesión exitoso"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas o cuenta no activada")
    })
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(loginRequest.username());
        if (usuarioOpt.isEmpty() || !usuarioOpt.get().isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Cuenta no activada o usuario no encontrado");
        }

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.username(),
                                loginRequest.password()
                        )
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        Usuario usuario = (Usuario) authentication.getPrincipal();

        String accessToken = jwtService.generateAccessToken(usuario);
        RefreshToken refreshToken = refreshTokenService.create(usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.of(usuario, accessToken, refreshToken.getToken()));
    }

    @Operation(
            summary = "Refrescar token de autenticación",
            description = "Genera un nuevo token de acceso usando un token de refresco válido."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Token refrescado con éxito"),
            @ApiResponse(responseCode = "401", description = "Token de refresco inválido o expirado")
    })
    @PostMapping("/auth/refresh/token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest req) {
        String token = req.refreshToken();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(refreshTokenService.refreshToken(token));
    }

    @Operation(
            summary = "Activar cuenta",
            description = "Activa la cuenta de un usuario utilizando un token de activación."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cuenta activada con éxito"),
            @ApiResponse(responseCode = "400", description = "Token inválido o expirado")
    })
    @PostMapping("/activate/account")
    public ResponseEntity<?> activateAccount(@RequestBody ActivatedAccountRequest req) {
        String token = req.token();
        usuarioService.activateAccount(token);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Cuenta activada con éxito");
    }


    @Operation(
            summary = "Obtener información del usuario autenticado",
            description = "Devuelve la información del usuario que ha iniciado sesión."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Información del usuario obtenida con éxito"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal Usuario usuario) {
        return UserResponse.of(usuario);
    }

    @Operation(
            summary = "Obtener información del usuario administrador",
            description = "Devuelve la información del usuario administrador autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Información del administrador obtenida con éxito"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado para usuarios no administradores")
    })
    @GetMapping("/me/admin")
    public Usuario adminMe(@AuthenticationPrincipal Usuario usuario) {
        return usuario;
    }
}
