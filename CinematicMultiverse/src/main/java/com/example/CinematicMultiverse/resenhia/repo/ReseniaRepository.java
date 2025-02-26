package com.example.CinematicMultiverse.resenhia.repo;

import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.resenhia.model.Resenia;
import com.example.CinematicMultiverse.user.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReseniaRepository extends JpaRepository<Resenia, UUID> {

    Page<Resenia> findAllByUsuario(Usuario usuario, Pageable pageable);
    Page<Resenia> findAllByPelicula_Titulo(String tituloPelicula, Pageable pageable);
    Optional<Resenia> findByUsuarioAndPelicula(Usuario usuario, Pelicula pelicula);

}
