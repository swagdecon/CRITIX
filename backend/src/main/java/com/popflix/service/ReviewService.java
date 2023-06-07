package com.popflix.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.popflix.model.Review;

@Service
public class ReviewService {
    public Optional<Review> createNewMovieReview(Integer movieId, String reviewContent) {
        Review review = new Review();

        review.setMovieId(movieId);
        review.setReviewContent(reviewContent);
        return Optional.of(review);
    }
}
