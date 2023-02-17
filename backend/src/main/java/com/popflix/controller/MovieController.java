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
        return new ResponseEntity<List<Movie>>(movieService.allMovies("popular"), HttpStatus.OK);
    }

    @GetMapping("/popular/{id}")
    public ResponseEntity<Optional<Movie>> getSinglePopularMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "popular"), HttpStatus.OK);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies("upcoming_movies"), HttpStatus.OK);
    }

    @GetMapping("/upcoming/{id}")
    public ResponseEntity<Optional<Movie>> getUpcomingMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "upcoming"), HttpStatus.OK);
    }

    @GetMapping("/top_rated")
    public ResponseEntity<List<Movie>> getTopRatedMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies("top_rated"), HttpStatus.OK);
    }

    @GetMapping("/top_rated/{id}")
    public ResponseEntity<Optional<Movie>> getSingleTopRatedMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "top_rated"), HttpStatus.OK);
    }

    @GetMapping("/now_playing")
    public ResponseEntity<List<Movie>> getNowPlayingMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies("now_playing"), HttpStatus.OK);
    }

    @GetMapping("/now_playing/{id}")
    public ResponseEntity<Optional<Movie>> getSingleNowPlayingMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "now_playing"), HttpStatus.OK);
    }
}
