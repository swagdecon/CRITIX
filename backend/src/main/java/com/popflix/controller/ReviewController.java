package com.popflix.controller;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.model.Review;
import com.popflix.service.ReviewService;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/review")
public class ReviewController {

        @Autowired
        ReviewService reviewService;

        @PostMapping("/post/{movieId}/user/{userId}")

        public ResponseEntity<Optional<Review>> createMovieReview(@PathVariable Integer movieId, Integer userId,
                        Integer reviewRating,
                        String reviewContent) {
                return new ResponseEntity<Optional<Review>>(
                                reviewService.createNewMovieReview(movieId, userId, reviewRating, reviewContent),
                                HttpStatus.OK);
        }

        @GetMapping("/{movieId}")
        public ResponseEntity<Optional<Review>> movieReviews(@PathVariable Integer movieId)
                        throws IOException, InterruptedException {
                return new ResponseEntity<Optional<Review>>(reviewService.movieUserReviews(movieId), HttpStatus.OK);
        }

}
