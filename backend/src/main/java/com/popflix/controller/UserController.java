package com.popflix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.auth.AuthenticationService;
import com.popflix.model.User;

import io.jsonwebtoken.io.IOException;

@RequestMapping("/user")
@RestController
public class UserController {
    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping("/{id}")
    public ResponseEntity<User> singleUser(@PathVariable String accessToken)
            throws IOException, InterruptedException {
        return new ResponseEntity<User>(authenticationService.getUserDetails(accessToken), HttpStatus.OK);
    }
}
