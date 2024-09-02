package com.example.demo.service;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

import java.util.List;

public interface AdminService {

    List<UserRecord> getAllUsers() throws FirebaseAuthException;

    void deleteUser(String uid);

    String giveAdmin(String uid, String role);


}
