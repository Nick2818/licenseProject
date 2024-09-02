package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "weatherData")
@Getter
@Setter
public class WeatherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wid;

    private String uid;
    private String date;
    private Double highTemp;
    private Double lowTemp;
    private Double precipitationSum;
    private Double windSpeed;
    private Integer precipitationProbability;
}
