package com.popflix.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.util.ReflectionTestUtils;
import com.popflix.model.Movie;
import com.popflix.model.MovieCard;
import com.popflix.model.User;
import com.popflix.repository.MovieRepository;
import com.popflix.repository.UserRepository;
import info.movito.themoviedbapi.TmdbApi;
import io.github.cdimascio.dotenv.Dotenv;

class MovieServiceTest {
    private MovieService movieService;
    private MovieRepository movieRepository;
    private MongoTemplate mongoTemplate;
    Dotenv dotenv = Dotenv.load();
    final TmdbApi tmdbApi = new TmdbApi(dotenv.get("TMDB_API_KEY"));
    String userId = "user123";
    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        movieRepository = mock(MovieRepository.class);
        mongoTemplate = mock(MongoTemplate.class);
        movieService = new MovieService(movieRepository, mongoTemplate);
        ReflectionTestUtils.setField(movieService, "userRepository", userRepository);

    }

    @Test
    void findMovieByIdWithValidIdShouldReturnOptionalMovie() {
        // Arrange
        int movieId = 1;
        Movie expectedMovie = new Movie();
        expectedMovie.setId(movieId);
        when(movieRepository.findMovieById(movieId)).thenReturn(Optional.of(expectedMovie));

        // Act
        Optional<Movie> actualMovie = movieService.allMovies(movieId);

        // Assert
        assertTrue(actualMovie.isPresent());
        assertEquals(expectedMovie, actualMovie.get());
    }

    @Test
    void allMoviesWithInvalidIdShouldReturnEmptyOptional() {
        // Arrange
        int movieId = 1;
        when(movieRepository.findMovieById(movieId)).thenReturn(Optional.empty());

        // Act
        Optional<Movie> actualMovie = movieService.allMovies(movieId);

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
        List<Movie> actualMovies = movieService.getTop20Movies(collectionName);

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
        Optional<Movie> actualMovie = movieService.singleMovie(movieId, collectionName, userId);

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
        Optional<Movie> actualMovie = movieService.singleMovie(movieId, collectionName, userId);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    @Test
    void findMovieByIdWithNullIdShouldReturnEmptyOptional() {
        // Arrange
        Integer movieId = null;

        // Act
        Optional<Movie> actualMovie = movieService.allMovies(movieId);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    @Test
    void allMoviesWithInvalidCollectionNameShouldReturnEmptyList() {
        // Arrange
        String collectionName = null;
        when(mongoTemplate.find(any(Query.class), eq(Movie.class), eq(collectionName))).thenReturn(null);

        // Act
        List<Movie> actualMovies = movieService.getTop20Movies(collectionName);

        // Assert
        assertNull(actualMovies);
    }

    @Test
    void singleMovieWithNullIdAndCollectionNameShouldReturnEmptyOptional() {
        // Arrange
        Integer movieId = null;
        String collectionName = "collection_name";

        // Act
        Optional<Movie> actualMovie = movieService.singleMovie(movieId, collectionName, userId);

        // Assert
        assertFalse(actualMovie.isPresent());
    }

    // Adds a new movie to the user's watchlist if it doesn't already exist
    @Test
    public void test_addMovieToWatchlist_movieNotExists() throws Exception {

        // Arrange
        MovieCard movieCardData = new MovieCard();
        movieCardData.setMovieId(123);
        movieCardData.setVoteAverage(75);
        movieCardData.setTitle("Movie Title");
        movieCardData.setGenres(Collections.singletonList("Action"));
        movieCardData.setOverview("Movie Overview");
        movieCardData.setPosterUrl("https://example.com/poster.jpg");
        movieCardData.setActors(null);

        User user = new User();
        user.setId(userId);
        List<MovieCard> watchList = new ArrayList<>();
        user.setWatchList(watchList);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.doesMovieExist(userId, movieCardData.getMovieId())).thenReturn(false);

        // Act
        movieService.addMovieToWatchlist(userId, movieCardData);

        // Assert
        assertTrue(user.getWatchList().contains(movieCardData));
        assertTrue(movieCardData.getIsSavedToWatchlist());
        verify(userRepository, times(1)).save(user);
    }
}
