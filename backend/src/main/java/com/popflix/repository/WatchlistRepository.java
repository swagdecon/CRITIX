package com.popflix.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.popflix.model.MovieCard;
import org.bson.types.ObjectId;

public interface WatchlistRepository extends MongoRepository<MovieCard, ObjectId> {
    Optional<MovieCard> findUserById(Integer id);
}
