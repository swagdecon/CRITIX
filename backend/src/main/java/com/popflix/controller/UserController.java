package com.popflix.controller;

import java.io.File;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.auth.AuthenticationService;
import com.popflix.model.User;
import com.popflix.service.UserService;

import io.jsonwebtoken.io.IOException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/user")
@RestController
public class UserController {
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> singleUser(@PathVariable String accessToken)
            throws IOException, InterruptedException {
        return new ResponseEntity<User>(authenticationService.getUserDetails(accessToken), HttpStatus.OK);
    }

    @PostMapping("/update/profile-img/{userId}")
    public ResponseEntity<String> updateProfileImg(@RequestBody Map<String, String> profilePic,
            @PathVariable String userId)
            throws java.io.IOException {
        try {
            String profilePicURL = profilePic.get("profilePic");

            if (profilePic == null || !profilePicURL.startsWith("https://")) {
                return new ResponseEntity<>("Invalid URL. The URL must start with 'https://'", HttpStatus.BAD_REQUEST);
            } else {
                userService.updateUserProfilePic(profilePicURL, userId);
                return new ResponseEntity<>("Profile Picture Updated", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing URL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
