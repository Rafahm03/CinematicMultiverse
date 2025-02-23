package com.example.CinematicMultiverse.resenhia.model;

import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.user.model.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resenia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "pelicula_id", nullable = false)
    private Pelicula pelicula;

    @Column(nullable = false)
    private int puntuacion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    private LocalDateTime fechaPublicacion;

    @PrePersist
    protected void onCreate() {
        fechaPublicacion = LocalDateTime.now();
    }
}
