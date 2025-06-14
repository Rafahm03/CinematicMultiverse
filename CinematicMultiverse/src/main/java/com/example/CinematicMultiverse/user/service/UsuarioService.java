package com.example.CinematicMultiverse.user.service;

import com.example.CinematicMultiverse.user.dto.CreateUserRequest;
import com.example.CinematicMultiverse.user.dto.EditUsuarioCmd;
import com.example.CinematicMultiverse.user.dto.GetUsuarioDto;
import com.example.CinematicMultiverse.user.error.ActivationExpiredException;
import com.example.CinematicMultiverse.user.error.UnauthorizedActionException;
import com.example.CinematicMultiverse.user.error.UsuarioNotFoundException;
import com.example.CinematicMultiverse.user.model.UserRole;
import com.example.CinematicMultiverse.user.model.Usuario;
import com.example.CinematicMultiverse.user.repo.UsuarioRepository;
import com.example.CinematicMultiverse.util.MailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashSet;


@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;


    @Value("${activation.duration}")
    private int activationDuration;

    public Usuario createUser(CreateUserRequest createUserRequest) {

        Usuario usuario = Usuario.builder()
                .username(createUserRequest.username())
                .password(passwordEncoder.encode(createUserRequest.password()))
                .email(createUserRequest.email())
                .roles(Set.of(UserRole.USER))
                .activationToken(generateRandomActivationCode()) // Genera un token de activación
                .build();

        usuarioRepository.save(usuario);

        String emailContent = "<p>Gracias por registrarte. Usa este código para activar tu cuenta: <strong>"
                + usuario.getActivationToken() + "</strong></p>";

        mailService.sendMail(createUserRequest.email(), "Activación de cuenta", emailContent);

        return usuario;
    }


    public String generateRandomActivationCode() {
        return UUID.randomUUID().toString();
    }

    public Usuario activateAccount(String token) {

        return usuarioRepository.findByActivationToken(token)
                .filter(user -> ChronoUnit.MINUTES.between(Instant.now(), user.getCreatedAt()) - activationDuration < 0)
                .map(user -> {
                    user.setEnabled(true);
                    user.setActivationToken(null);
                    return usuarioRepository.save(user);
                })
                .orElseThrow(() -> new ActivationExpiredException("El código de activación no existe o ha caducado"));
    }

    @Transactional
    public Page<GetUsuarioDto> findAll(Pageable pageable){
        Page<Usuario> result = usuarioRepository.findAll(pageable);
        if(result.isEmpty())
            throw new UsuarioNotFoundException("No hay usuarios con esos criterios de busqueda");
        return result.map(GetUsuarioDto::of);
    }

    public Usuario findByUsername(String username) {
        Optional<Usuario> result = usuarioRepository.findByUsername(username);
        if (result.isEmpty()) {
            throw new UsuarioNotFoundException("No se encontraron usuarios con ese username");
        }
        return result.get();
    }

    public void deleteByUsername(String username) {
        Optional<Usuario> result = usuarioRepository.findByUsername(username);
        if (result.isEmpty()) {
            throw new UsuarioNotFoundException("No se encontraron usuarios con ese username");
        }
        Usuario usuario = result.get();

        if (usuario.getRoles().contains(UserRole.ADMIN)) {
            throw new UnauthorizedActionException("No se puede eliminar un usuario con rol de Admin");
        }
        usuarioRepository.delete(usuario);

    }

    public Usuario editarProfile(EditUsuarioCmd editUsuarioCmd, Usuario loggedUser) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsername(loggedUser.getUsername());

        if (optionalUsuario.isEmpty()) {
            throw new UsuarioNotFoundException("No se encontraron usuarios con ese username");
        }

        Usuario usuario = optionalUsuario.get();
        usuario.setUsername(editUsuarioCmd.username());
        usuario.setNombre(editUsuarioCmd.nombre());
        usuario.setEmail(editUsuarioCmd.email());

        return usuarioRepository.save(usuario);
    }


    @Transactional
    public GetUsuarioDto editarUsuarioPorAdmin(EditUsuarioCmd editUsuarioCmd, String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsuarioNotFoundException("No se encontraron usuarios con ese username: " + username));

        usuario.setUsername(editUsuarioCmd.username());
        usuario.setEmail(editUsuarioCmd.email());
        usuario.setNombre(editUsuarioCmd.nombre());

        if (editUsuarioCmd.roles() != null && !editUsuarioCmd.roles().isEmpty()) {
            Set<UserRole> nuevosRoles = editUsuarioCmd.roles().stream()
                    .map(String::toUpperCase)
                    .map(UserRole::valueOf)
                    .collect(Collectors.toCollection(HashSet::new));
            usuario.setRoles(nuevosRoles);
        } else {

        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return GetUsuarioDto.of(usuarioActualizado);
    }
}
