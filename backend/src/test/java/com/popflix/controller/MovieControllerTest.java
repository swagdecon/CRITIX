package com.popflix.controller;

import com.popflix.model.Movie;
import com.popflix.model.MovieCard;
import com.popflix.model.MovieResults;
import com.popflix.service.MovieService;
import info.movito.themoviedbapi.model.MovieDb;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Collections;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class MovieControllerTest {
    @Mock
    private MovieService movieService;

    @InjectMocks
    private MovieController movieController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetSingleMovie() throws Exception {
        int movieId = 123;
        String userId = "user123";
        Movie movie = new Movie();

        when(movieService.singleTmdbMovie(movieId, userId)).thenReturn(Optional.of(movie));

        ResponseEntity<Optional<Movie>> response = movieController.getSingleMovie(movieId, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testGetPopularMovies() throws Exception {

        String userId = "user123";
        List<Movie> mockMovies = new ArrayList<>();
        mockMovies.add(new Movie());
        mockMovies.add(new Movie());

        when(movieService.getTop20MoviesForUser("popular", userId)).thenReturn(mockMovies);

        ResponseEntity<List<Movie>> response = movieController.getPopularMovies(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockMovies.size(), response.getBody().size());
    }

    @Test
    void testGetSinglePopularMovie() throws Exception {

        int movieId = 123;
        String userId = "user123";
        Movie mockMovie = new Movie(); // Create a mock Movie object
        Optional<Movie> optionalMovie = Optional.of(mockMovie);

        when(movieService.singleMovie(movieId, "popular", userId)).thenReturn(optionalMovie);

        ResponseEntity<Optional<Movie>> response = movieController.getSinglePopularMovie(movieId, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(optionalMovie, response.getBody());
    }

    @Test
    void testGetUpcomingMovies() throws Exception {

        String userId = "user123";
        List<Movie> mockMovies = new ArrayList<>();
        mockMovies.add(new Movie());
        mockMovies.add(new Movie());

        when(movieService.getTop20MoviesForUser("upcoming_movies", userId)).thenReturn(mockMovies);

        ResponseEntity<List<Movie>> response = movieController.getUpcomingMovies(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockMovies.size(), response.getBody().size());
    }

    @Test
    void testGetTopRatedMovies() throws Exception {

        String userId = "user123";
        List<Movie> mockMovies = new ArrayList<>();
        mockMovies.add(new Movie());
        mockMovies.add(new Movie());

        when(movieService.getTop20MoviesForUser("top_rated", userId)).thenReturn(mockMovies);

        ResponseEntity<List<Movie>> response = movieController.getTopRatedMovies(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockMovies.size(), response.getBody().size());
    }

    @Test
    void testGetNowPlayingMovies() throws Exception {

        String userId = "user123";
        List<Movie> mockMovies = new ArrayList<>();
        mockMovies.add(new Movie());
        mockMovies.add(new Movie());

        when(movieService.getTop20MoviesForUser("now_playing", userId)).thenReturn(mockMovies);

        ResponseEntity<List<Movie>> response = movieController.getNowPlayingMovies(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockMovies.size(), response.getBody().size());
    }

    @Test
    void testGetSingleNowPlayingMovie() throws Exception {

        int movieId = 123;
        String userId = "user123";
        Movie mockMovie = new Movie(); // Create a mock Movie object
        Optional<Movie> optionalMovie = Optional.of(mockMovie);

        when(movieService.singleMovie(movieId, "now_playing", userId)).thenReturn(optionalMovie);

        ResponseEntity<Optional<Movie>> response = movieController.getSingleNowPlayingMovie(movieId, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(optionalMovie, response.getBody());
    }

    @Test
    void testGetSearchResults() throws IOException, InterruptedException, URISyntaxException {

        String query = "searchQuery";
        List<MovieDb> searchResults = Collections.singletonList(new MovieDb()); // Mocked search results of type MovieDb

        when(movieService.searchResults(anyString())).thenReturn(searchResults);

        ResponseEntity<Object> response = movieController.getSearchResults(query);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(searchResults, response.getBody());
    }

    @Test
    void testGetRecommendedMovies() throws IOException, InterruptedException, URISyntaxException {

        int movieId = 123;
        List<MovieCard> recommendedMovies = Collections.singletonList(new MovieCard()); // Replace with actual MovieCard
                                                                                        // data

        when(movieService.recommendedMovies(movieId)).thenReturn(recommendedMovies);

        ResponseEntity<Object> response = movieController.getRecommendedMovies(movieId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(recommendedMovies, response.getBody());

        // Verify method call and arguments passed to movieService.recommendedMovies
        verify(movieService).recommendedMovies(movieId);
    }

    @Test
    void testGetMovieResultsPage() throws IOException, InterruptedException, URISyntaxException {

        String endpoint = "popular";
        int page = 1;
        MovieResults movieResults = new MovieResults(); // Replace with actual MovieResults object

        when(movieService.getMovieResults(endpoint, page)).thenReturn(movieResults);

        ResponseEntity<Object> response = movieController.getMovieReultsPage(endpoint, page);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(movieResults, response.getBody());

        // Verify method call and arguments passed to movieService.getMovieResults
        verify(movieService).getMovieResults(endpoint, page);
    }

    @Test
    void testAddWatchListItem() throws Exception {

        String userId = "user123";
        MovieCard movieCard = new MovieCard(); // Replace with an actual MovieCard object

        movieController.addWatchListItem(userId, movieCard);

        // Verify method call to movieService.addMovieToWatchlist
        verify(movieService, times(1)).addMovieToWatchlist(userId, movieCard);
    }

    @Test
    void testDeleteWatchListItem() throws Exception {

        String userId = "user456";
        int movieId = 123;

        movieController.deleteWatchListItem(userId, movieId);

        // Verify method call to movieService.deleteMovieFromWatchlist
        verify(movieService, times(1)).deleteMovieFromWatchlist(userId, movieId);
    }

    @Test
    void testGetWatchlist() throws Exception {

        String userId = "user789";
        List<MovieCard> expectedWatchlist = Arrays.asList(new MovieCard(), new MovieCard()); // Replace with actual
                                                                                             // MovieCard objects

        when(movieService.getUserWatchlist(userId)).thenReturn(expectedWatchlist);

        List<MovieCard> result = movieController.getWatchlist(userId);

        assertEquals(expectedWatchlist.size(), result.size());
        // Add more specific assertions as needed for the returned watchlist items

        // Verify method call to movieService.getUserWatchlist
        verify(movieService, times(1)).getUserWatchlist(userId);
    }
}