package com.popflix.controller;

import com.popflix.model.Movie;
import com.popflix.service.MovieService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class MovieControllerTest {
    @Mock
    private MovieService movieService;

    @InjectMocks
    private MovieController movieController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetSingleMovie() {
        int movieId = 1;
        Movie movie = new Movie();
        Optional<Movie> optionalMovie = Optional.of(movie);

        when(movieService.singleTmdbMovie(movieId)).thenReturn(optionalMovie);

        ResponseEntity<Optional<Movie>> response = movieController.getSingleMovie(movieId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(optionalMovie, response.getBody());

        verify(movieService, times(1)).singleTmdbMovie(movieId);
        verifyNoMoreInteractions(movieService);
    }

    @Test
    public void testGetPopularMovies() throws Exception {
        // Create a mock MovieService
        MovieService movieService = mock(MovieService.class);
        List<Movie> movies = new ArrayList<>();
        when(movieService.allMovies("popular")).thenReturn(movies);

        // Create a MovieController instance
        MovieController movieController = new MovieController();

        // Set the movieService field using reflection
        Field movieServiceField = MovieController.class.getDeclaredField("movieService");
        movieServiceField.setAccessible(true);
        movieServiceField.set(movieController, movieService);

        // Call the getPopularMovies method
        ResponseEntity<List<Movie>> response = movieController.getPopularMovies();

        // Assert the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(movies, response.getBody());

        // Verify that the movieService.allMovies method was called with the correct
        // parameter
        verify(movieService, times(1)).allMovies("popular");
    }

    @Test
    public void testGetUpcomingMovies() throws Exception {
        // Create a mock MovieService
        MovieService movieService = mock(MovieService.class);
        List<Movie> movies = new ArrayList<>();
        when(movieService.allMovies("upcoming")).thenReturn(movies);

        // Create a MovieController instance
        MovieController movieController = new MovieController();

        // Set the movieService field using reflection
        Field movieServiceField = MovieController.class.getDeclaredField("movieService");
        movieServiceField.setAccessible(true);
        movieServiceField.set(movieController, movieService);

        // Call the getUpcomingMovies method
        ResponseEntity<List<Movie>> response = movieController.getUpcomingMovies();

        // Assert the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(movies, response.getBody());

        // Verify that the movieService.allMovies method was called with the correct
        // parameter
        verify(movieService, times(1)).allMovies("upcoming_movies");
    }

    @Test
    public void testGetTopRatedMovies() throws Exception {
        // Create a mock MovieService
        MovieService movieService = mock(MovieService.class);
        List<Movie> movies = new ArrayList<>();
        when(movieService.allMovies("top_rated")).thenReturn(movies);

        // Create a MovieController instance
        MovieController movieController = new MovieController();

        // Set the movieService field using reflection
        Field movieServiceField = MovieController.class.getDeclaredField("movieService");
        movieServiceField.setAccessible(true);
        movieServiceField.set(movieController, movieService);

        // Call the getTopRated method
        ResponseEntity<List<Movie>> response = movieController.getTopRatedMovies();

        // Assert the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(movies, response.getBody());

        // Verify that the movieService.allMovies method was called with the correct
        // parameter
        verify(movieService, times(1)).allMovies("top_rated");
    }

    @Test
    public void testGetNowPlayingMovies() throws Exception {
        // Create a mock MovieService
        MovieService movieService = mock(MovieService.class);
        List<Movie> movies = new ArrayList<>();
        when(movieService.allMovies("now_playing")).thenReturn(movies);

        // Create a MovieController instance
        MovieController movieController = new MovieController();

        // Set the movieService field using reflection
        Field movieServiceField = MovieController.class.getDeclaredField("movieService");
        movieServiceField.setAccessible(true);
        movieServiceField.set(movieController, movieService);

        // Call the getNowPlaying method
        ResponseEntity<List<Movie>> response = movieController.getNowPlayingMovies();

        // Assert the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(movies, response.getBody());

        // Verify that the movieService.allMovies method was called with the correct
        // parameter
        verify(movieService, times(1)).allMovies("now_playing");
    }
}
