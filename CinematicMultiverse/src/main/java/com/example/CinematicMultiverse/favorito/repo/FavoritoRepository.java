package com.example.CinematicMultiverse.favorito.repo;

import com.example.CinematicMultiverse.favorito.model.Favorito;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.user.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, UUID> {
    Optional<Favorito> findByUsuarioAndPelicula(Usuario usuario, Pelicula pelicula);
    List<Favorito> findByUsuario(Usuario usuario);
}
