package com.example.CinematicMultiverse.user.controller;

import com.example.CinematicMultiverse.user.dto.GetUsuarioDto;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import com.example.CinematicMultiverse.user.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Usuario", description = "El controlador de usuario para gestionar todas las operaciones relacionadas con esta entidad")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    @Operation(summary = "Obtiene todas los usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Se han encontrado las usuarios",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GetUsuarioDto.class)),
                            examples = {@ExampleObject(
                                    value = """
                                                {
                                                    "id": "550e8400-e29b-41d4-a716-446655440000",
                                                    "username": "RuizloCar",
                                                    "password": "password123",
                                                    "nombre": "Carlos Ruiz",
                                                    "email": "carlos.ruiz@example.com",
                                                    "enabled": true,
                                                    "activationToken": null,
                                                    "createdAt": "2025-02-22T00:00:00Z",
                                                    "roles": [
                                                        "USER"
                                                    ]
                                                }
                                            """

                            )}
                    )}),
            @ApiResponse(responseCode = "404",
                    description = "No se han encontrado usuarios"
            )
    })

    @GetMapping("/")
    public ResponseEntity<List<GetUsuarioDto>> getAll(Authentication authentication) {
        if (authentication.getAuthorities().stream()
                .noneMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }

        List<GetUsuarioDto> usuarios = usuarioService.findAll().stream()
                .map(GetUsuarioDto::of)
                .collect(Collectors.toList());

        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Obtiene un usuario por su nombre de usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @GetMapping("/{username}")
    public ResponseEntity<Usuario> getUsuarioByUsername(@PathVariable String username, Authentication authentication) {
        if (authentication.getAuthorities().stream()
                .noneMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }

        Usuario usuario = usuarioService.findByUsername(username);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @Operation(summary = "Elimina un usuario por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Usuario eliminado exitosamente",
                    content = @Content),
            @ApiResponse(responseCode = "404",
                    description = "No se encontró el usuario con el ID proporcionado",
                    content = @Content)
    })
    @DeleteMapping("/{username}")
    public ResponseEntity<?> delete(@PathVariable String username, Authentication authentication) {
        if (authentication.getAuthorities().stream()
                .noneMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }
        usuarioService.deleteByUsername(username);
        return ResponseEntity.noContent().build();
    }


}

