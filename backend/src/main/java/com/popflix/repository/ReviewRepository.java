package com.popflix.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.popflix.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByMovieId(Integer movieId);

    List<Review> findByUserId(String userId);
}
