package com.popflix.model;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import info.movito.themoviedbapi.model.providers.ProviderResults;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.List;

class MovieTest {

    @Test
    void testMovieConstructorAndGetters() {
        ObjectId id = new ObjectId();
        Boolean adult = false;
        String backdropUrl = "https://image.tmdb.org/t/p/original/aQPeznSu7XDTrrdCtT5eLiu52Yu.jpg";
        List<Integer> genreIds = Arrays.asList(1, 2, 3);
        List<String> genres = Arrays.asList("Action", "Adventure", "Sci-Fi");
        Integer movieId = 12345;
        String originalLanguage = "en";
        String originalTitle = "Original Title";
        String overview = "Movie overview";
        Float popularity = 7.8f;
        String posterUrl = "https://image.tmdb.org/t/p/original/aQPeznSu7XDTrrdCtT5eLiu52Yu.jpg";
        String releaseDate = "2023-11-12";
        String title = "Movie Title";
        String trailer = "https://www.youtube.com/watch?v=fui1f23";
        Integer voteAverage = 82;
        Integer voteCount = 1000;
        ProviderResults providers = new ProviderResults();
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

        Movie movie = new Movie(id, adult, adult, backdropUrl, genreIds, genres, movieId, originalLanguage,
                originalTitle, overview, popularity, posterUrl, releaseDate, title, trailer, voteAverage, providers,
                voteCount, imdbId, budget, tagline, revenue, runtime, actors, actorImagePaths, reviews,
                productionCompanies,
                movieStatus);

        // Assert individual properties
        assertEquals(id, movie.getMongoId());
        assertEquals(adult, movie.getAdult());
        assertEquals(backdropUrl, movie.getBackdropUrl());
        assertEquals(genreIds, movie.getGenreIds());
        assertEquals(genres, movie.getGenres());
        assertEquals(movieId, movie.getId());
        assertEquals(originalLanguage, movie.getOriginalLanguage());
        assertEquals(originalTitle, movie.getOriginalTitle());
        assertEquals(overview, movie.getOverview());
        assertEquals(popularity, movie.getPopularity());
        assertEquals(posterUrl, movie.getPosterUrl());
        assertEquals(releaseDate, movie.getReleaseDate());
        assertEquals(title, movie.getTitle());
        assertEquals(trailer, movie.getTrailer());
        assertEquals(providers, movie.getProviderResults());
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
