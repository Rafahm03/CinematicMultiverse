package com.example.CinematicMultiverse.files.service.local;

import com.example.CinematicMultiverse.files.model.AbstractFileMetadata;
import com.example.CinematicMultiverse.files.model.FileMetadata;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class LocalFileMetadataImpl extends AbstractFileMetadata {

    public static FileMetadata of(String filename) {
        return LocalFileMetadataImpl.builder()
                .id(filename)
                .filename(filename)
                .build();
    }

}