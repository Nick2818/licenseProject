package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "worksData")
@Getter
@Setter
public class WorksEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wdid;
    private String uid;
    private String name;
    private Double lat;
    private Double lon;
}
