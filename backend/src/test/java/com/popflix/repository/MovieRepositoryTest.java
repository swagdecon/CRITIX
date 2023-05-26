// package com.popflix.repository;

// import com.popflix.model.Movie;
// import com.popflix.service.MovieService;

// import org.bson.types.ObjectId;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// public class MovieRepositoryTest {

// @Mock
// private MovieRepository movieRepository;

// @InjectMocks
// private MovieService movieService;

// @Test
// void testFindMovieById() {
// Integer movieId = 1;
// Movie movie = new Movie();
// movie.setId(1);
// movie.setTitle("Movie Title");

// when(movieRepository.findMovieById(movieId)).thenReturn(Optional.ofNullable(movie));

// Optional<Movie> result = movieService.findMovieById(movieId);

// assertEquals(Optional.ofNullable(movie), result);
// verify(movieRepository, times(1)).findMovieById(movieId);
// }
// }
