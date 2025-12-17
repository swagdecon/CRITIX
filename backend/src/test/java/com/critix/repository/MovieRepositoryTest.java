package com.critix.repository;

import com.critix.model.Movie;
import com.critix.repository.MovieRepository;
import com.critix.service.MovieService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieRepositoryTest {

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private MovieService movieService;

    @Test
    void testFindMovieById() {
        Integer movieId = 1;
        Movie movie = new Movie();
        movie.setId(1);
        movie.setTitle("Movie Title");

        when(movieRepository.findMovieById(movieId)).thenReturn(Optional.ofNullable(movie));

        Optional<Movie> result = movieService.allMovies(movieId);

        assertEquals(movie, result.orElse(null)); // Extract movie object from Optional and perform the comparison
        verify(movieRepository, times(1)).findMovieById(movieId);
    }
}
