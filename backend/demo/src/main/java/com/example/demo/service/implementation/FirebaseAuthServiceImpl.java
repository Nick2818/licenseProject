package com.example.demo.service.implementation;

import com.example.demo.model.UserRole;
import com.example.demo.dto.UserCredentials;
import com.example.demo.service.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseAuthServiceImpl implements FirebaseAuthService {

    @Override
    public UserRecord registerUser(UserCredentials credentials) throws FirebaseAuthException {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(credentials.getEmail())
                .setEmailVerified(false)
                .setPassword(credentials.getPassword())
                .setDisabled(false);

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        Map<String, Object> claims = new HashMap<>();

        if (credentials.getEmail().equals("admin@admin.com")) {


            claims.put("role", UserRole.ADMIN.toString());

            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);

            UserRecord user = FirebaseAuth.getInstance().getUser(userRecord.getUid());
            System.out.println("New user role:" + user.getCustomClaims().get("role"));
        } else {

            claims.put("role", UserRole.USER.toString());

            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);

            UserRecord user = FirebaseAuth.getInstance().getUser(userRecord.getUid());
            System.out.println("New user role:" + user.getCustomClaims().get("role"));
        }

        return userRecord;
    }
}
