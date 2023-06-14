package com.popflix.controller;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import com.popflix.model.Review;
import com.popflix.service.ReviewService;
import org.springframework.web.bind.annotation.PostMapping;

@RequestMapping("/create/review")
public class ReviewController {
    ReviewService reviewService = new ReviewService();

    @PostMapping("/{movieId}/user/{userId}")

    public ResponseEntity<Optional<Review>> createMovieReview(@PathVariable Integer movieId, Integer userId,
            Integer reviewRating,
            String reviewContent) {
        return new ResponseEntity<Optional<Review>>(
                reviewService.createNewMovieReview(movieId, userId, reviewRating, reviewContent),
                HttpStatus.OK);
    }
}
