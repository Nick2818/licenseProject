package com.example.demo.controller;

import com.example.demo.service.WorksService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
@RequestMapping("/api/works")
public class WorksController {

    private final WorksService worksService;

    public WorksController (WorksService worksService) {
        this.worksService = worksService;
    }


    @RequestMapping("/getLanLon/{uid}/{name}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Double>> getLatLon(@PathVariable String uid, @PathVariable String name) {
        return worksService.getLatLon(uid, name);
    }

    @RequestMapping("/get/{uid}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, List<String>>> getWorks(@PathVariable String uid) {
        return worksService.getWorks(uid);
    }
}
