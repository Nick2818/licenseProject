package com.example.demo.service;

import com.example.demo.dto.WeatherDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface WeatherService {
    ResponseEntity<String> uploadWeatherData(List<WeatherDTO> weatherDTOList, String uid);
}
