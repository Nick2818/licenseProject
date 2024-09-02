package com.example.demo.controller;

import com.example.demo.service.AdminService;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    //Controller
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserRecord> getAllUsers() throws FirebaseAuthException {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/delete/{uid}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable String uid) {
        adminService.deleteUser(uid);
    }

    //Controller
    @PutMapping ("/users/giveAdmin/{uid}/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public String giveAdmin(@PathVariable("uid") String uid, @PathVariable("role") String role) {
        return adminService.giveAdmin(uid, role);
    }


}
