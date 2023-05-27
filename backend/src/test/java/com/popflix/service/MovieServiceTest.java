package com.popflix.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.popflix.model.Movie;
import com.popflix.repository.MovieRepository;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.MovieDb;
import io.github.cdimascio.dotenv.Dotenv;

class MovieServiceTest {

    private MovieService movieService;
    private MovieRepository movieRepository;
    private MongoTemplate mongoTemplate;

    @BeforeEach
    void setUp() {
        movieRepository = mock(MovieRepository.class);
        mongoTemplate = mock(MongoTemplate.class);
        movieService = new MovieService();
        movieService.movieRepository = movieRepository;
        movieService.mongoTemplate = mongoTemplate;
    }

    Dotenv dotenv = Dotenv.load();
    final TmdbApi tmdbApi = new TmdbApi(dotenv.get("TMDB_API_KEY"));

    @Test
    void findMovieByIdWithValidIdShouldReturnOptionalMovie() {
        // Arrange
        int movieId = 1;
        Movie expectedMovie = new Movie();
        expectedMovie.setId(movieId);
        when(movieRepository.findMovieById(movieId)).thenReturn(Optional.of(expectedMovie));

        // Act
        Optional<Movie> actualMovie = movieService.findMovieById(movieId);

        // Assert
        assertTrue(actualMovie.isPresent());
        assertEquals(expectedMovie, actualMovie.get());
    }

    @Test
    void findMovieByIdWithInvalidIdShouldReturnEmptyOptional() {
        // Arrange
        int movieId = 1;
        when(movieRepository.findMovieById(movieId)).thenReturn(Optional.empty());

        // Act
        Optional<Movie> actualMovie = movieService.findMovieById(movieId);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    @Test
    void allMoviesWithValidCollectionNameShouldReturnListOfMovies() {
        // Arrange
        String collectionName = "upcoming_movies";
        List<Movie> expectedMovies = new ArrayList<>();
        when(mongoTemplate.find(any(Query.class), eq(Movie.class), eq(collectionName))).thenReturn(expectedMovies);

        // Act
        List<Movie> actualMovies = movieService.allMovies(collectionName);

        // Assert
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void singleMovieWithValidIdAndCollectionNameShouldReturnOptionalMovie() {
        // Arrange
        int movieId = 1;
        String collectionName = "most_popular";
        Movie expectedMovie = new Movie();
        expectedMovie.setId(movieId);
        when(mongoTemplate.findOne(any(Query.class), eq(Movie.class), eq(collectionName))).thenReturn(expectedMovie);

        // Act
        Optional<Movie> actualMovie = movieService.singleMovie(movieId, collectionName);

        // Assert
        assertTrue(actualMovie.isPresent());
        assertEquals(expectedMovie, actualMovie.get());
    }

    @Test
    void singleMovieWithInvalidIdAndCollectionNameShouldReturnEmptyOptional() {
        // Arrange
        int movieId = 1;
        String collectionName = "invalid_collection_name";
        when(mongoTemplate.findOne(any(Query.class), eq(Movie.class), eq(collectionName))).thenReturn(null);

        // Act
        Optional<Movie> actualMovie = movieService.singleMovie(movieId, collectionName);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    @Test
    void findMovieByIdWithNullIdShouldReturnEmptyOptional() {
        // Arrange
        Integer movieId = null;

        // Act
        Optional<Movie> actualMovie = movieService.findMovieById(movieId);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    @Test
    void allMoviesWithInvalidCollectionNameShouldReturnEmptyList() {
        // Arrange
        String collectionName = null;
        when(mongoTemplate.find(any(Query.class), eq(Movie.class), eq(collectionName))).thenReturn(null);

        // Act
        List<Movie> actualMovies = movieService.allMovies(collectionName);

        // Assert
        assertNull(actualMovies);
    }

    @Test
    void singleMovieWithNullIdAndCollectionNameShouldReturnEmptyOptional() {
        // Arrange
        Integer movieId = null;
        String collectionName = "collection_name";

        // Act
        Optional<Movie> actualMovie = movieService.singleMovie(movieId, collectionName);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    // @Test
    // void singleTmdbMovieWithValidIdShouldReturnOptionalMovie() {
    // // Arrange
    // Integer movieId = 603692;
    // Movie expectedMovie = new Movie();
    // expectedMovie.setId(movieId);
    // when(tmdbApi.getMovies().getMovie(eq(movieId),
    // anyString())).thenReturn(Mockito.mock(MovieDb.class));

    // // Act
    // Optional<Movie> actualMovie = movieService.singleTmdbMovie(movieId);

    // // Assert
    // assertTrue(actualMovie.isPresent());
    // assertEquals(expectedMovie, actualMovie.get());
    // }

    // @Test
    // void updateMoviesShouldSaveMovieDetailsForAllCollections() {
    // // Arrange
    // List<Movie> movies = new ArrayList<>();
    // movies.add(new Movie());
    // movies.add(new Movie());
    // movies.add(new Movie());
    // movies.add(new Movie());
    // when(movieService.allMovies("exampleCollection")).thenReturn(movies); // Act
    // movieService.updateMovies();

    // // Assert
    // verify(mongoTemplate, times(1)).save(any(Movie.class), anyString());
    // }

    // @Test
    // void updateMovieDetailsShouldUpdateMovieFields() {
    // // Arrange
    // String collectionName = "collection_name";
    // Movie movie = new Movie();
    // movie.setId(1);
    // MovieDb movieDb = new MovieDb();
    // movieDb.setBudget(1000000L);
    // movieDb.setTagline("Awesome movie");
    // when(tmdbApi.getMovies().getMovie(anyInt(),
    // anyString())).thenReturn(movieDb);
    // when(mongoTemplate.save(any(Movie.class), anyString())).thenReturn(movie);

    // // Act
    // movieService.updateMovieDetails(collectionName);

    // // Assert
    // verify(mongoTemplate).save(movie, collectionName);
    // assertEquals(movie.getBudget(), movieDb.getBudget());
    // assertEquals(movie.getTagline(), movieDb.getTagline());
    // }

}
