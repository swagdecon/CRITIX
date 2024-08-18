package com.popflix.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.popflix.model.Review;
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
    @Autowired
    private MongoTemplate mongoTemplate;

    public void createNewMovieReview(Integer movieId, String author, String userId, String movieTitle,
            String reviewRating,
            String reviewContent, String createdAt) {
        String reviewId = UUID.randomUUID().toString();
        Review review = new Review();
        review.setReviewId(reviewId);
        review.setMovieId(movieId);
        review.setMovieTitle(movieTitle);
        review.setUserId(userId);
        review.setAvatar(userRepository.findById(userId).get().getAvatar());
        review.setAuthor(author);
        review.setRating(reviewRating);
        review.setContent(reviewContent);
        review.setCreatedDate(createdAt);
        reviewRepository.save(review);
    }

    public boolean doesUserIdExistForMovie(Integer movieId, String userId) {
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
        return reviews;
    }

    public List<Review> getAllUserReviews(String userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
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

    public void deleteMovieReview(Integer movieId, String userId) throws IOException, InterruptedException {
        try {
            List<Review> movieReviews = getMovieUserReviews(movieId);
            if (movieReviews != null) {
                Query query = new Query(Criteria.where("userId").is(userId));
                mongoTemplate.remove(query, Review.class);
            } else {
                throw new Exception("test error");
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
