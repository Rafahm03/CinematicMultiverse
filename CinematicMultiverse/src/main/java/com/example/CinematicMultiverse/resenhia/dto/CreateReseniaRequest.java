package com.example.CinematicMultiverse.resenhia.dto;

import java.time.LocalDate;
import java.util.UUID;

public record CreateReseniaRequest(
        UUID usuarioId,
        UUID peliculaId,
        double puntuacion,
        String comentario,
        LocalDate fechaPublicacion
) {
}
