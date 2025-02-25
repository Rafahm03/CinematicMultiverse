package com.example.CinematicMultiverse.favorito.service;

import com.example.CinematicMultiverse.favorito.dto.EditFavoritoDto;
import com.example.CinematicMultiverse.favorito.error.FavoritosVacioException;
import com.example.CinematicMultiverse.favorito.model.Favorito;
import com.example.CinematicMultiverse.favorito.repo.FavoritoRepository;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;
    private final FavoritoRepository favoritoRepository;

    public void addPeliculaToFavoritos(String username, EditFavoritoDto editFavoritoDto) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pelicula pelicula = peliculaRepository.findByTitulo(editFavoritoDto.titulo())
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));

        if (favoritoRepository.findByUsuarioAndPelicula(usuario, pelicula).isPresent()) {
            throw new RuntimeException("La película ya está en favoritos");
        }

        Favorito favorito = Favorito.builder()
                .usuario(usuario)
                .pelicula(pelicula)
                .build();

        favoritoRepository.save(favorito);
    }

    @Transactional
    public List<GetPeliculaDto> mostrarListaFavoritos(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        List<GetPeliculaDto> favoritos = favoritoRepository.findByUsuario(usuario)
                .stream()
                .map(favorito -> GetPeliculaDto.of(favorito.getPelicula()))
                .collect(Collectors.toList());


        if (favoritos.isEmpty()) {
            throw new FavoritosVacioException();
        }


        return favoritos;
    }





}
