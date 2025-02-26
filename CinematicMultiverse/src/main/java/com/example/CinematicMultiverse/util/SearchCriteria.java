package com.example.CinematicMultiverse.util;

public record SearchCriteria(
        String key,
        String operation,
        Object value
) {
    public SearchCriteria(String key, String operation, String value) {
        this(key, operation, parseValue(value));
    }

    private static Object parseValue(String value) {

        if (value.contains(".")) {
            return Double.parseDouble(value);
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return value;
        }
    }
}
