package com.popflix.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.popflix.model.Movie;
import com.popflix.repository.MovieRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private MovieService movieService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetMovieById() {
        // Arrange
        Integer movieId = 1;
        Movie movie = new Movie();
        movie.setId(movieId);
        Optional<Movie> optionalMovie = Optional.of(movie);
        when(movieRepository.findMovieById(movieId)).thenReturn(optionalMovie);

        // Act
        Optional<Movie> result = movieService.findMovieById(movieId);

        // Assert
        assertEquals(optionalMovie, result);
    }

    // @Test
    // public void testGetAllMovies() {
    // // Arrange
    // Movie movie1 = new Movie();
    // movie1.setId(1);
    // Movie movie2 = new Movie();
    // movie2.setId(2);
    // Movie movie3 = new Movie();
    // movie3.setId(3);
    // List<Movie> expectedMovies = Arrays.asList(movie1, movie2, movie3);
    // when(movieRepository.findAll()).thenReturn(expectedMovies);

    // // Act
    // List<Movie> result = movieService.getMovies();

    // // Assert
    // assertEquals(expectedMovies, result);
    // }
}
