package com.example.CinematicMultiverse.pelicula.controller;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.service.PeliculaService;
import com.example.CinematicMultiverse.user.dto.EditUsuarioCmd;
import com.example.CinematicMultiverse.user.dto.GetUsuarioDto;
import com.example.CinematicMultiverse.user.model.Usuario;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pelicula")
@RequiredArgsConstructor
@Tag(name = "Pelicula", description = "El controlador de pelicula gestiona todas las operaciones relacionadas con esta entidad")
public class PeliculaController {
    private final PeliculaService peliculaService;



    @Operation(summary = "Guarda una nueva película")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",
                    description = "Película creada con éxito",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = GetPeliculaDto.class))}),
            @ApiResponse(responseCode = "400",
                    description = "Datos inválidos para crear la película",
                    content = @Content)
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/guardar")
    public ResponseEntity<GetPeliculaDto> guardarPelicula(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Detalles de la película a guardar",
                    required = true,
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EditPeliculaCmd.class),
                            examples = @ExampleObject(value = """
                                {
                                    "titulo": "The Incredible Hulk",
                                    "sinopsis": "Bruce Banner busca una cura para su condición mientras es perseguido por el ejército de los EE.UU.",
                                    "puntuacion": 7.0,
                                    "imagen": "https://example.com/the-incredible-hulk.jpg",
                                    "duracion": 112,
                                    "anio": 2008,
                                    "genero": "ACCION"
                                }
                        """)))
            @RequestBody EditPeliculaCmd editPeliculaCmd) {

        Pelicula nuevaPelicula = peliculaService.save(editPeliculaCmd);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GetPeliculaDto.of(nuevaPelicula));
    }



    @Operation(summary = "Obtiene todas las películas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Se han encontrado películas",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GetPeliculaDto.class)),
                            examples = {@ExampleObject(
                                    value = """
                                            [
                                                {"titulo": "incidencia1"}
                                            ]
                                            """
                            )}
                    )}),
            @ApiResponse(responseCode = "404",
                    description = "No se han encontrado películas",
                    content = @Content)
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<GetPeliculaDto>> getAllPeliculas() {
        List<GetPeliculaDto> peliculas = peliculaService.findAll();

        if (peliculas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(peliculas);
    }

    @Operation(summary = "Obtiene una película por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Se ha encontrado la película",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = GetPeliculaDto.class))}),
            @ApiResponse(responseCode = "404",
                    description = "No se ha encontrado la película con el ID proporcionado",
                    content = @Content)
    })

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public GetPeliculaDto getById(@PathVariable Long id) {
        return peliculaService.getPeliculaDtoById(id);
    }


    @Operation(summary = "Edita una película como admin")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Película editada exitosamente",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Pelicula.class))}),
            @ApiResponse(responseCode = "404",
                    description = "No se encontró la Película con el id proporcionado",
                    content = @Content),
            @ApiResponse(responseCode = "403",
                    description = "No tienes permisos para editar",
                    content = @Content)
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Pelicula> editPelicula(@RequestBody EditPeliculaCmd editPeliculaCmd,
                                                 @PathVariable Long id
    ) {

        Pelicula peliculaEditada = peliculaService.editPelicula(editPeliculaCmd, id);
        return ResponseEntity.ok(peliculaEditada);
    }


}
