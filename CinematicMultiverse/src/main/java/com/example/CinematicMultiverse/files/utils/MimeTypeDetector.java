package com.example.CinematicMultiverse.files.utils;

import com.example.CinematicMultiverse.files.model.AbstractFileMetadata;
import com.example.CinematicMultiverse.files.model.FileMetadata;
import lombok.experimental.SuperBuilder;
import org.springframework.core.io.Resource;

public interface MimeTypeDetector {

    String getMimeType(Resource resource);

}