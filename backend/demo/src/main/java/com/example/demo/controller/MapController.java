package com.example.demo.controller;

import com.example.demo.dto.PolyDTO;
import com.example.demo.service.MapService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/map")
public class MapController {

    private final MapService mapService;

    public MapController(MapService mapService) {
        this.mapService = mapService;
    }

    @PostMapping("/save")
    @PreAuthorize("hasRole('USER')")
    public String savePoly(@RequestBody PolyDTO polyDTO, @RequestHeader(name = "Authorization") String authHeader) {

        String uid;

        String token = authHeader.substring(7);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            uid = decodedToken.getUid();
        } catch (Exception e) {
            e.printStackTrace();
            return "Eroare la validarea tokenului de autentificare Firebase.";
        }

        mapService.savePoly(polyDTO.getCoordinates(), uid, polyDTO.getName());

        return "Poligon salvat cu succes pentru utilizatorul cu UID: " + uid;
    }

    @GetMapping("/get/{uid}")
    @PreAuthorize("hasRole('USER')")
    public List<PolyDTO> getAllPolys(@PathVariable String uid) {

        return mapService.getAllPolys(uid);

    }

    @GetMapping("/checkName/{name}/{uid}")
    @PreAuthorize("hasRole('USER')")
    public boolean checkUniqueName(@PathVariable String name, @PathVariable String uid){

        return !mapService.isNameUniqueForUser(name, uid);
    }

    @GetMapping("/zoneNames/{uid}")
    @PreAuthorize("hasRole('USER')")
    public List<String> getZoneNames(@PathVariable String uid) {

        List<String> zoneNames = new ArrayList<>();

        List<PolyDTO> polyDTOS;

        polyDTOS = mapService.getAllPolys(uid);

        for (PolyDTO pd: polyDTOS) {
            String name = pd.getName();
            zoneNames.add(name);
        }

        System.out.println(zoneNames);

        return zoneNames;
    }

    @DeleteMapping("/delete/{name}/{uid}")
    @PreAuthorize("hasRole('USER')")
    public void deleteZone(@PathVariable String name, @PathVariable String uid) {
            mapService.deleteZoneByNameAndUid(name, uid);
    }
}
