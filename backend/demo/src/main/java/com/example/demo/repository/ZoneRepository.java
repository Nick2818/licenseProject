package com.example.demo.repository;

import com.example.demo.model.PolyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<PolyEntity, Long> {

    List<PolyEntity> findAllByUid(String uid);

    boolean existsByNameAndUid(String name, String uid);

   void deleteByNameAndUid(String name, String uid);

   @Query("SELECT ST_AsText(ST_Centroid(e.zone)) FROM polygons e WHERE e.id = :id") //https://postgis.net/docs/ST_Centroid.html
   String findCentroidById(Long id);
}
