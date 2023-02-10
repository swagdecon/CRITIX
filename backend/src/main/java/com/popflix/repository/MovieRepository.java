package com.popflix.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.popflix.model.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, ObjectId> {
    
}
