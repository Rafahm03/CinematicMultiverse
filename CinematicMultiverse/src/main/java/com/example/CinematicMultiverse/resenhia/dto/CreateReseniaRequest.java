package com.example.CinematicMultiverse.resenhia.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.UUID;

public record CreateReseniaRequest(
        UUID usuarioId,

        @NotBlank(message = "El título de la película no puede estar vacío.")
        String tituloPelicula,

        @DecimalMin(value = "0.0", message = "La puntuación debe ser mayor o igual a 0.0")
        @DecimalMax(value = "10.0", message = "La puntuación debe ser menor o igual a 10.0")
        @NotNull(message = "La puntuación no puede ser nula")
        double puntuacion,

        @NotBlank(message = "El comentario no puede estar vacío.")
        @NotNull(message = "El comentario no puede ser nullo")
        String comentario,

        LocalDate fechaPublicacion
) {
}
