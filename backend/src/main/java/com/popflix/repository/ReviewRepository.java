package com.popflix.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.popflix.model.Review;

// public interface ReviewRepository extends MongoRepository<Review, Integer> {
// @Query("{'id': ?0, isAccepted: true, isRejected: false, isInReview, true}")
// List<Review> findAllValidReviews(Integer id);
// }
