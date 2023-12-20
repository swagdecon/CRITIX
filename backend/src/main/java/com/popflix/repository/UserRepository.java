package com.popflix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.popflix.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Integer id);

    @Query("{ 'passwordResetRequests' : { $ne: null }, 'emailAuthRequests' : { $ne: null } }")
    List<User> findUsersWithResetRequests();
}
