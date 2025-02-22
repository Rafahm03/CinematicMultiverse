package com.example.CinematicMultiverse.pelicula.repo;

import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
}
