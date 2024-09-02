package com.example.demo.service.implementation;

import com.example.demo.service.AdminService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    //Service Implementation
    @Override
    public List<UserRecord> getAllUsers() throws FirebaseAuthException {
        List<UserRecord> userRecordList = new ArrayList<>();
        ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);

        while (page != null) {
            for (UserRecord ur: page.getValues()) {
                userRecordList.add(ur);
            }
            page = page.getNextPage();
        }

        return userRecordList;
    }

    @Override
    public void deleteUser(String uid) {
        try {
            FirebaseAuth.getInstance().deleteUser(uid);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }
    }

    //Service Implementation
    @Override
    public String giveAdmin(String uid, String role) {
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);

            FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
            return "Custom claims set for user " + uid;
        } catch (Exception e) {
            return "Failed to set custom claims: " + e.getMessage();
        }

    }
}
