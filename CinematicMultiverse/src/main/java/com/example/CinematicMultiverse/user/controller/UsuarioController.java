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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioService usuarioService;


    @PostMapping("/auth/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid CreateUserRequest createUserRequest) {


        Usuario usuario = usuarioService.createUser(createUserRequest);
        UserResponse response = UserResponse.of(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



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

    @PostMapping("/auth/refresh/token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest req) {
        String token = req.refreshToken();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(refreshTokenService.refreshToken(token));

    }

    @PostMapping("/activate/account/")
    public ResponseEntity<?> activateAccount(@RequestBody ActivatedAccountRequest req) {
        String token = req.token();
        Usuario usuarioActivado = usuarioService.activateAccount(token);

        return ResponseEntity.status(HttpStatus.OK)
                .body("Cuenta activada con éxito");
    }


    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal Usuario  usuario) {
        return UserResponse.of(usuario);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/me/admin")
    public Usuario adminMe(@AuthenticationPrincipal Usuario usuario) {
        return usuario;
    }
}
