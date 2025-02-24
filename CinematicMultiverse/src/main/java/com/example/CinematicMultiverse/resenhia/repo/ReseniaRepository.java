package com.example.CinematicMultiverse.resenhia.repo;

import com.example.CinematicMultiverse.resenhia.model.Resenia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReseniaRepository extends JpaRepository<Resenia, UUID> {

    List<Resenia> findByPeliculaId(UUID peliculaId);
    List<Resenia> findByUsuarioId(UUID usuarioId);
}
