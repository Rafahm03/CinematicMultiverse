package com.example.CinematicMultiverse.resenhia.dto;

import com.example.CinematicMultiverse.resenhia.model.Resenia;

import java.time.LocalDateTime;
import java.util.UUID;

public record GetReseniaDto(
        UUID id,
        String username,
        String tituloPelicula,
        double puntuacion,
        String comentario,
        LocalDateTime fechaPublicacion,
        boolean isEdit
) {
    public static GetReseniaDto of(Resenia resenia) {
        return new GetReseniaDto(
                resenia.getId(),
                resenia.getUsuario().getUsername(),
                resenia.getPelicula().getTitulo(),
                resenia.getPuntuacion(),
                resenia.getComentario(),
                resenia.getFechaPublicacion(),
                resenia.isEdit()
        );
    }
}

