package com.example.CinematicMultiverse.user.error;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(String message) {
        super(message);
    }

    public UsuarioNotFoundException() {
        super("No hay usuarios con esos requisitos de búsqueda");
    }

}