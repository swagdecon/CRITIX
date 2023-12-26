package com.popflix.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @PostMapping("/movie/{movieId}")
    public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable Integer movieId, @RequestBody String userId) {
        String test = userId.substring(1, userId.length() - 1);
        return new ResponseEntity<Optional<Movie>>(movieService.singleTmdbMovie(movieId, test), HttpStatus.OK);
    }

    @GetMapping("/top_popular/{userId}")
    public ResponseEntity<List<Movie>> getPopularMovies(@PathVariable String userId) {
        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("popular", userId), HttpStatus.OK);
    }

    @PostMapping("/top_popular/movie/{movieId}")
    public ResponseEntity<Optional<Movie>> getSinglePopularMovie(@PathVariable Integer movieId,
            @RequestBody String userId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "popular", userId), HttpStatus.OK);
    }

    @GetMapping("/top_upcoming/{userId}")
    public ResponseEntity<List<Movie>> getUpcomingMovies(@PathVariable String userId) {
        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("upcoming_movies", userId),
                HttpStatus.OK);
    }

    @PostMapping("/top_upcoming/movie/{movieId}")
    public ResponseEntity<Optional<Movie>> getUpcomingMovie(@PathVariable Integer movieId, @RequestBody String userId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "upcoming_movies", userId),
                HttpStatus.OK);
    }

    @GetMapping("/top_rated/{userId}")
    public ResponseEntity<List<Movie>> getTopRatedMovies(@PathVariable String userId) {
        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("top_rated", userId), HttpStatus.OK);
    }

    @PostMapping("/top_rated/movie/{movieId}")
    public ResponseEntity<Optional<Movie>> getSingleTopRatedMovie(@PathVariable Integer movieId,
            @RequestBody String userId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "top_rated", userId),
                HttpStatus.OK);
    }

    @GetMapping("/now_playing/{userId}")
    public ResponseEntity<List<Movie>> getNowPlayingMovies(@PathVariable String userId) {
        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("now_playing", userId),
                HttpStatus.OK);
    }

    @PostMapping("/now_playing/movie/{movieId}")
    public ResponseEntity<Optional<Movie>> getSingleNowPlayingMovie(@PathVariable Integer movieId,
            @RequestBody String userId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "now_playing", userId),
                HttpStatus.OK);
    }

    @GetMapping("/search/{query}")
    public ResponseEntity<Object> getSearchResults(@PathVariable String query)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.searchResults(query), HttpStatus.OK);
    }

    @GetMapping("/recommended/{movieId}")
    public ResponseEntity<Object> getRecommendedMovies(@PathVariable Integer movieId)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.recommendedMovies(movieId), HttpStatus.OK);
    }

    @GetMapping("/get-trailer/{movieId}")
    public ResponseEntity<Object> getTrailer(@PathVariable Integer movieId)
            throws IOException, InterruptedException, URISyntaxException {
        return new ResponseEntity<Object>(movieService.getTrailer(movieId), HttpStatus.OK);
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
            e.printStackTrace();
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