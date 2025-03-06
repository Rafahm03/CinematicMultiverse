package com.example.CinematicMultiverse;

import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.resenhia.dto.CreateReseniaRequest;
import com.example.CinematicMultiverse.resenhia.dto.EditReseniaCmd;
import com.example.CinematicMultiverse.resenhia.dto.GetReseniaDto;
import com.example.CinematicMultiverse.resenhia.error.ReseniaNotFoundException;
import com.example.CinematicMultiverse.resenhia.error.ReseniaYaExiste;
import com.example.CinematicMultiverse.resenhia.model.Resenia;
import com.example.CinematicMultiverse.resenhia.repo.ReseniaRepository;
import com.example.CinematicMultiverse.resenhia.service.ReseniaService;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReseniaServiceTest {

    @InjectMocks
    private ReseniaService reseniaService;

    @Mock
    private ReseniaRepository reseniaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PeliculaRepository peliculaRepository;

    private Usuario usuario;
    private Pelicula pelicula;
    private Resenia resenia;
    private UUID reseniaId;
    private CreateReseniaRequest createReseniaRequest;
    private EditReseniaCmd editReseniaCmd;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setUsername("testUser");

        pelicula = new Pelicula();
        pelicula.setId(UUID.randomUUID());
        pelicula.setTitulo("Test Movie");

        reseniaId = UUID.randomUUID();

        resenia = Resenia.builder()
                .id(reseniaId)
                .usuario(usuario)
                .pelicula(pelicula)
                .puntuacion(8.5)
                .comentario("Gran película")
                .fechaPublicacion(LocalDateTime.now())
                .isEdit(false)
                .build();

        createReseniaRequest = new CreateReseniaRequest(
                usuario.getId(),
                pelicula.getTitulo(),
                8.5,
                "Gran película",
                LocalDate.now()
        );

        editReseniaCmd = new EditReseniaCmd("Comentario editado", 9.0);
    }

    @Test
    void testCrearReview_Exito() {
        when(usuarioRepository.findByUsername("testUser")).thenReturn(Optional.of(usuario));
        when(peliculaRepository.findByTitulo("Test Movie")).thenReturn(Optional.of(pelicula));
        when(reseniaRepository.findByUsuarioAndPelicula(usuario, pelicula)).thenReturn(Optional.empty());
        when(reseniaRepository.save(any(Resenia.class))).thenReturn(resenia);

        Resenia result = reseniaService.crearReview("testUser", createReseniaRequest, "Test Movie");

        assertNotNull(result);
        assertEquals(8.5, result.getPuntuacion());
        assertEquals("Gran película", result.getComentario());

        verify(reseniaRepository).save(any(Resenia.class));
    }

    @Test
    void testCrearReview_UsuarioNoEncontrado() {
        when(usuarioRepository.findByUsername("testUser")).thenReturn(Optional.empty());

        assertThrows(UsuarioNotFoundException.class, () ->
                reseniaService.crearReview("testUser", createReseniaRequest, "Test Movie"));

        verify(usuarioRepository).findByUsername("testUser");
        verify(reseniaRepository, never()).save(any());
    }

    @Test
    void testCrearReview_PeliculaNoEncontrada() {
        when(usuarioRepository.findByUsername("testUser")).thenReturn(Optional.of(usuario));
        when(peliculaRepository.findByTitulo("Test Movie")).thenReturn(Optional.empty());

        assertThrows(PeliculaNotFoundException.class, () ->
                reseniaService.crearReview("testUser", createReseniaRequest, "Test Movie"));

        verify(peliculaRepository).findByTitulo("Test Movie");
        verify(reseniaRepository, never()).save(any());
    }

    @Test
    void testCrearReview_ReseniaYaExiste() {
        when(usuarioRepository.findByUsername("testUser")).thenReturn(Optional.of(usuario));
        when(peliculaRepository.findByTitulo("Test Movie")).thenReturn(Optional.of(pelicula));
        when(reseniaRepository.findByUsuarioAndPelicula(usuario, pelicula)).thenReturn(Optional.of(resenia));

        assertThrows(ReseniaYaExiste.class, () ->
                reseniaService.crearReview("testUser", createReseniaRequest, "Test Movie"));

        verify(reseniaRepository, never()).save(any());
    }

    @Test
    void testFindByUsername_Exito() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<Resenia> pageMock = new PageImpl<>(List.of(resenia));

        when(usuarioRepository.findByUsername("testUser")).thenReturn(Optional.of(usuario));
        when(reseniaRepository.findAllByUsuario(usuario, pageable)).thenReturn(pageMock);

        Page<GetReseniaDto> result = reseniaService.findByUsername("testUser", pageable);

        assertFalse(result.isEmpty());
        assertEquals(1, result.getTotalElements());
        assertEquals("testUser", result.getContent().get(0).username());

        verify(reseniaRepository).findAllByUsuario(usuario, pageable);
    }

    @Test
    void testFindByUsername_UsuarioNoEncontrado() {
        Pageable pageable = PageRequest.of(0, 5);
        when(usuarioRepository.findByUsername("testUser")).thenReturn(Optional.empty());

        assertThrows(UsuarioNotFoundException.class, () ->
                reseniaService.findByUsername("testUser", pageable));

        verify(reseniaRepository, never()).findAllByUsuario(any(), any());
    }

    @Test
    void testEditarResenia_Exito() {
        when(reseniaRepository.findById(reseniaId)).thenReturn(Optional.of(resenia));
        when(reseniaRepository.save(any(Resenia.class))).thenReturn(resenia); // Asegurar que se guarda correctamente

        Resenia resultado = reseniaService.editarResenia(reseniaId, editReseniaCmd, "testUser");

        assertNotNull(resultado, "El resultado no debería ser null");

        System.out.println("Resultado: " + resultado);

        assertEquals("Comentario editado", resultado.getComentario());
        assertEquals(9.0, resultado.getPuntuacion());
        assertTrue(resultado.isEdit());

        verify(reseniaRepository).save(any(Resenia.class));
    }


    @Test
    void testEditarResenia_NoEncontrada() {
        when(reseniaRepository.findById(reseniaId)).thenReturn(Optional.empty());

        assertThrows(ReseniaNotFoundException.class, () ->
                reseniaService.editarResenia(reseniaId, editReseniaCmd, "testUser"));

        verify(reseniaRepository, never()).save(any());
    }

    @Test
    void testEliminarResenia_Exito() {
        when(reseniaRepository.findById(reseniaId)).thenReturn(Optional.of(resenia));

        reseniaService.eliminarResenia(reseniaId, "testUser");

        verify(reseniaRepository).delete(resenia);
    }

    @Test
    void testEliminarResenia_NoEncontrada() {
        when(reseniaRepository.findById(reseniaId)).thenReturn(Optional.empty());

        assertThrows(ReseniaNotFoundException.class, () ->
                reseniaService.eliminarResenia(reseniaId, "testUser"));

        verify(reseniaRepository, never()).delete(any());
    }

}