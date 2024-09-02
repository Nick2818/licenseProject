package com.example.demo.controller;

import com.example.demo.dto.UserCredentials;
import com.example.demo.service.FirebaseAuthService;
import com.google.firebase.auth.UserRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final FirebaseAuthService firebaseAuthService;

    public AuthController (FirebaseAuthService firebaseAuthService) {
        this.firebaseAuthService = firebaseAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserCredentials credentials) {
        try {

            UserRecord newUser = firebaseAuthService.registerUser(credentials);

            System.out.println("UID:" + newUser.getUid());

            return ResponseEntity.ok("Registration completed for user: \n" + newUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminTesting() {
        return "Admin API is working";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String userTesting() {
        return "User API is working";
    }
}
