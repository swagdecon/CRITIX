package com.popflix.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.popflix.model.Review;
import com.popflix.model.User;
import com.popflix.repository.ReviewRepository;
import com.popflix.repository.UserRepository;
import com.popflix.service.tmdbRequests.AllMovieReviews;

@Service
public class ReviewService {

    private final AllMovieReviews tmdbReviews = new AllMovieReviews();
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;

    public void createNewMovieReview(Integer movieId, String username, String userId, String reviewRating,
            String reviewContent, String createdAt) {
        String reviewId = UUID.randomUUID().toString();
        Review review = new Review();
        review.setReviewId(reviewId);
        review.setMovieId(movieId);
        review.setUserId(userId);
        review.setAuthor(username);
        review.setRating(reviewRating);
        review.setContent(reviewContent);
        review.setCreatedDate(createdAt);
        reviewRepository.save(review);
    }

    public boolean doesUserIdExistsForMovie(Integer movieId, String userId) {
        List<Review> movieReviews = getAllMovieReviews(movieId);
        for (Review review : movieReviews) {
            if (review.getUserId().equals(userId)) {
                return true;
            }
        }
        return false;
    }

    public List<Review> getAllMovieReviews(Integer movieId) {
        List<Review> reviews = reviewRepository.findByMovieId(movieId);
        for (Review review : reviews) {
            User user = userRepository.findById(review.getUserId()).orElse(null);
            if (user != null) {
                review.setAvatar(user.getAvatar());
            }
        }
        return reviews;
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
