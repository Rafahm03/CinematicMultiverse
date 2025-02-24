package com.example.CinematicMultiverse.resenhia.dto;

import java.time.LocalDate;
import java.util.UUID;

public record CreateReseniaRequest(
        UUID usuarioId,
        String tituloPelicula,
        double puntuacion,
        String comentario,
        LocalDate fechaPublicacion
) {
}
