package com.example.demo.service.implementation;

import com.example.demo.model.WeatherEntity;
import com.example.demo.model.WorksEntity;
import com.example.demo.repository.WeatherRepository;
import com.example.demo.repository.WorksRepository;
import com.example.demo.service.WorksService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WorksServiceImpl implements WorksService {

    public final WorksRepository worksRepository;
    public final WeatherRepository weatherRepository;

    public WorksServiceImpl(WorksRepository worksRepository, WeatherRepository weatherRepository) {
        this.worksRepository = worksRepository;
        this.weatherRepository = weatherRepository;
    }

    @Override
    public ResponseEntity<List<Double>> getLatLon(String uid, String name) {
        List<Double> coords = new ArrayList<>();

        WorksEntity we = worksRepository.findByUidAndName(uid,name);

        coords.add(we.getLat());
        coords.add(we.getLon());

        return ResponseEntity.ok(coords);
    }

    @Override
    public ResponseEntity<Map<String, List<String>>> getWorks(String uid) {
        Map<String, List<String>> recommendetionsMap = new HashMap<>();


        List<WeatherEntity> weatherData = new ArrayList<>((Collection) weatherRepository.findByUid(uid));

        // Temperature Recommendations
        for ( WeatherEntity we: weatherData) {

            List<String> recommendations = new ArrayList<>();

            if (we.getHighTemp() > 30 || we.getLowTemp() > 30) {
                recommendations.add("High temperature detected. Consider the following actions:\n");
                recommendations.add("- Irrigation to prevent heat stress.\n");
                recommendations.add("- Use shade nets to reduce heat exposure.\n");

            } else if (we.getLowTemp() < 10 || we.getHighTemp() < 10) {
                recommendations.add("Low temperature detected. Consider the following actions:\n");
                recommendations.add("- Use frost blankets or heaters to protect crops.\n");
                recommendations.add("- Delay planting sensitive crops until temperatures rise.\n");
            } else {
                recommendations.add("Temperature range is OK.\n");
            }

            // Precipitation Sum Recommendations
            if (we.getPrecipitationSum() > 50) {
                recommendations.add("High precipitation sum detected. Consider the following actions:\n");
                recommendations.add("- Activate drainage systems to remove excess water.\n");
                recommendations.add("- Implement measures to prevent soil erosion.\n");
            } else if (we.getPrecipitationSum() < 10) {
                recommendations.add("Low precipitation sum detected. Consider the following actions:\n");
                recommendations.add("- Apply mulch to retain soil moisture.\n");
                recommendations.add("- Plan for additional watering.\n");
            } else {
                recommendations.add("Precipitation Sum is OK.\n");
            }

            // Precipitation Probability Recommendations
            if (we.getPrecipitationProbability() <= 20) {
                recommendations.add("Low precipitation probability. Consider the following actions:\n");
                recommendations.add("- Schedule harvesting as there is a low risk of rain.\n");
                recommendations.add("- Plan for additional irrigation if dry conditions persist.\n");
            } else if (we.getPrecipitationProbability() >= 80) {
                recommendations.add("High precipitation probability. Consider the following actions:\n");
                recommendations.add("- Ensure drainage systems are in place to prevent water logging.\n");
                recommendations.add("- Apply pre-rain pesticides to prevent fungal diseases.\n");
            } else {
                recommendations.add("Precipitation Probability is OK.\n");
            }

            // Wind Speed Recommendations
            if (we.getWindSpeed() > 20) {
                recommendations.add("High wind speed detected. Consider the following actions:\n");
                recommendations.add("- Protect young plants with windbreaks.\n");
                recommendations.add("- Secure structures and equipment.\n");
            } else {
                recommendations.add("Low wind speed detected(OK). Suitable conditions for spraying pesticides/herbicides.\n\n");
            }

            recommendetionsMap.put(we.getDate(), new ArrayList<>(recommendations));
        }

        return ResponseEntity.ok(recommendetionsMap);
    }
}
