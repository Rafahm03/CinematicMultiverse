package com.example.CinematicMultiverse.pelicula.service;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;

    public Pelicula save(EditPeliculaCmd editPeliculaCmd) {
        Set<Genero> generos = Arrays.stream(editPeliculaCmd.genero().split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .map(Genero::valueOf)
                .collect(Collectors.toSet());

        return peliculaRepository.save(Pelicula.builder()
                .titulo(editPeliculaCmd.titulo())
                .sinopsis(editPeliculaCmd.sinopsis())
                .puntuacion(editPeliculaCmd.puntuacion())
                .imagen(editPeliculaCmd.imagen())
                .duracion(editPeliculaCmd.duracion())
                .anio(editPeliculaCmd.anio())
                .generos(generos)
                .build());
    }

}
