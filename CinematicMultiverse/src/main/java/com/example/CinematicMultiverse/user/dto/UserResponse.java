package com.example.CinematicMultiverse.user.dto;

import com.example.CinematicMultiverse.user.model.Usuario;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        String token,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        String refreshToken

) {

    public static UserResponse of (Usuario usuario) {
        return new UserResponse(usuario.getId(), usuario.getUsername(), null, null);
    }

    public static UserResponse of (Usuario usuario, String token, String refreshToken) {
        return new UserResponse(usuario.getId(), usuario.getUsername(), token, refreshToken);
    }

}
