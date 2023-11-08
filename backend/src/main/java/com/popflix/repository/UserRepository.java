package com.popflix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.popflix.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    @Query("{ 'PasswordResetRequestsInLastHour' : { $ne: null } }")
    List<User> findUsersWithResetRequestsInLastHour();
}