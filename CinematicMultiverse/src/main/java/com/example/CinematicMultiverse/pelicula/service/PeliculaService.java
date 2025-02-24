package com.example.CinematicMultiverse.pelicula.service;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.query.PeliculaSpecificationBuilder;
import com.example.CinematicMultiverse.user.dto.EditUsuarioCmd;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.model.UserRole;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.util.SearchCriteria;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;

    @Transactional
    public GetPeliculaDto getPeliculaDtoByTitulo(String titulo) {
        Pelicula pelicula = peliculaRepository.findByTitulo(titulo)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));

        Set<String> generos = pelicula.getGeneros().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        return new GetPeliculaDto(
                pelicula.getId(), pelicula.getTitulo(), pelicula.getSinopsis(),
                pelicula.getPuntuacion(), pelicula.getImagen(), pelicula.getDuracion(),
                pelicula.getAnio(), generos
        );
    }

    @Transactional
    public List<GetPeliculaDto> findAll() {
        List<Pelicula> result = peliculaRepository.findAll();

        if (result.isEmpty()) {
            throw new PeliculaNotFoundException("No existen películas");
        }

        return result.stream()
                .map(GetPeliculaDto::of)
                .toList();
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
    public Pelicula editPelicula(EditPeliculaCmd editPeliculaCmd, String titulo) {
        Pelicula pelicula = peliculaRepository.findByTitulo(titulo)
                .orElseThrow(() -> new PeliculaNotFoundException("No se encontraron películas con ese título"));

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

    public void deleteByTitulo(String titulo) {
        Pelicula pelicula = peliculaRepository.findByTitulo(titulo)
                .orElseThrow(() -> new PeliculaNotFoundException("Película no encontrada"));

        peliculaRepository.delete(pelicula);
    }

    public List<GetPeliculaDto> search(List<SearchCriteria> searchCriteriaList) {
        PeliculaSpecificationBuilder peliculaSpecificationBuilder = new PeliculaSpecificationBuilder(searchCriteriaList);
        Specification<Pelicula> where = peliculaSpecificationBuilder.build();


        List<Pelicula> peliculas = peliculaRepository.findAll(where);



        log.info("Cantidad de películas encontradas: " + peliculas.size());

        for (Pelicula p : peliculas) {
            log.info("Película encontrada -> Título: " + p.getTitulo() + ", Año: " + p.getAnio() + ", Puntuación: " + p.getPuntuacion());
        }

        return peliculas.stream()
                .map(GetPeliculaDto::of)
                .toList();

    }
}

