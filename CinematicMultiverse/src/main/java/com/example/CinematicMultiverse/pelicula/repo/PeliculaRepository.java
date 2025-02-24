package com.example.CinematicMultiverse.pelicula.repo;

import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.user.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.security.core.parameters.P;

import java.util.Optional;
import java.util.UUID;

public interface PeliculaRepository extends JpaRepository<Pelicula, UUID>, JpaSpecificationExecutor<Pelicula> {
    Optional<Pelicula> findByTitulo(String titulo);
    Optional<Pelicula> findById(UUID peliculaId);

}
