package com.popflix.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.popflix.model.Review;

public interface ReviewRepository extends MongoRepository<Review, Integer> {
    List<Review> findByMovieId(Integer movieId);
}
