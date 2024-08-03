package com.popflix.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.auth.AuthenticationService;
import com.popflix.model.User;
import com.popflix.service.UserService;

@RequestMapping("/user")
@RestController
public class UserController {
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<User> singleUser(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        User user = authenticationService.getUserDetails(accessToken);

        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/avatar")
    public ResponseEntity<String> singleAvatar(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String avatarPic = authenticationService.getUserDetails(accessToken).getAvatar();

        if (avatarPic != null) {
            return new ResponseEntity<>(avatarPic, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/update/profile-img")
    public ResponseEntity<String> updateProfileImg(@RequestBody Map<String, String> profilePic,
            @RequestHeader("Authorization") String accessToken)
            throws java.io.IOException {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();

            String profilePicURL = profilePic.get("profilePic");
            if (profilePicURL == null || profilePicURL.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if (!profilePicURL.contains("data:image/")) {
                return new ResponseEntity<>("Invalid data format.", HttpStatus.BAD_REQUEST);
            }
            userService.updateUserProfilePic(profilePicURL, userId);
            return new ResponseEntity<>("Profile Picture Updated", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error processing URL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update/banner-img")
    public ResponseEntity<String> updateBannerImg(@RequestBody Map<String, String> profileBanner,
            @RequestHeader("Authorization") String accessToken)
            throws java.io.IOException {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            String bannerPicUrl = profileBanner.get("bannerPic");

            if (profileBanner == null || !bannerPicUrl.startsWith("https://")) {
                return new ResponseEntity<>("Invalid URL. The URL must start with 'https://'", HttpStatus.BAD_REQUEST);
            } else {
                userService.updateUserBannerImg(bannerPicUrl, userId);
                return new ResponseEntity<>("Profile Picture Updated", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing URL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/banner")
    public ResponseEntity<String> getBanner(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String avatarPic = authenticationService.getUserDetails(accessToken).getBannerPicture();

        if (avatarPic != null) {
            return new ResponseEntity<>(avatarPic, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // @GetMapping("/activity/reviews/{id}")
    // public ResponseEntity<JSONArray>
    // getReviewActivity(@RequestHeader("Authorization") String accessToken) throws
    // Exception {
    // JSONArray array = userService.getUserReviewActivity()
    // }

}
