package com.example.CinematicMultiverse.user.repo;

import com.example.CinematicMultiverse.user.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID>, JpaSpecificationExecutor<Usuario> {
    Optional<Usuario> findFirstByUsername(String username);

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByActivationToken(String activationToken);

    boolean existsByUsername(String username);

}
