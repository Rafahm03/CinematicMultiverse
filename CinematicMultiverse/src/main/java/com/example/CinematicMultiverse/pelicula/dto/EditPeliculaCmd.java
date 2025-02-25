package com.example.CinematicMultiverse.pelicula.dto;

import java.util.List;

public record EditPeliculaCmd(

        String titulo,
        String sinopsis,
        double puntuacion,
        String imagen,
        int duracion,
        int anio,
        List<String> generos

) {
}
