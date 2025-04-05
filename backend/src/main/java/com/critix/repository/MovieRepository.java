package com.critix.repository;

import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.critix.model.Movie;

public interface MovieRepository extends MongoRepository<Movie, ObjectId> {
    Optional<Movie> findMovieById(Integer id);
}