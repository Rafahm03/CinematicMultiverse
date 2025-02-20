package com.example.CinematicMultiverse.user.dto;

public record CreateUserRequest(
        String username, String password, String verifyPassword, String nombre, String email
) {
}
