package com.popflix.service;

import java.net.http.HttpResponse;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.popflix.model.Review;
import com.popflix.service.tmdbRequests.AllMovieReviews;

@Service
public class ReviewService {
    public Optional<Review> createNewMovieReview(Integer movieId, Integer userId, Integer reviewRating,
            String reviewContent) {
        Review review = new Review();
        review.setMovieId(movieId);
        review.setUserId(userId);
        review.setReviewRating(reviewRating);
        // review.setReviewContent(reviewContent);
        return Optional.of(review);
    }

    private final AllMovieReviews reviews = new AllMovieReviews();

    public Optional<Review> movieUserReviews(Integer movieId)
            throws java.io.IOException, InterruptedException {
        Review review = new Review();
        HttpResponse<String> response = reviews.getMovieReviews(movieId);
        review.setReviewContent(response);
        return Optional.of(review);
    }
}
