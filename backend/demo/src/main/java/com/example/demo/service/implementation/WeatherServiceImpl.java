package com.example.demo.service.implementation;

import com.example.demo.dto.WeatherDTO;
import com.example.demo.model.WeatherEntity;
import com.example.demo.repository.WeatherRepository;
import com.example.demo.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WeatherServiceImpl implements WeatherService {

    public final WeatherRepository weatherRepository;

    public WeatherServiceImpl(WeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    @Override
    @Transactional
    public ResponseEntity<String> uploadWeatherData(List<WeatherDTO> weatherDTOList, String uid) {
        weatherRepository.deleteAllByUid(uid);

        weatherDTOList.forEach(weatherDTO -> {
            WeatherEntity weatherEntity = new WeatherEntity();
            weatherDTO.setUid(uid);
            weatherEntity.setUid(uid);
            weatherEntity.setDate(weatherDTO.getDate());
            weatherEntity.setPrecipitationSum(weatherDTO.getPrecipitationSum());
            weatherEntity.setLowTemp(weatherDTO.getLowTemp());
            weatherEntity.setHighTemp(weatherDTO.getHighTemp());
            weatherEntity.setPrecipitationProbability(weatherDTO.getPrecipitationProbability());
            weatherEntity.setWindSpeed(weatherDTO.getWindSpeed());

            weatherRepository.save(weatherEntity);
        });

        return ResponseEntity.ok("Data received successfully");
    }
}
