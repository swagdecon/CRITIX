package com.popflix.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.model.Movie;
import com.popflix.service.MovieService;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/popular")
    public ResponseEntity<List<Movie>> getPopularMovies() {
        return new ResponseEntity<List<Movie>>(movieService.popularMovies("popular"), HttpStatus.OK);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies() {
        return new ResponseEntity<List<Movie>>(movieService.upcomingMovies("upcoming_movies"), HttpStatus.OK);
    }

    @GetMapping("/top_rated")
    public ResponseEntity<List<Movie>> getTopRatedMovies() {
        return new ResponseEntity<List<Movie>>(movieService.upcomingMovies("top_rated"), HttpStatus.OK);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable Integer id) {
    //     return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id), HttpStatus.OK);
    // }
}
