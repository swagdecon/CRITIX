package com.popflix.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.popflix.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findById(String id);

    @Query(value = "{'_id': ?0, 'watchList.id': ?1}", exists = true)
    Boolean findByMovieId(String userId, Integer moveiId);

    @Query("{ 'passwordResetRequests' : { $ne: null }, 'emailAuthRequests' : { $ne: null } }")
    List<User> findUsersWithResetRequests();
}
