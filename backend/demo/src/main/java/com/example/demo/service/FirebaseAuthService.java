package com.example.demo.service;

import com.example.demo.dto.UserCredentials;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

public interface FirebaseAuthService {

    UserRecord registerUser(UserCredentials credentials) throws FirebaseAuthException;
}

