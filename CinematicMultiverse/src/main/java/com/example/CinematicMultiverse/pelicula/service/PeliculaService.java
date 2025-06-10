package com.example.CinematicMultiverse.pelicula.service;

import com.example.CinematicMultiverse.files.model.FileMetadata;
import com.example.CinematicMultiverse.files.service.StorageService;
import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.error.PeliculaAlreadyExistsException;
import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import com.example.CinematicMultiverse.query.PeliculaSpecificationBuilder;
import com.example.CinematicMultiverse.util.SearchCriteria;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final StorageService storageService;


    @Transactional
    public GetPeliculaDto getPeliculaDtoByTitulo(String titulo) {
        Pelicula pelicula = peliculaRepository.findByTituloContainingIgnoreCase(titulo)
                .orElseThrow(() -> new PeliculaNotFoundException("Película no encontrada"));

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
    public Page<GetPeliculaDto> findAll(Pageable pageable) {
        Page<Pelicula> result = peliculaRepository.findAll(pageable);

        if (result.isEmpty()) {
            throw new PeliculaNotFoundException("No existen películas");
        }

        return result.map(GetPeliculaDto::of);
    }

    public Pelicula save(EditPeliculaCmd editPeliculaCmd, MultipartFile file) {
        peliculaRepository.findByTitulo(editPeliculaCmd.titulo())
                .ifPresent(p -> {
                    throw new PeliculaAlreadyExistsException("La película con el título '" + editPeliculaCmd.titulo() + "' ya existe");
                });
        FileMetadata fileMetadata = storageService.store(file);

        String filename = fileMetadata.getFilename();
        String imageUrl = this.getImageUrl(filename);


        Set<Genero> generos = editPeliculaCmd.generos().stream()
                .map(String::toUpperCase)
                .map(Genero::valueOf)
                .collect(Collectors.toSet());

        Pelicula pelicula = Pelicula.builder()
                .titulo(editPeliculaCmd.titulo())
                .sinopsis(editPeliculaCmd.sinopsis())
                .puntuacion(editPeliculaCmd.puntuacion())
                .imagen(imageUrl)
                .duracion(editPeliculaCmd.duracion())
                .anio(editPeliculaCmd.anio())
                .generos(generos)
                .build();

        return peliculaRepository.save(pelicula);
    }


public String getImageUrl(String filename) {
    return ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/download/")
            .path(filename)
            .toUriString();
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

    @Transactional
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

