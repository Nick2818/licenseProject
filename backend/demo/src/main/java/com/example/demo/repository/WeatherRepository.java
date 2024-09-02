package com.example.demo.repository;

import com.example.demo.model.WeatherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherEntity, Long> {

    void deleteAllByUid(String uid);
    List<WeatherEntity> findByUid(String uid);
}
