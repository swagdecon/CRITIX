package com.popflix.controller;

import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.auth.AuthenticationService;
import com.popflix.model.Review;
import com.popflix.service.ReviewService;

@RestController
@RequestMapping("/review")
public class ReviewController {
        @Autowired
        private ReviewService reviewService;
        @Autowired
        private AuthenticationService authenticationService;

        @PostMapping("/create/{movieId}")
        public ResponseEntity<String> createMovieReview(@PathVariable Integer movieId, @RequestBody Review request,
                        @RequestHeader("Authorization") String accessToken) throws Exception {

                String username = request.getAuthor();
                String userId = authenticationService.getUserDetails(accessToken).getId();
                String movieTitle = request.getMovieTitle();
                String reviewRating = request.getRating();
                String reviewContent = request.getContent();
                String createdAt = request.getCreatedDate();

                if (reviewService.doesUserIdExistsForMovie(movieId, userId)) {
                        String errorMessage = "User already submitted a review for this movie.";
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
                } else {
                        reviewService.createNewMovieReview(movieId, username, userId, movieTitle, reviewRating,
                                        reviewContent,
                                        createdAt);
                }
                return null;
        }

        @GetMapping("/{movieId}")
        public ResponseEntity<List<Review>> movieReviews(@PathVariable Integer movieId)
                        throws IOException, InterruptedException {
                List<Review> reviews = reviewService.getMovieUserReviews(movieId);
                return new ResponseEntity<>(reviews, HttpStatus.OK);
        }

        @GetMapping("/get")
        public ResponseEntity<List<Review>> userReviews(@RequestHeader("Authorization") String accessToken)
                        throws Exception {
                String userId = authenticationService.getUserDetails(accessToken).getId();

                List<Review> allUserReviews = reviewService.getAllUserReviews(userId);
                return new ResponseEntity<>(allUserReviews, HttpStatus.OK);
        }

        @PostMapping("/delete/{movieId}")
        public ResponseEntity<String> deleteUserMovieReview(@PathVariable Integer movieId,
                        @RequestHeader("Authorization") String accessToken) throws Exception {
                String userId = authenticationService.getUserDetails(accessToken).getId();

                if (reviewService.doesUserIdExistsForMovie(movieId, userId)) {
                        reviewService.deleteMovieReview(movieId, userId);
                } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
                }
                return null;
        }
}
