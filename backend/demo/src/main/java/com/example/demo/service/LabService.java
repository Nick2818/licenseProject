package com.example.demo.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface LabService {

    ResponseEntity<String> uploadFile(MultipartFile file, String description, String uid, String zoneName, String title, String date);
}
