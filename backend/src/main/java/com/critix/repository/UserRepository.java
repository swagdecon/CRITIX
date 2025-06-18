package com.critix.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.critix.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findById(String id);

    @Query(value = "{'_id': ?0, 'watchList.movieId': ?1 }", exists = true)
    Boolean doesWatchlistMovieExist(String userId, Integer movieId);

    @Query(value = "{'_id': ?0, 'favouriteMoviesList.movieId': ?1 }", exists = true)
    Boolean doesFavouriteMovieExist(String userId, Integer movieId);

    @Query(value = "{'_id': ?0}", fields = "{ 'watchList': 1, '_id': 0 }")
    Optional<User> findUserWithWatchListById(String userId);

    @Query(value = "{'_id': ?0}", fields = "{ 'favouriteMoviesList': 1, '_id': 0 }")
    Optional<User> findUserWithFavouriteMoviesListById(String userId);

    @Query(value = "{'_id': ?0}", fields = "{ 'recommendedMoviesList': 1, '_id': 0 }")
    Optional<User> findUserWithRecommendedeMoviesListById(String userId);

    @Query("{ 'passwordResetRequests' : { $ne: null }, 'emailAuthRequests' : { $ne: null } }")
    List<User> findUsersWithResetRequests();
}
