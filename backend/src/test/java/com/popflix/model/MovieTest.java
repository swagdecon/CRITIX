package com.popflix.model;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.List;

class MovieTest {

    @Test
    void testMovieConstructorAndGetters() {
        ObjectId id = new ObjectId();
        Boolean adult = false;
        String backdropPath = "/backdrop.jpg";
        List<Integer> genreIds = Arrays.asList(1, 2, 3);
        List<String> genres = Arrays.asList("Action", "Adventure", "Sci-Fi");
        Integer movieId = 12345;
        String originalLanguage = "en";
        String originalTitle = "Original Title";
        String overview = "Movie overview";
        Float popularity = 7.8f;
        String posterPath = "/poster.jpg";
        String releaseDate = "2023-05-30";
        String title = "Movie Title";
        List<String> video = Arrays.asList("video1", "video2");
        Float voteAverage = 8.2f;
        Integer voteCount = 1000;
        String imdbId = "tt1234567";
        Long budget = 100000000L;
        String tagline = "Movie tagline";
        Long revenue = 500000000L;
        Integer runtime = 120;
        List<Person> actors = Arrays.asList(new Person(), new Person());
        List<String> actorImagePaths = Arrays.asList("/actor1.jpg", "/actor2.jpg");
        List<String> reviews = Arrays.asList("Review 1", "Review 2");
        List<String> productionCompanies = Arrays.asList("Company 1", "Company 2");
        String movieStatus = "Released";

        Movie movie = new Movie(id, adult, backdropPath, genreIds, genres, movieId, originalLanguage,
                originalTitle, overview, popularity, posterPath, releaseDate, title, video, voteAverage, voteCount,
                imdbId, budget, tagline, revenue, runtime, actors, actorImagePaths, reviews, productionCompanies,
                movieStatus);

        // Assert individual properties
        assertEquals(id, movie.getMongoId());
        assertEquals(adult, movie.getAdult());
        assertEquals(backdropPath, movie.getBackdropPath());
        assertEquals(genreIds, movie.getGenreIds());
        assertEquals(genres, movie.getGenres());
        assertEquals(movieId, movie.getId());
        assertEquals(originalLanguage, movie.getOriginalLanguage());
        assertEquals(originalTitle, movie.getOriginalTitle());
        assertEquals(overview, movie.getOverview());
        assertEquals(popularity, movie.getPopularity());
        assertEquals(posterPath, movie.getPosterPath());
        assertEquals(releaseDate, movie.getReleaseDate());
        assertEquals(title, movie.getTitle());
        assertEquals(video, movie.getVideo());
        assertEquals(voteAverage, movie.getVoteAverage());
        assertEquals(voteCount, movie.getVoteCount());
        assertEquals(imdbId, movie.getImdbId());
        assertEquals(budget, movie.getBudget());
        assertEquals(tagline, movie.getTagline());
        assertEquals(revenue, movie.getRevenue());
        assertEquals(runtime, movie.getRuntime());
        assertEquals(actors, movie.getActors());
        assertEquals(actorImagePaths, movie.getActorImagePaths());
        assertEquals(reviews, movie.getReviews());
        assertEquals(productionCompanies, movie.getProductionCompanies());
        assertEquals(movieStatus, movie.getMovieStatus());
    }

    @Test
    void testMovieToString() {
        Movie movie = new Movie();
        String toStringResult = movie.toString();
        assertTrue(toStringResult.contains("Movie"));
    }
}
