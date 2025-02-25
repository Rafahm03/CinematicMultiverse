package com.example.CinematicMultiverse.favorito.error;

public class FavoritosVacioException extends RuntimeException {
    public FavoritosVacioException() {

        super("UPPS, tu lista de Favoritos está vacía, añade algunas de las películas que más te gusten.");
    }
}
