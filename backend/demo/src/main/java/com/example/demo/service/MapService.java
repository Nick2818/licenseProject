package com.example.demo.service;

import com.example.demo.dto.PolyDTO;
import org.locationtech.jts.geom.Polygon;
import java.util.List;

public interface MapService {
    Polygon createPolygonFromCoordinates(List<List<Double>> rawCoordinates);

    void savePoly(List<List<Double>> coordinates, String uid, String name);

    List<PolyDTO> getAllPolys(String uid);

    boolean isNameUniqueForUser(String name, String uid);

    void deleteZoneByNameAndUid(String name, String uid);

}
