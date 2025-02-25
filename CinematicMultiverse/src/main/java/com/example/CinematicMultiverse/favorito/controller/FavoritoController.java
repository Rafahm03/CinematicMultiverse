package com.example.CinematicMultiverse.favorito.controller;

import com.example.CinematicMultiverse.favorito.dto.EditFavoritoDto;
import com.example.CinematicMultiverse.favorito.service.FavoritoService;
import com.example.CinematicMultiverse.pelicula.dto.GetPeliculaDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
@RequiredArgsConstructor
@Tag(name = "Favoritos", description = "Endpoints para la gestión de la lista de favoritos de los usuarios")
public class FavoritoController {
    private final FavoritoService favoritoService;

    @Operation(summary = "Añadir una película a favoritos", description = "Permite a un usuario añadir una película a su lista de favoritos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Película añadida con éxito"),
            @ApiResponse(responseCode = "404", description = "Usuario o película no encontrados"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud")
    })
    @PostMapping("/add")
    public ResponseEntity<String> addPeliculaToFavoritos(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody EditFavoritoDto editFavoritoDto) {
        String username = userDetails.getUsername();
        favoritoService.addPeliculaToFavoritos(username, editFavoritoDto);
        return ResponseEntity.ok("Película añadida a favoritos");
    }

    @Operation(summary = "Obtener la lista de favoritos", description = "Devuelve la lista de películas favoritas del usuario autenticado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de favoritos obtenida con éxito"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "400", description = "Lista vacía o error en la solicitud")
    })
    @GetMapping("/list")
    public ResponseEntity<List<GetPeliculaDto>> mostrarListaFavoritos(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return ResponseEntity.ok(favoritoService.mostrarListaFavoritos(username));
    }




}
