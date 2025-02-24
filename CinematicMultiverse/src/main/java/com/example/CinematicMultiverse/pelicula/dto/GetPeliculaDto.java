package com.example.CinematicMultiverse.pelicula.dto;

import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.user.dto.GetUsuarioDto;
import com.example.CinematicMultiverse.user.model.Usuario;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record GetPeliculaDto(
        UUID id,
        String titulo,
        String sinopsis,
        double puntuacion,
        String imagen,
        int duracion,
        int anio,
        Set<String> generos
) {

    public static GetPeliculaDto of(Pelicula p){
        return new GetPeliculaDto(
                p.getId(),
                p.getTitulo(),
                p.getSinopsis(),
                p.getPuntuacion(),
                p.getImagen(),
                p.getDuracion(),
                p.getAnio(),
                p.getGeneros().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet())
        );
    }
}

