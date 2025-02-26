package com.example.CinematicMultiverse.user.dto;

public record EditUsuarioCmd(
        String username,
        String password,
        String nombre,
        String email,
        String role
) {
}
