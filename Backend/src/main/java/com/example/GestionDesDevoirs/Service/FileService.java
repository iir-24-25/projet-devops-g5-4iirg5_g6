package com.example.GestionDesDevoirs.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Save files and return file paths
    public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        if (files != null && !files.isEmpty()) {
            return files.stream()
                    .map(file -> {
                        try {
                            String fileName = file.getOriginalFilename();
                            Path path = Paths.get(uploadDir + File.separator + fileName);
                            Files.write(path, file.getBytes());
                            return path.toString();
                        } catch (IOException e) {
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(filePath -> filePath != null)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}
