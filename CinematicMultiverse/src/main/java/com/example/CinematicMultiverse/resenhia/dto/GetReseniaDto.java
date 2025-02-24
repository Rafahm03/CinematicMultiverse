package com.example.CinematicMultiverse.resenhia.dto;

import com.example.CinematicMultiverse.resenhia.model.Resenia;

import java.time.LocalDateTime;
import java.util.UUID;

public record GetReseniaDto(
        Long id,
        UUID usuarioId,
        UUID peliculaId,
        int puntuacion,
        String comentario,
        LocalDateTime fechaPublicacion
) {
    public static GetReseniaDto of(Resenia resenia) {
        return new GetReseniaDto(
                resenia.getId(),
                resenia.getUsuario().getId(),
                resenia.getPelicula().getId(),
                resenia.getPuntuacion(),
                resenia.getComentario(),
                resenia.getFechaPublicacion()
        );
    }
}

