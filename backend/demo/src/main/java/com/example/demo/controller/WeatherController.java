package com.example.demo.controller;

import com.example.demo.dto.WeatherDTO;
import com.example.demo.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController (WeatherService weatherService) {
    this.weatherService = weatherService;
    }

    @PostMapping("/save/{uid}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> uploadWeatherData(@RequestBody List<WeatherDTO> weatherDTOList, @PathVariable String uid) {
        return weatherService.uploadWeatherData(weatherDTOList, uid);
    }

}
