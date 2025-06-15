package com.example.CinematicMultiverse.favorito.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class PeliculaYaEnFavoritosException extends RuntimeException {

    public PeliculaYaEnFavoritosException(String message) {
        super(message);
    }

    public PeliculaYaEnFavoritosException() {
        super("La película ya está en tu lista de favoritos.");
    }
}