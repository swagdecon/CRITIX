package com.popflix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.popflix.model.Token;

public interface TokenRepository extends MongoRepository<Token, String> {

    @Query("{'userId': ?0, expired: false, revoked: false}")
    List<Token> findAllValidTokensByUser(String userId);

    Optional<Token> findByToken(String token);
}