package com.example.CinematicMultiverse.user.dto;

import com.example.CinematicMultiverse.user.model.Usuario;

import java.util.UUID;
import java.util.stream.Collectors;

public record GetUsuarioDto (
        UUID id,
        String username,
        String nombre,
        String email,
        String role


) {
    public static GetUsuarioDto of(Usuario u){
        return new GetUsuarioDto(
                u.getId(),
                u.getUsername(),
                u.getNombre(),
                u.getEmail(),
                u.getRoles().stream()
                        .map(Enum::name)
                        .collect(Collectors.joining(", "))
        );
    }
}
