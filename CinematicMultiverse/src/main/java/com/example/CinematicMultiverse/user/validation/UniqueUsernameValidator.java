package com.example.CinematicMultiverse.user.validation;

import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public boolean isValid(String s, ConstraintValidatorContext context) {
        if (s == null || s.trim().isEmpty()) {
            return true;
        }

        return !usuarioRepository.existsByEmail(s);
    }
}
