package com.popflix.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.popflix.model.Review;
import com.popflix.repository.ReviewRepository;
import com.popflix.service.tmdbRequests.AllMovieReviews;

@Service
public class ReviewService {

    private final AllMovieReviews reviews = new AllMovieReviews();
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

    public List<Review> getMovieUserReviews(Integer movieId) throws java.io.IOException, InterruptedException {
        List<Review> response = reviews.getMovieReviews(movieId);
        return response;

    }
}
