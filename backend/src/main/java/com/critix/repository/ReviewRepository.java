package com.critix.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.critix.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByMovieId(Integer movieId);

    List<Review> findByUserId(String userId);
}
