package com.example.CinematicMultiverse.files.dto;

import lombok.Builder;

@Builder
public record FileResponse(
        String id,
        String name,
        String uri,
        String type,
        long size
)
{}