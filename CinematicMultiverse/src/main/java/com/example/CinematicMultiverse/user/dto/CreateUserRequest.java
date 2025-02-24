package com.example.CinematicMultiverse.user.dto;


import com.example.CinematicMultiverse.user.validation.FieldsValueMatch;
import com.example.CinematicMultiverse.user.validation.UniqueUsername;
import jakarta.validation.constraints.NotBlank;

@FieldsValueMatch.List({
        @FieldsValueMatch(
                field = "password",
                fieldMatch = "verifyPassword",
                message = "Los valores de password y verifyPassword no coinciden"),
        @FieldsValueMatch(
                field = "email",
                fieldMatch = "verifyEmail",
                message = "Los valores de email y verifyEmail no coinciden")
})
public record CreateUserRequest(
        @NotBlank(message = "El username del usuario no puede estar vacío")
        @UniqueUsername(message = "El username ya existe")
        String username,

        @NotBlank(message = "La contraseña es obligatoria")
        String password,

        @NotBlank(message = "Debes confirmar la contraseña")
        String verifyPassword,

        @NotBlank(message = "El nombre no puede estar vacío")
        String nombre,

        @NotBlank(message = "El email es obligatorio")
        String email,

        @NotBlank(message = "Debes confirmar el email")
        String verifyEmail
) {
}
