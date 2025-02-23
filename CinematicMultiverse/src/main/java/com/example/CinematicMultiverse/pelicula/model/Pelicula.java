package com.example.CinematicMultiverse.pelicula.model;


import com.example.CinematicMultiverse.resenhia.model.Resenia;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
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

    @OneToMany(mappedBy = "pelicula",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    @ToString.Exclude
    private List<Resenia> resenias = new ArrayList<>();

    public void addResenia(Resenia resenia) {
        resenia.setPelicula(this);
        this.resenias.add(resenia);
    }

    public void removeResenia(Resenia resenia) {
        resenias.remove(resenia);
    }

    @ElementCollection(targetClass = Genero.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "pelicula_genero", joinColumns = @JoinColumn(name = "pelicula_id"))
    @Column(name = "genero")
    private Set<Genero> generos;

}