package com.example.CinematicMultiverse.pelicula.controller;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.service.PeliculaService;
import com.example.CinematicMultiverse.user.dto.EditUsuarioCmd;
import com.example.CinematicMultiverse.user.dto.GetUsuarioDto;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.util.SearchCriteria;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Log
@RestController
@RequestMapping("/pelicula")
@RequiredArgsConstructor
@Tag(name = "Pelicula", description = "El controlador de pelicula gestiona todas las operaciones relacionadas con esta entidad")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    @PostMapping(value = "/guardar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GetPeliculaDto> guardarPelicula(
            @RequestPart("editPeliculaCmd") EditPeliculaCmd editPeliculaCmd,
            @RequestPart("file") MultipartFile file) {

        Pelicula nuevaPelicula = peliculaService.save(editPeliculaCmd, file);

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
    @GetMapping("/")
    public Page<GetPeliculaDto> obtenerPeliculas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "titulo") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return peliculaService.findAll(pageable);
    }

    @Operation(summary = "Obtiene una película por su TITULO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Se ha encontrado la película",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = GetPeliculaDto.class))}),
            @ApiResponse(responseCode = "404",
                    description = "No se ha encontrado la película con el Titulo proporcionado",
                    content = @Content)
    })

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{titulo}")
    public GetPeliculaDto getPeliculaByTitulo(@PathVariable String titulo) {
        return peliculaService.getPeliculaDtoByTitulo(titulo);
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
    @PutMapping("/{titulo}")
    public ResponseEntity<Pelicula> editPelicula(@RequestBody EditPeliculaCmd editPeliculaCmd,
                                                 @PathVariable String titulo
    ) {

        Pelicula peliculaEditada = peliculaService.editPelicula(editPeliculaCmd, titulo);
        return ResponseEntity.ok(peliculaEditada);
    }

    @Operation(summary = "Elimina una película por su titulo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Película eliminada exitosamente",
                    content = @Content),
            @ApiResponse(responseCode = "404",
                    description = "No se encontró la pelícuña con el Titulo proporcionado",
                    content = @Content)
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{titulo}")
    public ResponseEntity<?> delete(@PathVariable String titulo) {
        peliculaService.deleteByTitulo(titulo);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/buscar")
    public List<GetPeliculaDto> buscar(@RequestParam(value = "search", required = false) String search) {
        log.info(search);

        List<SearchCriteria> params = new ArrayList<>();
        if (search != null && !search.trim().isEmpty()) {
            Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+?),");
            Matcher matcher = pattern.matcher(search + ",");
            while (matcher.find()) {
                log.info(matcher.group(1));
                log.info(matcher.group(2));
                log.info(matcher.group(3));
                params.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
            }
        }

        return peliculaService.search(params);
    }



}
