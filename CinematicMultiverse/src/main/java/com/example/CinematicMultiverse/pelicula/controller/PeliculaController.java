package com.example.CinematicMultiverse.pelicula.controller;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.service.PeliculaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pelicula")
@RequiredArgsConstructor
@Tag(name = "Pelicula", description = "El controlador de pelicula gestiona todas las operaciones relacionadas con esta entidad")
public class PeliculaController {
    private final PeliculaService peliculaService;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/guardar")
    public ResponseEntity<Pelicula> guardarPelicula(@RequestBody EditPeliculaCmd editPeliculaCmd) {
        Pelicula nuevaPelicula = peliculaService.save(editPeliculaCmd);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPelicula);
    }
}
