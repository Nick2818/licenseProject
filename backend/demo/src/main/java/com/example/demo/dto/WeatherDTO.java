package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherDTO {

    private String uid;
    private String date;
    private Double highTemp;
    private Double lowTemp;
    private Double precipitationSum;
    private Double windSpeed;
    private Integer precipitationProbability;
}
