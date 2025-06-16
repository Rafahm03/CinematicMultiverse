package com.example.CinematicMultiverse.resenhia.controller;

import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.resenhia.dto.CreateReseniaRequest;
import com.example.CinematicMultiverse.resenhia.dto.EditReseniaCmd;
import com.example.CinematicMultiverse.resenhia.dto.GetReseniaDto;
import com.example.CinematicMultiverse.resenhia.error.ReseniaNotFoundException;
import com.example.CinematicMultiverse.resenhia.error.ReseniaYaExiste;
import com.example.CinematicMultiverse.resenhia.model.Resenia;
import com.example.CinematicMultiverse.resenhia.service.ReseniaService;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
@Tag(name = "Review", description = "El controlador de reseñas para gestionar todas las operaciones relacionadas con esta entidad")
public class ReseniaController {
    private final ReseniaService reseniaService;
    private final UsuarioService usuarioService;


    @PostMapping("/crearReview")
    public ResponseEntity<GetReseniaDto> crearResenia(@RequestBody @Valid CreateReseniaRequest createReseniaRequest,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        String tituloPelicula = createReseniaRequest.tituloPelicula();

        Resenia resenia = reseniaService.crearReview(username, createReseniaRequest, tituloPelicula);

        GetReseniaDto reseniaDto = GetReseniaDto.of(resenia);

        return ResponseEntity.status(HttpStatus.CREATED).body(reseniaDto);
    }

    @Operation(summary = "Obtiene todas las Reseñas de un Usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Se han encontrado las reviews",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GetReseniaDto.class)),
                            examples = {@ExampleObject(
                                    value = """
                                         [
                                             {"peliculaId": 2001, "puntuacion": 5, "comentario": "¡Una película increíble!"}
                                         ]
                                         """
                            )})}),
            @ApiResponse(responseCode = "404", description = "No se han encontrado reviews", content = @Content)
    })
    @GetMapping("/myReviews/{userId}")
    public ResponseEntity<Page<GetReseniaDto>> getMyAllReviews(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<GetReseniaDto> reviews = reseniaService.findByUserId(userId, pageable);

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Obtiene todas las Reseñas por título de película")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Se han encontrado las reviews",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GetReseniaDto.class)),
                            examples = {@ExampleObject(
                                    value = """
                                         [
                                             {"peliculaId": 2001, "puntuacion": 5, "comentario": "¡Una película increíble!"}
                                         ]
                                         """
                            )})}),
            @ApiResponse(responseCode = "404", description = "No se han encontrado reviews", content = @Content)
    })
    @GetMapping("/buscarReviews")
    public ResponseEntity<Page<GetReseniaDto>> buscarReviews(
            @RequestParam(value = "tituloPelicula") String tituloPelicula,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<GetReseniaDto> reviews = reseniaService.findReviewsByTitulo(tituloPelicula, pageable);

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(reviews);
    }



    @PutMapping("/editarReview/{id}")
    public ResponseEntity<GetReseniaDto> editarResenia(@PathVariable UUID id,
                                                       @RequestBody EditReseniaCmd editReseniaCmd,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        Resenia resenia = reseniaService.editarResenia(id, editReseniaCmd, username);
        GetReseniaDto reseniaDto = GetReseniaDto.of(resenia);

        return ResponseEntity.ok(reseniaDto);
    }

    @DeleteMapping("/eliminarReview/{id}")
    public ResponseEntity<Void> eliminarResenia(@PathVariable UUID id,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        reseniaService.eliminarResenia(id, username);

        return ResponseEntity.noContent().build();
    }


}
