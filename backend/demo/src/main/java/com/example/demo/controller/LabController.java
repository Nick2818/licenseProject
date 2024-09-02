package com.example.demo.controller;

import com.example.demo.service.LabService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/lab")
public class LabController {

    private final LabService labService;

    public LabController (LabService labService) {
        this.labService = labService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("description") String description, @RequestParam("userID") String uid, @RequestParam("zoneName") String zoneName, @RequestParam("title") String title, @RequestParam("date") String date) {
       return labService.uploadFile(file, description, uid, zoneName, title, date);
    }
}
