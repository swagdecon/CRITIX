package com.popflix.controller;

import java.util.Optional;
import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import com.popflix.model.Review;

@RequestMapping("/reviews")
public class ReviewController {
    @GetMapping("/reviews/movie/{movieId}")
    public ResponseEntity<Optional<Review>> getSingleMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Review>>(reviewService.singleTmdbMovie(id), HttpStatus.OK);
    }
}
