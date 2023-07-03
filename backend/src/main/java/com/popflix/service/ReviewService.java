package com.popflix.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.popflix.model.Review;
import com.popflix.repository.ReviewRepository;
import com.popflix.service.tmdbRequests.AllMovieReviews;

@Service
public class ReviewService {

    private final AllMovieReviews tmdbReviews = new AllMovieReviews();
    @Autowired
    private ReviewRepository reviewRepository;

    public void createNewMovieReview(Integer movieId, String username, String reviewRating,
            String reviewContent, String createdAt) {
        String reviewId = UUID.randomUUID().toString();
        Review review = new Review();
        review.setReviewId(reviewId);
        review.setMovieId(movieId);
        review.setAuthor(username);
        review.setRating(reviewRating);
        review.setContent(reviewContent);
        review.setCreatedDate(createdAt);
        reviewRepository.save(review);
    }

    public List<Review> getAllMovieReviews(Integer movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    public List<Review> getMovieUserReviews(Integer movieId) throws IOException, InterruptedException {
        List<Review> externalReviews = tmdbReviews.getMovieReviews(movieId);
        List<Review> databaseReviews = getAllMovieReviews(movieId);
        List<Review> combinedReviews = new ArrayList<>();
        combinedReviews.addAll(externalReviews);
        combinedReviews.addAll(databaseReviews);
        return combinedReviews;
    }
}
