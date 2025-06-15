package com.example.CinematicMultiverse.user.controller;

import com.example.CinematicMultiverse.resenhia.dto.CreateReseniaRequest;
import com.example.CinematicMultiverse.resenhia.model.Resenia;
import com.example.CinematicMultiverse.resenhia.service.ReseniaService;
import com.example.CinematicMultiverse.user.dto.EditUsuarioCmd;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Usuario", description = "El controlador de usuario para gestionar todas las operaciones relacionadas con esta entidad")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final ReseniaService reseniaService;

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
    public ResponseEntity<Page<GetUsuarioDto>> getAll(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        // Verifica que el usuario tenga el rol de ADMIN
        if (authentication.getAuthorities().stream()
                .noneMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }

        // Configurar paginación y ordenación
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<GetUsuarioDto> usuarios = usuarioService.findAll(pageable);

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

    @PutMapping("/perfil")
    @Operation(summary = "Edita el perfil del usuario logueado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Perfil editado exitosamente",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = GetUsuarioDto.class))}),
            @ApiResponse(responseCode = "404",
                    description = "No se encontró el usuario con el username proporcionado",
                    content = @Content)
    })
    public ResponseEntity<GetUsuarioDto> editarPerfil(@RequestBody EditUsuarioCmd editUsuarioCmd,
                                                      @AuthenticationPrincipal Usuario loggedUser) {
        GetUsuarioDto usuarioEditadoDto = usuarioService.editarProfile(editUsuarioCmd, loggedUser);

        return ResponseEntity.ok(usuarioEditadoDto);
    }


    @PutMapping("/admin/{id}")
    @Operation(summary = "Edita un usuario como admin")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Usuario editado exitosamente",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = GetUsuarioDto.class))}),
            @ApiResponse(responseCode = "404",
                    description = "No se encontró el usuario con el ID proporcionado",
                    content = @Content),
            @ApiResponse(responseCode = "403",
                    description = "No tienes permisos para editar a otro usuario",
                    content = @Content)
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GetUsuarioDto> editarUsuarioPorAdmin(@RequestBody EditUsuarioCmd editUsuarioCmd,
                                                               @PathVariable UUID id,
                                                               Authentication authentication) {

        GetUsuarioDto usuarioEditado = usuarioService.editarUsuarioPorAdmin(editUsuarioCmd, id);
        return ResponseEntity.ok(usuarioEditado);
    }

}

