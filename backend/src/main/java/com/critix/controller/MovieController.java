package com.critix.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.critix.auth.AuthenticationService;
import com.critix.model.DiscoverMovieRequest;
import com.critix.model.Movie;
import com.critix.model.MovieCard;
import com.critix.service.MovieService;
import info.movito.themoviedbapi.tools.TmdbException;

@RestController
@RequestMapping("/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/movie/{movieId}")
    public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable Integer movieId,
            @RequestHeader("Authorization") String accessToken)
            throws Exception {

        String userId = authenticationService.getUserDetails(accessToken).getId();
        return new ResponseEntity<Optional<Movie>>(movieService.singleTmdbMovie(movieId, userId), HttpStatus.OK);
    }

    @GetMapping("/top_popular")
    public ResponseEntity<List<Movie>> getPopularMovies(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("popular", userId), HttpStatus.OK);
    }

    @PostMapping("/top_popular/{movieId}")
    public ResponseEntity<Optional<Movie>> getSinglePopularMovie(@PathVariable Integer movieId,
            @RequestHeader("Authorization") String accessToken) throws Exception {

        String userId = authenticationService.getUserDetails(accessToken).getId();
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "popular", userId),
                HttpStatus.OK);
    }

    @GetMapping("/top_upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("upcoming_movies", userId),
                HttpStatus.OK);
    }

    @PostMapping("/top_upcoming/{movieId}")
    public ResponseEntity<Optional<Movie>> getUpcomingMovie(@PathVariable Integer movieId,
            @RequestHeader("Authorization") String accessToken) throws Exception {

        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "upcoming_movies", userId),
                HttpStatus.OK);
    }

    @GetMapping("/top_rated")
    public ResponseEntity<List<Movie>> getTopRatedMovies(@RequestHeader("Authorization") String accessToken)
            throws Exception {

        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("top_rated", userId), HttpStatus.OK);
    }

    @PostMapping("/top_rated/{movieId}")
    public ResponseEntity<Optional<Movie>> getSingleTopRatedMovie(@PathVariable Integer movieId,
            @RequestHeader("Authorization") String accessToken) throws Exception {

        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "top_rated", userId),
                HttpStatus.OK);
    }

    @GetMapping("/now_playing")
    public ResponseEntity<List<Movie>> getNowPlayingMovies(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<List<Movie>>(movieService.getTop20MoviesForUser("now_playing", userId),
                HttpStatus.OK);
    }

    @PostMapping("/now_playing/{movieId}")
    public ResponseEntity<Optional<Movie>> getSingleNowPlayingMovie(@PathVariable Integer movieId,
            @RequestHeader("Authorization") String accessToken) throws Exception {

        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(movieId, "now_playing", userId),
                HttpStatus.OK);
    }

    @GetMapping("/search/{query}")
    public ResponseEntity<Object> getSearchResults(@PathVariable String query)
            throws IOException, InterruptedException, URISyntaxException, TmdbException {
        return new ResponseEntity<Object>(movieService.searchResults(query), HttpStatus.OK);
    }

    @GetMapping("/recommended/{movieId}")
    public ResponseEntity<Object> getRecommendedMoviesList(@PathVariable Integer movieId,
            @RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<Object>(movieService.recommendedMovies(movieId, userId), HttpStatus.OK);
    }

    @GetMapping("/get-trailer/{movieId}")
    public ResponseEntity<Object> getTrailer(@PathVariable Integer movieId)
            throws IOException, InterruptedException, URISyntaxException, TmdbException {
        return new ResponseEntity<Object>(movieService.getTrailer(movieId), HttpStatus.OK);
    }

    @GetMapping("/movie-list/{endpoint}")
    public ResponseEntity<Object> getMovieReultsPage(@PathVariable String endpoint, @RequestParam Integer page,
            @RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        return new ResponseEntity<Object>(movieService.getMovieResults(endpoint, page, userId), HttpStatus.OK);
    }

    @PostMapping("/watchlist/add")
    public void addWatchListItem(@RequestHeader("Authorization") String accessToken, @RequestBody MovieCard movieCard)
            throws Exception {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            movieService.addMovieToWatchlist(userId, movieCard);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/watchlist/delete/{movieId}")
    public void deleteWatchListItem(@RequestHeader("Authorization") String accessToken, @PathVariable Integer movieId)
            throws Exception {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            movieService.deleteMovieFromWatchlist(userId, movieId);
        } catch (Exception e) {
            throw new Exception("Error deleting from watchlist", e);
        }
    }

    @GetMapping("/watchlist")
    public List<MovieCard> getWatchlist(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            return movieService.getUserWatchlist(userId);
        } catch (Exception e) {
            throw new Exception("Error retrieving watchlist", e);
        }
    }

    @PostMapping("/favourite-movies/add")
    public void addFavouriteMovie(@RequestHeader("Authorization") String accessToken, @RequestBody MovieCard movieCard)
            throws Exception {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            movieService.addMovieToFavourites(userId, movieCard);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/favourite-movies/delete/{movieId}")
    public void deleteFavouriteMovie(@RequestHeader("Authorization") String accessToken, @PathVariable Integer movieId)
            throws Exception {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            movieService.deleteMovieFromFavouriteMoviesList(userId, movieId);
        } catch (Exception e) {
            throw new Exception("Error deleting from favourite movie list", e);
        }
    }

    @GetMapping("/favourite-movies")
    public List<MovieCard> getFavouriteMovies(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            return movieService.getUserFavouriteMoviesList(userId);
        } catch (Exception e) {
            throw new Exception("Error retrieving favourite movie list", e);
        }
    }

    @GetMapping("/recommended-movies")
    public ResponseEntity<List<MovieCard>> getrecommendations(@RequestHeader("Authorization") String accessToken)
            throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();

        try {
            return new ResponseEntity<>(movieService.getRecommendationsForUser(userId), HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/discover-movies")
    public ResponseEntity<List<MovieCard>> getDiscovery(@RequestHeader("Authorization") String accessToken,
            @ModelAttribute DiscoverMovieRequest discoverMovieRequest) throws Exception {
        String userId = authenticationService.getUserDetails(accessToken).getId();
        try {
            return new ResponseEntity<>(movieService.discoverMovies(discoverMovieRequest, userId), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}