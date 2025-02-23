package com.example.CinematicMultiverse.pelicula.dto;

public record EditPeliculaCmd(
        String titulo,
        String sinopsis,
        double puntuacion,
        String imagen,
        int duracion,
        int anio,
        String genero
) {
}
