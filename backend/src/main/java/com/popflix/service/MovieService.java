package com.popflix.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.popflix.model.Movie;

@Service
public class MovieService {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Movie> allMovies(String collectionName) {
        Query query = new Query();
        return mongoTemplate.find(query, Movie.class, collectionName);
    }

    public Optional<Movie> singleMovie(Integer id, String collectionName) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        return Optional.ofNullable(mongoTemplate.findOne(query, Movie.class, collectionName));
    }
}