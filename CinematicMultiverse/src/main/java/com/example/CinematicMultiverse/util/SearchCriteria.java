package com.example.CinematicMultiverse.util;

public record SearchCriteria(
        String key,
        String operation,
        Object value
) {
}