package com.example.CinematicMultiverse.user.dto;

import com.example.CinematicMultiverse.user.validation.FieldsValueMatch;
import com.example.CinematicMultiverse.user.validation.UniqueUsername;
import jakarta.validation.constraints.NotBlank;

/*@FieldsValueMatch.List({
        @FieldsValueMatch(
                field = "password",
                fieldMatch = "verifyPassword",
                message = "Los valores de password y verifyPassword no coinciden"),
        @FieldsValueMatch(
                field = "email",
                fieldMatch = "verifyEmail",
                message = "Los valores de email y verifyEmail no coinciden")
})*/
public record CreateUserRequest(

        @NotBlank(message = "El username del usuario no puede estar vacío")
        // @UniqueUsername(message = "El username ya existe") // Comentado para probar solo @NotBlank
        String username,

        @NotBlank(message = "La contraseña es obligatoria")
        // @FieldsValueMatch(field = "password", fieldMatch = "verifyPassword", message = "Los valores de password y verifyPassword no coinciden") // Comentado
        String password,

        @NotBlank(message = "Debes confirmar la contraseña")
        // @FieldsValueMatch(field = "email", fieldMatch = "verifyEmail", message = "Los valores de email y verifyEmail no coinciden") // Comentado
        String verifyPassword,

        @NotBlank(message = "El nombre no puede estar vacío")
        String nombre,

        @NotBlank(message = "El email es obligatorio")
        String email,

        @NotBlank(message = "Debes confirmar el email")
        String verifyEmail
) {
}