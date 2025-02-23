package com.example.CinematicMultiverse.resenhia.controller;

import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.resenhia.dto.CreateReseniaRequest;
import com.example.CinematicMultiverse.resenhia.dto.GetReseniaDto;
import com.example.CinematicMultiverse.resenhia.model.Resenia;
import com.example.CinematicMultiverse.resenhia.service.ReseniaService;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.service.UsuarioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
@Tag(name = "Review", description = "El controlador de reseñas para gestionar todas las operaciones relacionadas con esta entidad")
public class ReseniaController {
    private final ReseniaService reseniaService;
    private final UsuarioService usuarioService;


    @PostMapping("/crearReview")
    public ResponseEntity<GetReseniaDto> crearResenia(@RequestBody CreateReseniaRequest createReseniaRequest,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            Long peliculaId = createReseniaRequest.peliculaId();

            Resenia resenia = reseniaService.crearReview(username, createReseniaRequest, peliculaId);

            GetReseniaDto reseniaDto = GetReseniaDto.of(resenia);

            return ResponseEntity.status(HttpStatus.CREATED).body(reseniaDto);

        } catch (UsuarioNotFoundException | PeliculaNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }



}
