package com.example.demo.service;

import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

public interface WorksService {

    ResponseEntity<List<Double>> getLatLon(String uid, String name);
    ResponseEntity<Map<String, List<String>>> getWorks(String uid);
}
