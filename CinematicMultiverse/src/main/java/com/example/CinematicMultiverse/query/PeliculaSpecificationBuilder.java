package com.example.CinematicMultiverse.query;

import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.util.SearchCriteria;

import java.util.List;

public class PeliculaSpecificationBuilder  extends GenericSpecificationBuilder<Pelicula>{

    public PeliculaSpecificationBuilder(List<SearchCriteria> params) {
        super(params);
    }
}
