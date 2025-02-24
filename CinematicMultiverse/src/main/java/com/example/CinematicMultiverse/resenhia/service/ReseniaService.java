package com.example.CinematicMultiverse.resenhia.service;

import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.resenhia.dto.CreateReseniaRequest;
import com.example.CinematicMultiverse.resenhia.model.Resenia;
import com.example.CinematicMultiverse.resenhia.repo.ReseniaRepository;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReseniaService {
    private final ReseniaRepository reseniaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;


    /*
    public Resenia crearResenia(UUID usuarioId, Long peliculaId, int puntuacion, String comentario) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pelicula pelicula = peliculaRepository.findById(peliculaId)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));

        Resenia resenia = Resenia.builder()
                .usuario(usuario)
                .pelicula(pelicula)
                .puntuacion(puntuacion)
                .comentario(comentario)
                .fechaPublicacion(LocalDateTime.now())
                .build();

        return reseniaRepository.save(resenia);
    }*/


    @Transactional
    public Resenia crearReview(String username, CreateReseniaRequest createReseniaRequest, UUID peliculaId) {

        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsername(username);
        Optional<Pelicula> optionalPelicula = peliculaRepository.findById(peliculaId);

        if (optionalUsuario.isEmpty()) {
            throw new UsuarioNotFoundException("Usuario no encontrado");
        }

        if (optionalPelicula.isEmpty()) {
            throw new PeliculaNotFoundException("Pelicula no encontrado");
        }

        Resenia resenia =  Resenia.builder()
                .usuario(optionalUsuario.get())
                .pelicula(optionalPelicula.get())
                .puntuacion(createReseniaRequest.puntuacion())
                .comentario(createReseniaRequest.comentario())
                .fechaPublicacion(LocalDateTime.now())
                .build();

        reseniaRepository.save(resenia);

        optionalUsuario.get().addResenia(resenia);

        usuarioRepository.save(optionalUsuario.get());

        return resenia;
    }


}
