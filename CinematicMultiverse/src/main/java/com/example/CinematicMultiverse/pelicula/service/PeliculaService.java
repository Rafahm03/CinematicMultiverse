package com.example.CinematicMultiverse.pelicula.service;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.user.dto.EditUsuarioCmd;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.model.UserRole;
import com.example.CinematicMultiverse.user.model.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;

    @Transactional
    public GetPeliculaDto getPeliculaDtoById(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("Pelicula no encontrada"));
        Set<String> generos = pelicula.getGeneros().stream().map(Enum::name).collect(Collectors.toSet());
        return new GetPeliculaDto(pelicula.getId(), pelicula.getTitulo(), pelicula.getSinopsis(),
                pelicula.getPuntuacion(), pelicula.getImagen(), pelicula.getDuracion(),
                pelicula.getAnio(), generos);
    }



    @Transactional
    public List<GetPeliculaDto  > findAll(){

        List<Pelicula> result = peliculaRepository.findAll();

        List<GetPeliculaDto> result2 = result.stream().map(GetPeliculaDto::of).toList();

        if (result2.isEmpty()){
            throw new PeliculaNotFoundException("No existen películas");
        }
        return result2;
    }



    public Pelicula save(EditPeliculaCmd editPeliculaCmd) {
        Set<Genero> generos = editPeliculaCmd.generos().stream()
                .map(String::toUpperCase)
                .map(Genero::valueOf)
                .collect(Collectors.toSet());

        Pelicula pelicula = Pelicula.builder()
                .titulo(editPeliculaCmd.titulo())
                .sinopsis(editPeliculaCmd.sinopsis())
                .puntuacion(editPeliculaCmd.puntuacion())
                .imagen(editPeliculaCmd.imagen())
                .duracion(editPeliculaCmd.duracion())
                .anio(editPeliculaCmd.anio())
                .generos(generos)
                .build();

        return peliculaRepository.save(pelicula);
    }



    @Transactional
    public Pelicula editPelicula(EditPeliculaCmd editPeliculaCmd, Long id) {
        Optional<Pelicula> optionalPelicula = peliculaRepository.findById(id);

        if (optionalPelicula.isEmpty()) {
            throw new PeliculaNotFoundException("No se encontraron películas con ese id");
        }

        Pelicula pelicula = optionalPelicula.get();

        pelicula.setTitulo(editPeliculaCmd.titulo());
        pelicula.setDuracion(editPeliculaCmd.duracion());
        pelicula.setAnio(editPeliculaCmd.anio());
        pelicula.setImagen(editPeliculaCmd.imagen());
        pelicula.setSinopsis(editPeliculaCmd.sinopsis());
        pelicula.setPuntuacion(editPeliculaCmd.puntuacion());

        if (editPeliculaCmd.generos() != null && !editPeliculaCmd.generos().isEmpty()) {
            Set<Genero> generos = new HashSet<>();
            for (String generoStr : editPeliculaCmd.generos()) {
                Genero genero = Genero.valueOf(generoStr.toUpperCase());
                generos.add(genero);
            }
            pelicula.setGeneros(generos);
        }

        return peliculaRepository.save(pelicula);
    }

    public void deleteById(Long id) {
        Optional<Pelicula> peliculaOptional = peliculaRepository.findById(id);

        if (peliculaOptional.isEmpty()) {
            throw new UsuarioNotFoundException("Pelicula no encontrada");
        }

        peliculaRepository.deleteById(id);
    }


}
