package com.example.CinematicMultiverse.pelicula.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pelicula {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String sinopsis;

    private double puntuacion;

    private String imagen;

    private int duracion;

    private int anio;

    @ElementCollection(targetClass = Genero.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "pelicula_genero", joinColumns = @JoinColumn(name = "pelicula_id"))
    @Column(name = "genero")
    private Set<Genero> generos;

}
