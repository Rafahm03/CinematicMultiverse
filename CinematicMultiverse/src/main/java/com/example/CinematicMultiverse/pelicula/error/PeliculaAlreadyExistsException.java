package com.example.CinematicMultiverse.pelicula.error;

public class PeliculaAlreadyExistsException extends RuntimeException {
    public PeliculaAlreadyExistsException(String message) {
        super(message);
    }
}
