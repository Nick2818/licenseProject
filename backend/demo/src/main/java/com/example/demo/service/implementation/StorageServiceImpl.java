package com.example.demo.service.implementation;

import com.example.demo.service.StorageService;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.FirebaseApp;
import org.hibernate.sql.ast.tree.expression.Over;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class StorageServiceImpl implements StorageService {

    private final Storage storage;

    public StorageServiceImpl() {
        this.storage = StorageOptions.getDefaultInstance().getService();
    }
    @Override
    public void uploadImage(File file, String filename, Map<String, String> metadata) throws IOException {
        String bucketName = FirebaseApp.getInstance().getOptions().getStorageBucket();
        BlobId blobId = BlobId.of(bucketName, filename);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType("media")
                .setMetadata(metadata)
                .build();

        storage.create(blobInfo, Files.readAllBytes(file.toPath()));
    }

    @Override
    public File convertToFile(MultipartFile multipartFile, String fileName) throws FileNotFoundException {
        File tempFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)){
            fos.write(multipartFile.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return tempFile;
    }

    @Override
    public String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }

    @Override
    public String upload(MultipartFile multipartFile, HashMap<String, String> metadata) throws IOException {
        try {
            String fileName = multipartFile.getOriginalFilename();
            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));

            File file = this.convertToFile(multipartFile, fileName);
            this.uploadImage(file, fileName, metadata);

            return "Image uploaded successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "[StorageService] Something went wrong when uploading image!";
        }
    }
}
