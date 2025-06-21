package com.critix.controller;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.critix.auth.AuthenticationService;
import com.critix.config.EnvLoader;
import com.critix.model.LoginEvents;
import com.critix.model.User;
import com.critix.service.UserService;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/user")
@RestController
public class UserController {
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired

    private UserService userService;

    private EnvLoader envLoader = new EnvLoader();
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    private String defaultAvatar = envLoader.getEnv("DEFAULT_AVATAR_URL", dotenv);

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
            return new ResponseEntity<>(defaultAvatar, HttpStatus.OK);
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

    @PostMapping("/update/bio")
    public ResponseEntity<String> updateBannerBio(@RequestBody Map<String, String> bioText,
            @RequestHeader("Authorization") String accessToken)
            throws java.io.IOException {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            String userBio = bioText.get("bioText");
            userService.updateUserBio(userBio, userId);
            return new ResponseEntity<>("Bio Updated", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing text", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bio")
    public ResponseEntity<String> getBannerBio(@RequestHeader("Authorization") String accessToken) throws Exception {
        String bio = authenticationService.getUserDetails(accessToken).getBio();
        if (bio != null) {
            return new ResponseEntity<>(bio, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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

    @GetMapping("/login-info")
    public ResponseEntity<LoginEvents> getLoginsPerMonth(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();
        try {
            return new ResponseEntity<>(userService.retrieveLoginInfo(userId), HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/average-rating")
    public ResponseEntity<Integer> getAverageRating(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        if (userId != null) {
            return new ResponseEntity<>(userService.getAverageUserRating(userId), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/most-reviewed-genres")
    public ResponseEntity<Map<String, Integer>> getMostReviewedGenres(
            @RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        if (userId != null) {
            Map<String, Integer> genreCounts = userService.getMostReviewedGenres(userId);
            return ResponseEntity.ok(genreCounts);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-top-rated-movies")
    public ResponseEntity<Map<String, Integer>> getUserTopRatedMovies(
            @RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        if (userId != null) {
            Map<String, Integer> userTopRatedMovies = userService.getTopRatedMovies(userId);
            return ResponseEntity.ok(userTopRatedMovies);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
