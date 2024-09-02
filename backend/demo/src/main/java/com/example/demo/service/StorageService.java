package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public interface StorageService {

    void uploadImage(File file, String filename, Map<String, String> metadata) throws IOException;

    File convertToFile(MultipartFile multipartFile, String fileName) throws FileNotFoundException;

    String getExtension(String fileName);

    String upload(MultipartFile multipartFile, HashMap<String, String> metadata) throws IOException;
}
