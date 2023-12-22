package com.popflix.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.popflix.model.Movie;
import com.popflix.model.MovieCard;
import com.popflix.service.MovieService;

@RestController
@RequestMapping("/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/movie/{id}")
    public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleTmdbMovie(id), HttpStatus.OK);
    }

    @GetMapping("/top_popular")
    public ResponseEntity<List<Movie>> getPopularMovies() {
        return new ResponseEntity<List<Movie>>(movieService.getTop20Movies("popular"), HttpStatus.OK);
    }

    @GetMapping("/top_popular/{id}")
    public ResponseEntity<Optional<Movie>> getSinglePopularMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "popular"), HttpStatus.OK);
    }

    @GetMapping("/top_upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies() {
        return new ResponseEntity<List<Movie>>(movieService.getTop20Movies("upcoming_movies"), HttpStatus.OK);
    }

    @GetMapping("/top_upcoming/{id}")
    public ResponseEntity<Optional<Movie>> getUpcomingMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "upcoming_movies"), HttpStatus.OK);
    }

    @GetMapping("/top_rated")
    public ResponseEntity<List<Movie>> getTopRatedMovies() {
        return new ResponseEntity<List<Movie>>(movieService.getTop20Movies("top_rated"), HttpStatus.OK);
    }

    @GetMapping("/top_rated/{id}")
    public ResponseEntity<Optional<Movie>> getSingleTopRatedMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "top_rated"), HttpStatus.OK);
    }

    @GetMapping("/now_playing")
    public ResponseEntity<List<Movie>> getNowPlayingMovies() {
        return new ResponseEntity<List<Movie>>(movieService.getTop20Movies("now_playing"), HttpStatus.OK);
    }

    @GetMapping("/now_playing/{id}")
    public ResponseEntity<Optional<Movie>> getSingleNowPlayingMovie(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(id, "now_playing"), HttpStatus.OK);
    }

    @GetMapping("/search/{query}")
    public ResponseEntity<Object> getSearchResults(@PathVariable String query)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.searchResults(query), HttpStatus.OK);
    }

    @GetMapping("/recommended/{id}")
    public ResponseEntity<Object> getRecommendedMovies(@PathVariable Integer id)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.recommendedMovies(id), HttpStatus.OK);
    }

    @GetMapping("/get-trailer/{id}")
    public ResponseEntity<Object> getTrailer(@PathVariable Integer id)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.getTrailer(id), HttpStatus.OK);
    }

    @GetMapping("/movie-list/{endpoint}")
    public ResponseEntity<Object> getMovieReultsPage(@PathVariable String endpoint, @RequestParam Integer page)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.getMovieResults(endpoint, page), HttpStatus.OK);
    }

    @PostMapping("/watchlist/add/{userId}")
    public void addWatchListItem(@PathVariable String userId, @RequestBody MovieCard movieCard)
            throws Exception {
        try {
            movieService.addMovieToWatchlist(userId, movieCard);
        } catch (Exception e) {
            throw new Exception("Error saving to watchlist", e);
        }
    }

    @PostMapping("/watchlist/delete/{userId}/{movieId}")
    public void deleteWatchListItem(@PathVariable String userId, @PathVariable Integer movieId)
            throws Exception {
        try {
            movieService.deleteMovieFromWatchlist(userId, movieId);
        } catch (Exception e) {
            throw new Exception("Error deleting from watchlist", e);
        }
    }

    @GetMapping("/watchlist/{userId}")
    public List<MovieCard> getWatchlist(@PathVariable String userId)
            throws Exception {
        try {
            return movieService.getUserWatchlist(userId);
        } catch (Exception e) {
            throw new Exception("Error retrieving watchlist", e);
        }
    }
}