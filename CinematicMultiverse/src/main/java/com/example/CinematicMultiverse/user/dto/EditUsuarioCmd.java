package com.example.CinematicMultiverse.user.dto;

import java.util.Set;

public record EditUsuarioCmd(
        String username,
        String nombre,
        String email,
        Set<String> roles
) {
}
