package com.example.CinematicMultiverse.pelicula.service;

import com.example.CinematicMultiverse.pelicula.dto.EditPeliculaCmd;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import com.example.CinematicMultiverse.pelicula.error.PeliculaNotFoundException;
import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.pelicula.repo.PeliculaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
        Set<Genero> generos = Arrays.stream(editPeliculaCmd.genero().split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .map(Genero::valueOf)
                .collect(Collectors.toSet());

        return peliculaRepository.save(Pelicula.builder()
                .titulo(editPeliculaCmd.titulo())
                .sinopsis(editPeliculaCmd.sinopsis())
                .puntuacion(editPeliculaCmd.puntuacion())
                .imagen(editPeliculaCmd.imagen())
                .duracion(editPeliculaCmd.duracion())
                .anio(editPeliculaCmd.anio())
                .generos(generos)
                .build());
    }

}
