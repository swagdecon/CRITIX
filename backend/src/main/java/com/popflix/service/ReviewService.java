package com.popflix.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.popflix.model.Review;
import com.popflix.repository.ReviewRepository;
import com.popflix.service.tmdbRequests.AllMovieReviews;

@Service
public class ReviewService {

    private final AllMovieReviews tmdbReviews = new AllMovieReviews();
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Optional<Review> createNewMovieReview(Integer movieId, String username, String reviewRating,
            String reviewContent, String createdAt) {
        Review review = new Review();
        review.setMovieId(movieId);
        review.setAuthor(username);
        review.setRating(reviewRating);
        review.setContent(reviewContent);
        review.setCreatedDate(createdAt);
        Review savedReview = reviewRepository.save(review);
        return Optional.of(savedReview);
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
