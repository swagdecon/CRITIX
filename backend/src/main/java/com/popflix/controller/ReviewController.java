package com.popflix.controller;

import java.io.IOException;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.model.Review;
import com.popflix.service.ReviewService;

@RestController
@RequestMapping("/review")
public class ReviewController {
        @Autowired
        private ReviewService reviewService;

        @PostMapping("/create/{movieId}")
        public ResponseEntity<String> createMovieReview(@PathVariable Integer movieId, @RequestBody Review request) {
                String username = request.getAuthor();
                String userId = request.getUserId();
                String reviewRating = request.getRating();
                String reviewContent = request.getContent();
                String createdAt = request.getCreatedDate();

                if (reviewService.doesUserIdExistsForMovie(movieId, userId)) {
                        String errorMessage = "User already submitted a review for this movie.";
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
                } else {
                        reviewService.createNewMovieReview(movieId, username, userId, reviewRating, reviewContent,
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
}
