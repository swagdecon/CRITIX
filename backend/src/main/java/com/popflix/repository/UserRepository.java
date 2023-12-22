package com.popflix.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.popflix.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findById(String id);

    @Query(value = "{'_id': ?0, 'watchList.movieId': ?1}", exists = true)
    Boolean doesMovieExist(String userId, Integer movieId);

    @Query(value = "{'_id': ?0}", fields = "{ 'watchList': 1, '_id': 0 }")
    Optional<User> findUserWithWatchListById(String id);

    @Query("{ 'passwordResetRequests' : { $ne: null }, 'emailAuthRequests' : { $ne: null } }")
    List<User> findUsersWithResetRequests();
}
