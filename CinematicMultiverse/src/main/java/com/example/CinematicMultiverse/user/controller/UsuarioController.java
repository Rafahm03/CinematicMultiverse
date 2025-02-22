package com.example.CinematicMultiverse.user.controller;

import com.example.CinematicMultiverse.user.dto.GetUsuarioDto;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Usuario", description = "El controlador de usuario para gestionar todas las operaciones relacionadas con esta entidad")
public class UsuarioController {

    private final UsuarioService usuarioService;

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
        // Verificamos si el usuario logueado tiene el rol de ADMIN
        if (authentication.getAuthorities().stream()
                .noneMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }

        List<GetUsuarioDto> usuarios = usuarioService.findAll().stream()
                .map(GetUsuarioDto::of)
                .collect(Collectors.toList());

        return ResponseEntity.ok(usuarios);
    }
}
