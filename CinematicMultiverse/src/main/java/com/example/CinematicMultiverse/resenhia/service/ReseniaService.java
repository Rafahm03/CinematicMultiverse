package com.example.CinematicMultiverse.resenhia.service;

import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.resenhia.dto.CreateReseniaRequest;
import com.example.CinematicMultiverse.resenhia.dto.EditReseniaCmd;
import com.example.CinematicMultiverse.resenhia.dto.GetReseniaDto;
import com.example.CinematicMultiverse.resenhia.error.ReseniaNotFoundException;
import com.example.CinematicMultiverse.resenhia.error.ReseniaYaExiste;
import com.example.CinematicMultiverse.resenhia.error.UnauthorizedAccessException;
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

    @Transactional
    public Resenia crearReview(String username, CreateReseniaRequest createReseniaRequest, String tituloPelicula) {

        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsername(username);
        Optional<Pelicula> optionalPelicula = peliculaRepository.findByTitulo(tituloPelicula);

        if (optionalUsuario.isEmpty()) {
            throw new UsuarioNotFoundException("Usuario no encontrado");
        }

        if (optionalPelicula.isEmpty()) {
            throw new PeliculaNotFoundException("Pelicula no encontrada");
        }

        Optional<Resenia> existingReview = reseniaRepository.findByUsuarioAndPelicula(optionalUsuario.get(), optionalPelicula.get());

        if (existingReview.isPresent()) {
            throw new ReseniaYaExiste("El usuario ya ha dejado una reseña para esta película");
        }

        // Crear la nueva reseña
        Resenia resenia = Resenia.builder()
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


    @Transactional
    public List<GetReseniaDto> findByUsername(String username) {
        List<Resenia> result = reseniaRepository.findByUsuarioUsername(username);

        if (result.isEmpty()) {
            throw new ReseniaNotFoundException("No existen reseñas para el usuario con ese username");
        }

        return result.stream()
                .map(GetReseniaDto::of)
                .toList();
    }


    @Transactional
    public List<GetReseniaDto> findReviewsByTitulo(String tituloPelicula) {
        List<Resenia> result = reseniaRepository.findByPelicula_Titulo(tituloPelicula);

        if (result.isEmpty()) {
            throw new ReseniaNotFoundException("No existen reseñas para la película con título: " + tituloPelicula);
        }

        return result.stream()
                .map(GetReseniaDto::of)
                .toList();
    }

    @Transactional
    public Resenia editarResenia(UUID id, EditReseniaCmd editReseniaCmd, String username) {
        Resenia resenia = reseniaRepository.findById(id).orElseThrow(() -> new ReseniaNotFoundException("Reseña no encontrada"));

        if (!resenia.getUsuario().getUsername().equals(username)) {
            throw new UnauthorizedAccessException("No tienes permiso para editar esta reseña");
        }

        resenia.setComentario(editReseniaCmd.comentario());
        resenia.setPuntuacion(editReseniaCmd.puntuacion());
        resenia.setEdit(true);

        return reseniaRepository.save(resenia);
    }

    @Transactional
    public void eliminarResenia(UUID id, String username) {
        Resenia resenia = reseniaRepository.findById(id)
                .orElseThrow(() -> new ReseniaNotFoundException("Reseña no encontrada"));

        if (!resenia.getUsuario().getUsername().equals(username)) {
            throw new UnauthorizedAccessException("No tienes permiso para eliminar esta reseña");
        }

        reseniaRepository.delete(resenia);
    }





}
