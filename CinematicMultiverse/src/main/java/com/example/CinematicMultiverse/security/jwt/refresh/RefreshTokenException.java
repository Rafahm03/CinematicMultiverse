package com.example.CinematicMultiverse.security.jwt.refresh;

import com.example.CinematicMultiverse.security.exceptionhandling.JwtException;

public class RefreshTokenException extends JwtException {
    public RefreshTokenException(String message) {
        super(message);
    }
}
