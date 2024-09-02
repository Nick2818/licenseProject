package com.example.demo.service.implementation;

import com.example.demo.dto.PolyDTO;
import com.example.demo.model.PolyEntity;
import com.example.demo.model.WorksEntity;
import com.example.demo.repository.WorksRepository;
import com.example.demo.repository.ZoneRepository;
import com.example.demo.service.MapService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class MapServiceImpl implements MapService {

    private final ZoneRepository zoneRepository;
    private final WorksRepository worksRepository;

    public MapServiceImpl(ZoneRepository zoneRepository, WorksRepository worksRepository) {
        this.zoneRepository = zoneRepository;
        this.worksRepository = worksRepository;
    }

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public Polygon createPolygonFromCoordinates(List<List<Double>> rawCoordinates) {

        if (!rawCoordinates.isEmpty() && !rawCoordinates.get(0).equals(rawCoordinates.get(rawCoordinates.size() - 1))) {
            rawCoordinates.add(rawCoordinates.get(0));
        }

        Coordinate[] coordinates = new Coordinate[rawCoordinates.size()];

        for (int i = 0; i < rawCoordinates.size(); i++) {
            List<Double> rawCoordinate = rawCoordinates.get(i);
            coordinates[i] = new Coordinate(rawCoordinate.get(0), rawCoordinate.get(1));
        }

        LinearRing shell = geometryFactory.createLinearRing(coordinates);

        return geometryFactory.createPolygon(shell, null);

    }

    @Override
    public void savePoly(List<List<Double>> coordinates, String uid, String name) {

        System.out.println("Coordinates:" + coordinates);

        Polygon poly = createPolygonFromCoordinates(coordinates);

        PolyEntity newPoly =  new PolyEntity();

        newPoly.setUid(uid);

        newPoly.setZone(poly);

        newPoly.setName(name);

        zoneRepository.save(newPoly);

        WorksEntity we = new WorksEntity();

        //Finding zone center coordinates
        String centroid = zoneRepository.findCentroidById(newPoly.getId());
        String[] parts = centroid.split("[ ()]+");

        Double lat = Double.parseDouble(parts[1]);
        Double lon = Double.parseDouble(parts[2]);

        we.setUid(uid);
        we.setName(name);
        we.setLat(lat);
        we.setLon(lon);

        worksRepository.save(we);
    }

    @Override
    public List<PolyDTO> getAllPolys(String uid) {
        List<PolyDTO> polygons = new ArrayList<>();

        for (PolyEntity pe : zoneRepository.findAllByUid(uid)) {
            Polygon polygon = pe.getZone();
            PolyDTO polyDTO = new PolyDTO();
            polyDTO.setName(pe.getName()); // Set the name of the polygon

            List<List<Double>> singlePolygonCoordinates = new ArrayList<>();

            for (Coordinate coordinate : polygon.getCoordinates()) {
                List<Double> coords = new ArrayList<>();
                coords.add(coordinate.x);
                coords.add(coordinate.y);
                singlePolygonCoordinates.add(coords);
            }

            // Set the coordinates of the polygon
            polyDTO.setCoordinates(singlePolygonCoordinates);

            // Add the PolyDTO object to the list of polygons
            polygons.add(polyDTO);
        }

        return polygons;
    }

    @Override
    public boolean isNameUniqueForUser(String name, String uid) {
        return zoneRepository.existsByNameAndUid(name, uid);
    }

    @Override
    @Transactional
    public void deleteZoneByNameAndUid(String name, String uid) {
        zoneRepository.deleteByNameAndUid(name, uid);
        worksRepository.deleteByNameAndUid(name,uid);
    }
}
